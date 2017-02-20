'use strict';

/* global redirect_uri:true */
/* global clientId */
/* global scopeSeparator */
/* global additionalQueryStringParams */
/* global clientSecret */
/* global onOAuthComplete */
/* global realm */
/*jshint unused:false*/

SwaggerUi.Views.AuthView = Backbone.View.extend({
    events: {
        'click .auth_submit__button': 'authorizeClick',
        'click .auth_logout__button': 'logoutClick'
    },

    tpls: {
        main: Handlebars.templates.auth_view
    },

    selectors: {
        innerEl: '.auth_inner',
        authBtn: '.auth_submit__button'
    },

    initialize: function(opts) {
        this.options = opts || {};
        opts.data = opts.data || {};
        this.router = this.options.router;

        this.authsCollectionView = new SwaggerUi.Views.AuthsCollectionView({data: opts.data});

        this.$el.html(this.tpls.main({
            isLogout: this.authsCollectionView.collection.isAuthorized(),
            isAuthorized: this.authsCollectionView.collection.isPartiallyAuthorized()
        }));
        this.$innerEl = this.$(this.selectors.innerEl);
        this.isLogout = this.authsCollectionView.collection.isPartiallyAuthorized();
    },

    render: function () {
        this.$innerEl.html(this.authsCollectionView.render().el);

        return this;
    },

    authorizeClick: function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.authsCollectionView.collection.isValid()) {
            this.authorize();
        } else {
            this.authsCollectionView.highlightInvalid();
        }
    },

    authorize: function () {
        this.authsCollectionView.collection.forEach(function (auth) {
            var keyAuth, basicAuth;
            var type = auth.get('type');

            if (type === 'apiKey') {
                keyAuth = new SwaggerClient.ApiKeyAuthorization(
                    auth.get('name'),
                    auth.get('value'),
                    auth.get('in')
                );

                this.router.api.clientAuthorizations.add(auth.get('title'), keyAuth);
            } else if (type === 'basic') {
                basicAuth = new SwaggerClient.PasswordAuthorization(auth.get('username'), auth.get('password'));
                this.router.api.clientAuthorizations.add(auth.get('title'), basicAuth);
            } else if (type === 'oauth2') {
                this.handleOauth2Login(auth);
            }
        }, this);

        this.router.load();
    },

    logoutClick: function (e) {
        e.preventDefault();

        this.authsCollectionView.collection.forEach(function (auth) {
            window.swaggerUi.api.clientAuthorizations.remove(auth.get('title'));
        });

        this.router.load();
    },

    // taken from lib/swagger-oauth.js
    handleOauth2Login: function (auth) {
        var host = window.location;
        var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        var defaultRedirectUrl = host.protocol + '//' + host.host + pathname + '/o2c.html';
        var redirectUrl = window.oAuthRedirectUrl || defaultRedirectUrl;
        var url = null;
        var scopes = _.map(auth.get('scopes'), function (scope) {
            if(scope.checked) {
                return scope.scope;
            }
        });
        var container = window.swaggerUiAuth || (window.swaggerUiAuth = {});
        var state, dets, ep;
        container.OAuthSchemeKey = auth.get('title');

        window.enabledScopes = scopes;
        var flow = auth.get('flow');

        /**
         * Returns the name of the access token parameter returned by the server.
         *
         * @param dets
         *     The authorisation scheme configuration.
         * @return the name of the access token parameter
         */
        function getTokenName(dets) {
            return dets.vendorExtensions['x-tokenName'] || dets.tokenName;
        }

        if(auth.get('type') === 'oauth2' && flow && (flow === 'implicit' || flow === 'accessCode')) {
            dets = auth.attributes;
            url = dets.authorizationUrl + '?response_type=' + (flow === 'implicit' ? 'token' : 'code');
            container.tokenName = getTokenName(dets) || 'access_token';
            container.tokenUrl = (flow === 'accessCode' ? dets.tokenUrl : null);
            state = container.OAuthSchemeKey;
        }
        else if(auth.get('type') === 'oauth2' && flow && (flow === 'application')) {
            dets = auth.attributes;
            container.tokenName = getTokenName(dets) || 'access_token';
            this.clientCredentialsFlow(scopes, dets, container.OAuthSchemeKey);
            return;
        }
        else if(auth.get('type') === 'oauth2' && flow && (flow === 'password')) {
            dets = auth.attributes;
            container.tokenName = getTokenName(dets) || 'access_token';
            this.passwordFlow(scopes, dets, container.OAuthSchemeKey);
            return;
        }
        else if(auth.get('grantTypes')) {
            // 1.2 support
            var o = auth.get('grantTypes');
            for(var t in o) {
                if(o.hasOwnProperty(t) && t === 'implicit') {
                    dets = o[t];
                    ep = dets.loginEndpoint.url;
                    url = dets.loginEndpoint.url + '?response_type=token';
                    container.tokenName = getTokenName(dets);
                }
                else if (o.hasOwnProperty(t) && t === 'accessCode') {
                    dets = o[t];
                    ep = dets.tokenRequestEndpoint.url;
                    url = dets.tokenRequestEndpoint.url + '?response_type=code';
                    container.tokenName = getTokenName(dets);
                }
            }
        }

        redirect_uri = redirectUrl;

        url += '&redirect_uri=' + encodeURIComponent(redirectUrl);
        url += '&realm=' + encodeURIComponent(realm);
        url += '&client_id=' + encodeURIComponent(clientId);
        url += '&scope=' + encodeURIComponent(scopes.join(scopeSeparator));
        url += '&state=' + encodeURIComponent(state);
        for (var key in additionalQueryStringParams) {
            url += '&' + key + '=' + encodeURIComponent(additionalQueryStringParams[key]);
        }

        window.open(url);
    },

    // taken from lib/swagger-oauth.js
    clientCredentialsFlow: function (scopes, oauth, OAuthSchemeKey) {
        this.accessTokenRequest(scopes, oauth, OAuthSchemeKey, 'client_credentials');
    },

    passwordFlow: function (scopes, oauth, OAuthSchemeKey) {
        this.accessTokenRequest(scopes, oauth, OAuthSchemeKey, 'password', {
            'username': oauth.username,
            'password': oauth.password
        });
    },

    accessTokenRequest: function (scopes, oauth, OAuthSchemeKey, grantType, params) {
        params = $.extend({}, {
            'scope': scopes.join(' '),
            'grant_type': grantType
        }, params);

        var headers= {};

        switch (oauth.clientAuthenticationType) {
            case 'basic':
                headers.Authorization = 'Basic ' + btoa(oauth.clientId + ':' + oauth.clientSecret);
                break;
            case 'request-body':
                params.client_id = oauth.clientId;
                params.client_secret = oauth.clientSecret;
                break;
        }

        $.ajax({
            url : oauth.tokenUrl,
            type: 'POST',
            data: params,
            headers: headers,
            success: function (data)
            {
                onOAuthComplete(data, OAuthSchemeKey);
            },
            error: function ()
            {
                onOAuthComplete('');
            }
        });
    }
});
