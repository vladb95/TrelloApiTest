angular.module('trelloApp', ['ui.materialize', 'ipCookie']);
angular.module('trelloApp').constant('KEY', '8467be5f9ddddc9638b94d598397369a');
angular.module('trelloApp').constant('TOKEN', '6d74af2535b3473bf72ac2c9c6825dc2437c097255488bae92f711be7b6a065f');

angular.module('trelloApp').controller('mainController', mainCtrl);

mainCtrl.$inject = ['mainFactory', 'ipCookie'];
function mainCtrl(mainFactory, ipCookie){
  var vm = this;

  vm.keys = [];
  vm.lists = [];
  vm.log = [];

  vm.init = function(){
    for(var i=0;i<2;i++){
      vm.keys[i] = ipCookie('key'+i);
      vm.lists[i]={
        showCards:false
      };
      vm.getBoards(i);
    }
  }

  vm.getBoards = function(keyId){
    ipCookie('key'+keyId, vm.keys[keyId]);
    mainFactory.getBoards(vm.keys[keyId]).then(function(data){
      vm.lists[keyId]={
        board: data.lists,
        showCards:false
      };
    });
  }

  vm.getList = function(id, listId){
    mainFactory.getLists(listId).then(function(data){
      vm.lists[id].showCards = true;
      vm.lists[id].cards = data.cards;
      vm.lists[id].listId = listId;
    });
  }

  vm.getData = function(id){
    return vm.lists[id].showCards?vm.lists[id].cards:vm.lists[id].board;
  }

  vm.listClickEvent = function(){

  }

  vm.goBack = function(id){
    vm.lists[id].showCards = false;
  }
}

angular.module('trelloApp').factory('mainFactory', mainFact);

mainFact.$inject = ['$q', '$http', 'KEY', 'TOKEN'];
function mainFact($q, $http, KEY, TOKEN){
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
    trackLists:function(firstListId, secondListId){

    }
  };

  return factory;
}
