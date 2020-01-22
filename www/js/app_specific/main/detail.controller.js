(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('detailCtrl', control);

    control.$inject = [
        '$state',
        'mainSrvc'
        ];
    
    function control(
        $state,
        mainSrvc
    ) {
        var vm = angular.extend(this, {
            detail : ""
         });
        

        vm.done = function(){
            var path = vm.path.substr(0, vm.path.indexOf('/')); 
            $state.go('update',{path:path});
        }

        vm.detail = JSON.stringify(mainSrvc.getItem());
        vm.path = mainSrvc.getPath(); 

    }
})();