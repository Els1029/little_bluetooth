(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('updateCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'mainSrvc'
        ];
    
    function control(
        $state,
        $stateParams,
        mainSrvc
    ) {
        
      var path = $stateParams.path;

        // TODO: Error Handling
        mainSrvc.update(path)
        .then(
            function(){
                if(Array.isArray(mainSrvc.getItem())){
                    $state.go('list');
                }else{
                    $state.go('detail'); // was detail
                }
        })
        .catch(
            function(error){
                alert("Sorry, we couldn't reach that path!" + error);
                $state.go('list');
            }
        );    
    }
})();
