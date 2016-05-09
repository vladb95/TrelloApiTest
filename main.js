angular.module('trelloApp', ['ui.materialize', 'ipCookie']);
angular.module('trelloApp').constant('KEY', '8467be5f9ddddc9638b94d598397369a');
angular.module('trelloApp').constant('TOKEN', '6d74af2535b3473bf72ac2c9c6825dc2437c097255488bae92f711be7b6a065f');

angular.module('trelloApp').controller('mainController', mainCtrl);

mainCtrl.$inject = ['mainFactory', 'ipCookie', '$timeout'];
function mainCtrl(mainFactory, ipCookie, $timeout){
  var vm = this;

  vm.trackList = [];
  vm.keys = [];
  vm.lists = [];
  vm.log = [];

  var myTimeOut;

  vm.init = function(){
    for(var i=0;i<2;i++){
      vm.keys[i] = ipCookie('key'+i);
      vm.lists[i]={
        showCards:false
      };
      vm.getBoards(i);
    }
  };

  vm.getBoards = function(keyId){
    ipCookie('key'+keyId, vm.keys[keyId]);
    mainFactory.getBoards(vm.keys[keyId]).then(function(data){
      vm.lists[keyId]={
        board: data.lists,
        showCards:false
      };
    });
  };

  vm.getList = function(id, listId){
    mainFactory.getLists(listId).then(function(data){
      vm.lists[id].showCards = true;
      vm.lists[id].cards = data.cards;
      vm.lists[id].listId = listId;
    });
  };

  vm.getData = function(id){
    if(vm.lists[id].showCards){
      console.log(id);
      mainFactory.getCard(id).then(function(data){
        console.log(data);
      });
    }
    return vm.lists[id].showCards?vm.lists[id].cards:vm.lists[id].board;
  };

  vm.trackClick = function(){
    getListsCards();
    timeout();
  };

  vm.showTrackButton = function(){
    for(var i=0;i<2;i++){
      if(!vm.lists[i].showCards){
        return false;
      }
    }
    return true;
  };

  vm.goBack = function(id){
    vm.lists[id].showCards = false;
  };

  var getListsCards = function(){
      mainFactory.getLists(vm.lists[0].listId).then(function(data) {
        vm.trackList[0] = data;
      });
      mainFactory.getLists(vm.lists[1].listId).then(function(data) {
        vm.trackList[1] = data;
      });
  }

  var timeout = function(){
    getListsCards();
    if(vm.trackList.length>0){
      mainFactory.compareLists(vm.trackList[0].cards, vm.trackList[1].cards);
    }
    myTimeOut = $timeout(timeout, 5000);
  }
}

angular.module('trelloApp').factory('mainFactory', mainFact);

mainFact.$inject = ['$q', '$http', 'KEY', 'TOKEN', 'ipCookie'];
function mainFact($q, $http, KEY, TOKEN, ipCookie){
  var getNewCards = function(cards, cookieName){
      var newCards = [];
      var addFlag = false;
      var lastCard = ipCookie(cookieName);

      for(var i=0;i<cards.length;i++){
        if(cards[i].id === lastCard.id){
          addFlag = true;
        }
        if(addFlag){
          newCards.push(cards[i]);
        }
      }
      return newCards;
  }

  var factory = {
    getBoards:function(boardId){
      var defer = $q.defer();
      $http.get('https://api.trello.com/1/boards/'+boardId,{params:{lists:'open', key:KEY, token:TOKEN}}).then(function(data){
        defer.resolve(data.data);
      },function(error){
        defer.resolve(error);
      });
      return defer.promise;
    },

    getLists:function(listId){
      var defer = $q.defer();
      $http.get('https://api.trello.com/1/lists/'+listId, {params:{cards:'all', key:KEY, token:TOKEN}}).then(function(data){
        defer.resolve(data.data);
      },function(error){
        console.log(error);
      });
      return defer.promise;
    },

    getCard: function(cardId){
      var defer = $q.defer();
      $http.get('https://api.trello.com/1/cards/'+cardId, { params: {
        fields: 'due,idMembers,name,pos',
        member_fields: 'fullName,username',
        key: KEY,
        token: TOKEN
      }}).then(function(data){

      }, function(data){
        defer.resolve(data);
      });
      return defer.promise;
    },

    addOrUpdateCard:function(listId, cardObj){
      if(cardObj === undefined){
        return null;
      }
      var card = {
        name: 'Test 2',
        desc: "Test",
        //pos: cardObj.pos,
        idList: '56f3af1d4449dcaaa1c1fc6d',
        urlSource:null
      }
      var defer = $q.defer();

      $http.post('https://api.trello.com/1/cards?key='+KEY+'&token='+TOKEN, card,{
              headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            }}).then(function(data){
        //console.log(data);
      },function(error){
        //console.log(error);
      })
      return defer.promise;
    },

    compareLists:function(firstList, secondList){
      var firstNewCard = [];
      var secondNewCard = [];
      if(firstList.length>0){
        if(!ipCookie('lastCardDate_l1')){
          ipCookie('lastCardDate_l1', JSON.stringify({
            id:firstList[firstList.length-1].id,
            date:firstList[firstList.length-1].dateLastActivity
          }));
        }else{
          firstNewCard = getNewCards(firstList ,'lastCardDate_l1');
          ipCookie('lastCardDate_l1', JSON.stringify({
            id:firstNewCard[firstList.length-1].id,
            date:firstNewCard[firstList.length-1].dateLastActivity
          }));
        }
      }
      if(secondList.length>0){
        if(!ipCookie('lastCardDate_l2')){
          ipCookie('lastCardDate_l2', JSON.stringify({
            id:secondList[secondList.length-1].id,
            date:secondList[secondList.length-1].dateLastActivity
          }));
        }else{
          secondNewCard = getNewCards(secondList ,'lastCardDate_l2');
          ipCookie('lastCardDate_l2', JSON.stringify({
            id:secondNewCard[secondList.length-1].id,
            date:secondNewCard[secondList.length-1].dateLastActivity
          }));
        }
      }
      console.log(firstNewCard);
      console.log(secondNewCard);
    }
  };

  return factory;
}
