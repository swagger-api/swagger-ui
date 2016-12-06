;(function (namespace, $) {
    'use strict';

    if (!namespace) {
        throw new Error('Swagger-JWT-Auth: Please include this extension after including the SwaggerUI library!');
    }

    var JwtAuthorization = function JwtAuthorization(options) {
        options = options || {};

        this.name = 'Authorization';
        this.headerType = options.headerType || 'Bearer';
        this.tokenString = '';
        this.token = null;
        this.tokenPropertyName = options.tokenPropertyName || 'access_token';
        this.username = options.username || undefined;
        this.password = options.password || undefined;
    };

    JwtAuthorization.prototype.apply = function (obj) {
        if (typeof obj.headers[this.name] === 'undefined') {
            obj.headers[this.name] = this.headerType + ' ' + this.tokenString;
        }

        return true;
    };

    JwtAuthorization.prototype.createPayload = function (username, password) {
        return {
            username: username,
            password: password
        };
    };

    JwtAuthorization.prototype.getToken = function (url, cb) {
        var payload = this.createPayload(this.username, this.password);

        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function (response) {
                var token;

                if (response) {
                    if (response.error) {
                        cb(new Error('JWT auth error:' + response.error));
                    }

                    if (response.status === 401 || response.status === 403) {
                        cb(new Error('JWT auth error: Authentication failed! Status code: ' + response.code));
                    }

                    token = response[this.tokenPropertyName];

                    if (!token) {
                        cb(new Error('JWT auth error: Unable to find token from the response with property name: ' +
                            this.tokenPropertyName));
                    }

                    try {
                        this.token = this.parseToken(token);
                    } catch (e) {
                        cb(new Error('JWT auth error: Received invalid JWT token!'));
                    }

                    this.tokenString = token;

                    cb(null, token);
                }

            }.bind(this),

            error: function (response) {
                cb(new Error('JWT auth error: Authentication failed! Status code: ' + response.status));
            }
        });
    };

    JwtAuthorization.prototype.parseToken = function (token) {
        var tokenArr, base64;

        // Skip the validation if atob() is not available, e.g. in IE8-IE10
        // A proper polyfill should be provided outside of this module, if required.
        if (!window.atob) {
            return;
        }

        tokenArr = token.split('.');

        if (tokenArr.length !== 3) {
            throw new Error('JwtAuthorization::parseToken: Invalid JWT Token!')
        }

        base64 = tokenArr[1].replace('-', '+').replace('_', '/');

        return JSON.parse(window.atob(base64))
    };


    namespace['JwtAuthorization'] = JwtAuthorization;

}(window.SwaggerUi, $));
