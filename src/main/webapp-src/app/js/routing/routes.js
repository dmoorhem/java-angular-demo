(() => {
'use strict';
demoApp.config(function($routeProvider) {
    let VIEWS_FOLDER = 'html/views/demo/';

    $routeProvider
        .when('/', {
            redirectTo: '/landing'
        })
        .when('/landing', {
            templateUrl: VIEWS_FOLDER + 'landing.html',
            controller: 'demoController',
            controllerAs: 'demoCtrl'
        })
        .otherwise({
            redirectTo: '/landing'
        });
});
})();
