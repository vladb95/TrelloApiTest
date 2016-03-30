angular.module('trelloApp', []);
angular.module('trelloApp').constant('KEY', '8467be5f9ddddc9638b94d598397369a');
angular.module('trelloApp').constant('TOKEN', '6d74af2535b3473bf72ac2c9c6825dc2437c097255488bae92f711be7b6a065f');

angular.module('trelloApp').controller('mainController', mainCtrl);

mainCtrl.$inject = ['mainFactory'];
function mainCtrl(mainFactory){
  var vm = this;

  vm.init = function(){
    mainFactory.getBoards('mhTJZBYQ').then(function(data){
      console.log(data);
    });
    mainFactory.getLists('56f3af1d4449dcaaa1c1fc6d').then(function(data){
      console.log(data);
    })
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
    }
  };

  return factory;
}
