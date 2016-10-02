(() => {
'use strict';
mainModule.controller('demoController', function(
    $scope,
    $rootScope,
    demoService) {

	demoService.getTime().then(function(time) {
		$scope.time = time;
	});
});
})();
