'use strict';

SwaggerUi.Views.AuthView = Backbone.View.extend({
    events: {
        'click .authorize__btn': 'authorizeBtnClick',
        'click .logout__btn' : 'logoutClick'
    },

    tpls: {
        popup: Handlebars.templates.popup,
        authBtn: Handlebars.templates.auth_button
    },

    initialize: function(opts) {
        this.options = opts || {};
        this.router = this.options.router;
    },

    render: function () {
        this.$el.html(this.tpls.authBtn(this.model));

        return this;
    },

    authorizeBtnClick: function (e) {
        var authsModel;
        e.preventDefault();

        authsModel = {
            title: 'Available authorizations',
            content: this.renderAuths(this.model.auths)
        };

        this.popup = new SwaggerUi.Views.PopupView({model: authsModel});
        this.popup.render();
    },

    renderAuths: function (auths) {
        var name, authEl, auth;
        var el = $('<div>');

        //todo refactor, copy-pasted from MainView.js
        for (name in auths) {
            auth = auths[name];

            if (auth.type === 'apiKey') {
                authEl = new SwaggerUi.Views.ApiKeyButton({model: auth, router: this.router}).render().el;
                el.append(authEl);
            } else if (auth.type === 'basic' && el.find('.basic_auth_container').length === 0) {
                authEl = new SwaggerUi.Views.BasicAuthButton({model: auth, router: this.router}).render().el;
                el.append(authEl);
            }
        }

        return el;
    },

    logoutClick: function (e) {
        var authsModel;

        e.preventDefault();

        authsModel = {
            title: 'Logout authorizations',
            content: this.renderAuths(this.getAuthMap())
        };

        this.popup = new SwaggerUi.Views.PopupView({model: authsModel});
        this.popup.render();
    },

    getAuthMap: function () {
        var authsMap = {};

        _.forEach(window.swaggerUi.api.clientAuthorizations.authz, function (value, key) {
            if (key === 'basic') {
                authsMap.basic = {
                    type: key,
                    isLogout: true,
                    name: key
                };
            } else {
                authsMap[key] = {
                    type: 'apiKey',
                    'in': value.type,
                    value: value.value,
                    isLogout: true,
                    name: key
                };
            }
        });

        return authsMap;
    }

});
