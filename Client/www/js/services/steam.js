'use strict';

app.service('steamService', ['ServerConfig', '$q', '$http',
        function (ServerConfig, $q, $http) {

            this.getFriendList = function (steamID) {
                var deferred = $q.defer();

                $http.post('/api/friendList', {
                    code: steamID
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error.data.message);
                });

                return deferred.promise;
            };
        }]
);
