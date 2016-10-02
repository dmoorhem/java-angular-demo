(() => {
'use strict';
describe('demoService', () => {

    let instance,
        rootScope,
        $q
        $http;

    beforeEach(module('demoApp'));

    beforeEach(inject(function(  _demoService_, _$q_, _$http_, $rootScope) {
    	instance = _demoService_;
    	$q = _$q_;
        $http = _$http_;
        rootScope = $rootScope;
    }));

    it('should be defined', () => {
        expect(instance).toBeDefined();
    });

    describe('#getTime()', () => {
        beforeEach(() => {
            spyOn($http, 'get').and.returnValue($q.defer().promise);
        });

        it('gets from correct URL', () => {
            expect($http.get).toHaveBeenCalledWith('api/time');
        });

        it('resolves data from http response', done => {
            let response = {time: 'now'};
            let deferred = $q.defer();
            $http.get.and.returnValue(deferred.promise);

            instance.getTime().then(function(resolved) {
                expect(resolved).toEqual(response);
                done();
            });

            deferred.resolve({data: response});
            rootScope.$apply();
        });
    });

});
})();
