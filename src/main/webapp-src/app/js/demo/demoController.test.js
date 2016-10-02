(() => {
'use strict';
describe('demoController', () => {

    let $controller,
    	$q
        scope,
        rootScope,
        demoService;

    beforeEach(module('demoApp'));

    beforeEach(inject(function( $rootScope, _demoService, _$controller_, _$q_) {
        demoService = _demoService_;
        rootScope = $rootScope;
        $controller = _$controller_;
        $q = _$q_;
        scope = $rootScope.$new();
        spyOn(demoService, 'getTime').and.returnValue($q.defer().promise);
    }));

    describe('During start up', () => {

        it('gets time', () => {
            let deferred = $q.defer(), expected = 'some value';
            
            timeService.getTime.and.returnValue(deferred.promise);

            $controller('demoController', {
                $scope: scope,
                $routeParams: {}
            });
            
            scope.$digest();

            expect(scope.time).toBeUndefined();
            deferred.resolve({data: expected});
            scope.$apply();

            expect(scope.time).toBe(expected);
        });
    });

});
})();

