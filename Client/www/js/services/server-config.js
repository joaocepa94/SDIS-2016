'use strict';

app.provider('ServerConfig', [function () {
    var baseUrl = {
        dev: 'localhost:3000/api',
        bin: ''
    };

    this.baseUrl = baseUrl.dev;
    
    var self = this;
    this.$get = function() {
        return {
            baseUrl: self.baseUrl
        };
    };

    this.setProductionMode = function(productionMode) {
        if (productionMode)
            this.baseUrl = baseUrl.bin;
        else
            this.baseUrl = baseUrl.dev;
    };
    
}]);