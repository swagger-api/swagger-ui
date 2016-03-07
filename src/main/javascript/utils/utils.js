'use strict';

window.SwaggerUi.utils = {
    parseSecurityDefinitions: function (security) {
        var auths = window.swaggerUi.api.authSchemes || window.swaggerUi.api.securityDefinitions;
        var result = [];

        if (!Array.isArray(security)) { return null; }

        security.forEach(function (item) {
            var singleSecurity = {};

            for (var key in item) {
                if (Array.isArray(item[key])) {
                    if (!auths[key]) { continue; }
                    auths[key] = auths[key] || {};
                    singleSecurity[key] = auths[key];
                    if (auths[key].type === 'oauth2') {
                        for (var i in singleSecurity[key].scopes) {
                            if (item[key].indexOf(i) < 0) {
                                delete singleSecurity[key].scopes[i];
                            }
                        }
                    }
                } else {
                    singleSecurity[key] = item[key];
                }
            }

            result.push(singleSecurity);
        });

        return result;
    }
};