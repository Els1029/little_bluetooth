(function () {
    'use strict';

    angular
        .module('authenticatejs')
        .controller('authenticateIntroCtrl', control);

    control.$inject = [
        '$state',
        'authenticateSrvc'
        ];
    
    function control(
        $state,
        authenticateSrvc

    ) {
        var vm = angular.extend(this, {

         });
        
        
         function update(){
            vm.isLoggedIn = authenticateSrvc.isAuthenticated();
         }

        vm.login = function(){
          authenticateSrvc.authenticate().then(
              update,
              update
          );
        }     
        
        vm.logout = function(){
            authenticateSrvc.clear();
            update();
          }   
        
        vm.goBack = function(){
            $state.go('list');
        }

        update();


    }
})();
