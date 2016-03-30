angular.module('trelloApp', []);

angular.module('trelloApp').controller('mainController', mainCtrl);

mainCtrl.$inject = ['mainFactory'];
function mainCtrl(mainFactory){
  var vm = this;
}

angular.module('trelloApp').factory('mainFactory', mainFact);

mainFact.$inject = [];
function mainFact(){
  var factory = {};

  return factory;
}
