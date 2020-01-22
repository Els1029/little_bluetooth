(function() {
	'use strict';

	angular
		.module('mainjs', [
		])
        .config(function($stateProvider) {
			$stateProvider
				.state('list', {
					cache: false,
					url: '/list',
					templateUrl: 'js/app_specific/main/list.html',
                    controller: 'listCtrl as vm'
                })
                .state('update', {
					cache: false,
					url: '/update',
					templateUrl: 'js/app_specific/main/update.html',
					controller: 'updateCtrl as vm',
					params: {'path': ''}
                })
                .state('detail', {
					cache: false,
					url: '/detail',
                    templateUrl: 'js/app_specific/main/detail.html',
                    params: {'selected': 0 },
                    controller: 'detailCtrl as vm'
                })
            });
				
})();