//const blecon = require(ble);

(function () {
    'use strict';

    angular
        .module('mainjs')
        .factory('mainSrvc', mainSrvc);

    mainSrvc.$inject = [
        '$q', // promises service
        '$timeout', // timeout service
        'moment', // does dates really well
        'authenticateSrvc' // holds the auth token
    ];

    function mainSrvc(
        $q,
        $timeout,
        moment,
        authenticateSrvc
    ) {
        
        
        var item = null;
        
        var itemPath = ""
        var service = {

        };



        // Downloads file contents
        // download_uri : temporary authenticated uri for a file (retrieved from file meta data)  
        function downloadContents(download_uri) {
            return new Promise(function (resolve, reject) {
                var download_request = new XMLHttpRequest();
                download_request.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            resolve([this.status, download_request.responseText]);
                        } else {
                            reject([this.status, download_request.responseText]);
                        }
                    }
                }
                download_request.open("GET", download_uri, true);
                download_request.send();
            });
        }

        function queryMetadata(token, uri) {
            return new Promise(function (resolve, reject) {


                var metaData_request = new XMLHttpRequest();

                metaData_request.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            resolve([this.status, metaData_request.responseText]);
                        } else {
                            reject([this.status, metaData_request.responseText]);
                        }
                    }
                };
                metaData_request.open("GET", uri, true);
                metaData_request.setRequestHeader("Authorization", "bearer " + token);
                metaData_request.send();
            });

        }







        function queryPath(token, path) {
            return new Promise(function (resolve, reject) {

                var uriStem = "https://graph.microsoft.com/v1.0/me/drive/root";

                var rootComponent = "/children"; // special case
                var uriComponent = rootComponent;
                if((!path == null)||(path.length>0)){
                    uriComponent = ":/" + path;
                }

                var uri = uriStem + uriComponent;

                queryMetadata(token, uri)
                .then(function (response) {
                    var result = JSON.parse(response[1]);   
                    if(Array.isArray(result.value)){
                        // this is the response of the root:/children endpoint
                        // each array item looks like this:
                        // {"createdDateTime":"2019-09-23T13:58:48Z","eTag":"\"{6E335610-8209-4FD4-B265-CD1626A346F6},1\"","id":"01GHONCGQQKYZW4CMC2RH3EZONCYTKGRXW","lastModifiedDateTime":"2019-09-23T13:58:48Z","name":"Appatella","webUrl":"https://stummuac-my.sharepoint.com/personal/55118836_ad_mmu_ac_uk/Documents/Appatella","cTag":"\"c:{6E335610-8209-4FD4-B265-CD1626A346F6},0\"","size":3154456,"createdBy":{"user":{"email":"L.Cooper@mmu.ac.uk","id":"2b378f77-5e47-4ee8-afcb-b5f8aa600bc4","displayName":"Laurie Cooper"}},"lastModifiedBy":{"user":{"email":"L.Cooper@mmu.ac.uk","id":"2b378f77-5e47-4ee8-afcb-b5f8aa600bc4","displayName":"Laurie Cooper"}},"parentReference":{"driveId":"b!wiFsUOXyAEyQGH3V6DHf8YXHIoDRXOxJhjN337XFN1Vdl-yWdkEPQbY4DeA8XwDt","driveType":"business","id":"01GHONCGV6Y2GOVW7725BZO354PWSELRRZ","path":"/drive/root:"},"fileSystemInfo":{"createdDateTime":"2019-09-23T13:58:48Z","lastModifiedDateTime":"2019-09-23T13:58:48Z"},"folder":{"childCount":5},"shared":{"scope":"users"}}
                        resolve(result.value);
                    }else{
                        if(result.folder==null){
                            downloadContents(result["@microsoft.graph.downloadUrl"])
                            .then(
                                function(result){
                                    resolve(result[1]);
                                }
                            )
                            .catch(
                                function(error){
                                    reject(error);
                                });
                        }else{
                            queryMetadata(token,uri + ":/children")
                            .then(
                                function(response){
                                    // we know this is an array
                                    var children = JSON.parse(response[1]); 
                                    resolve(children.value);  
                                }
                            )
                            .catch(
                                function(error){
                                    reject(error);
                                }
                            )
                        }
                    }
                })  
                .catch(
                    function (error) {
                        reject(error);
                    }
                );
            
        });
    }


        service.update = function (path) {
            var token = null;

            try{
                var authInfo = authenticateSrvc.getAuthInfo();
                token = authInfo.access_token;
            }catch(e){
                // ignore this. Pass null to async function. Allow to fail there.
            }


           return new Promise(function(resolve,reject){
                queryPath(token, path)
                .then(  
                    function(response){
                        
                        ble.enable(
                            function() {
                                console.log("Bluetooth is enabled");
                            },
                            function() {
                                console.log("The user did *not* enable Bluetooth");
                            }
                        );
                        item = [];
                        ble.startScan([],10, new function(devices){
                            alert(devices);
                            item.push(devices);
                            //itemPath = path;
                        });

                        // setTimeout(ble.stopScan,
                        //     10000,
                        //     function() { resolve(item); },
                        //     function() { alert("stopScan failed"); }
                        // );
                        resolve(item);
                        // item = response;
                        // itemPath = path;
                        // resolve(item);

                        //bluetooth serial code
                        // ble.isEnabled(
                        //     new function(){
                        //         alert("got here");
                        //         ble.startScan([],new function(device) {
                        //             alert("Started scanning");
                        //             item = device;
                        //             itemPath = path;
                        //             ble.stopScan(new function(){resolve(item);}, new function(){alert("Stop scan failed");});
                        //             //resolve(item);
                        //         },new function(){
                        //         item = null;
                        //         itemPath = "";
                        //         reject(error);
                        //         });

                        //         //ble.scan([])
                        //     },
                        //     function() {
                        //         ble.enable(new function(){}, function(){alert('You need to enable bluetooth to use this app!');});

                        //         item = null;
                        //         itemPath = "";
                        //         reject(error);
                        // });
                        // bluetoothSerial.enable(
                        //     function() {

                                /*bluetoothSerial.discoverUnpaired(
                                    function(devices) {
                                        item = devices;
                                        //itemPath = path;
                                        resolve(item);
                                    }, 
                                    function() {
                                        item = response;
                                        itemPath = path;
                                        resolve(item);
                                        alert("Press 'Authenticate'.");
                                    });//*/
                                
                                    // ble.scan([],5, function(device) {
                                    //     item = device;
                                    //     itemPath = path;
                                    //     console.log("GOT HERE");
                                    //     resolve(item);
                                    // },  function(){
                                    // item = null;
                                    // itemPath = "";
                                    // reject(error);
                                    // });
                            //},
                                // item = response;
                                // itemPath = path;
                                // resolve(item);
                                // alert("Press 'Authenticate'.");

                                // ble.scan([],5, function(device) {
                                //     item = device;
                                //     itemPath = path;
                                //     resolve(item);
                                // },  function(){
                                // item = null;
                                // itemPath = "";
                                // reject(error);

                                // ble.scan([], 5, function(device) {
                                //     console.log(JSON.stringify(device));
                                // }, failure);
                            // });
                            //});
                        //});//*/

                    })
                .catch(function(error){
                    item = null;
                    itemPath = "";
                    reject(error);
                });
            }); 
        }


        service.getPath = function(){
            return itemPath;
        }

        service.getItem = function(){
            return item;
        }

        return service;

    }


})();