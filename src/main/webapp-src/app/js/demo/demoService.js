(() => {
'use strict';

mainModule.factory('demoService', function($http) {

    function getTime() {
    	
        let URL = '/api/time';
        
        return $http.get(URL).then(function(response) {
        	return response.data.time;
        });
    }

    return {
        getTime: getTime
    };
});
})();
