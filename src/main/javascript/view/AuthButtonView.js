'use strict';

SwaggerUi.Views.AuthButtonView = Backbone.View.extend({
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
        var $el = $('<div>');

        auths.forEach(function (auth) {
            var authEl = new SwaggerUi.Views.AuthView({data: auth, router: this.router}).render().el;
            $el.append(authEl);
        }, this);

        return $el;
    }

});
