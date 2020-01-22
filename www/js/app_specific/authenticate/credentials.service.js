(function () {
    'use strict';

    angular
        .module('authenticatejs')
        .factory('credentialsSrvc', credentialsSrvc);

        credentialsSrvc.$inject = [

        ];

    function credentialsSrvc(
 
    ) {

        var service = {
           
            clientId: 'dabc0641-14b9-4c5f-8956-73693bbc3821',
            redirectShort: "http://localhost/callback",
            redirectUri: "http://localhost/callback.html",
            scopes: "sites.read.all",
            authServiceUri: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
            
        };


        return service;

    }

    
})();