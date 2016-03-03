'use strict';

SwaggerUi.Views.AuthView = Backbone.View.extend({
    events: {
        'click .authorize__btn': 'authorizeBtnClick'
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
        var name, authEl, authModel;
        var el = $('<div>');
        var authz = window.swaggerUi.api.clientAuthorizations.authz;

        for (name in auths) {
            authModel = _.extend({}, auths[name]);

            if (authz[name]) {
                _.extend(authModel, {
                    isLogout: true,
                    value: authz[name].value
                });
            }

            if (authModel.type === 'apiKey') {
                authEl = new SwaggerUi.Views.ApiKeyButton({model: authModel, router: this.router}).render().el;
                el.append(authEl);
            } else if (authModel.type === 'basic' && el.find('.basic_auth_container').length === 0) {
                authEl = new SwaggerUi.Views.BasicAuthButton({model: authModel, router: this.router}).render().el;
                el.append(authEl);
            }
        }

        return el;
    }

});
