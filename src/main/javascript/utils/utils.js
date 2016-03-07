'use strict';

window.SwaggerUi.utils = {
    parseSecurityDefinitions: function (security) {
        var auths = window.swaggerUi.api.authSchemes || window.swaggerUi.api.securityDefinitions;
        var oauth2Arr = [];
        var authsArr = [];

        if (!Array.isArray(security)) { return null; }

        security.forEach(function (item) {
            var singleSecurity = {};
            var singleOauth2Security = {};

            for (var key in item) {
                if (Array.isArray(item[key])) {
                    if (!auths[key]) { continue; }
                    auths[key] = auths[key] || {};
                    if (auths[key].type === 'oauth2') {
                        singleOauth2Security[key] = auths[key];
                        for (var i in singleOauth2Security[key].scopes) {
                            if (item[key].indexOf(i) < 0) {
                                delete singleOauth2Security[key].scopes[i];
                            }
                        }
                    } else {
                        singleSecurity[key] = auths[key];
                    }
                } else {
                    if (item[key].type === 'oauth2') {
                        singleOauth2Security[key] = item[key];
                    } else {
                        singleSecurity[key] = item[key];
                    }
                }
            }

            authsArr.push(singleSecurity);
            oauth2Arr.push(singleOauth2Security);
        });

        return {
            auths : authsArr,
            oauth2: oauth2Arr
        };
    }
};