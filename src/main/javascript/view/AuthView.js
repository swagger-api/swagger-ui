'use strict';

SwaggerUi.Views.AuthView = Backbone.View.extend({
    events: {
        'click .authorize__btn': 'authorizeBtnClick'
    },

    tpls: {
        popup: Handlebars.templates.popup,
        authBtn: Handlebars.templates.auth_button
    },

    initialize: function(){},

    render: function () {
        this.$el.html(this.tpls.authBtn());

        return this;
    },

    authorizeBtnClick: function (e) {
        var authsModel;
        e.preventDefault();

        authsModel = {title: 'Please authorize', content: this.renderAuths()};

        this.popup = new SwaggerUi.Views.PopupView({model: authsModel});
        this.popup.render();
    },

    renderAuths: function () {
        var name, authEl, auth;
        var el = $('<div>');

        //todo refactor, copy-pasted from MainView.js
        for (name in this.model) {
            auth = this.model[name];

            if (auth.type === 'apiKey') {
                authEl = new SwaggerUi.Views.ApiKeyButton({model: auth, router:  this.router}).render().el;
                el.append(authEl);
            }

            if (auth.type === 'basic' && el.find('.basic_auth_container').length === 0) {
                authEl = new SwaggerUi.Views.BasicAuthButton({model: auth, router: this.router}).render().el;
                el.append(authEl);
            }
        }

        return el.html();
    }
});
