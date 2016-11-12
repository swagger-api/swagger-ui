'use strict';

SwaggerUi.Views.Oauth2View = Backbone.View.extend({
    events: {
        'change .oauth-scope': 'scopeChange',
        'change .oauth-username': 'setUsername',
        'change .oauth-password': 'setPassword'
    },

    template: Handlebars.templates.oauth2,

    cls: {
        error: 'error'
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    scopeChange: function (e) {
        var val = $(e.target).prop('checked');
        var scope = $(e.target).data('scope');

        this.model.setScopes(scope, val);
    },

    setUsername: function (e) {
        var val= $(e.target).val();
        this.model.set('username', val);
        if (val) {
            $(e.target).removeClass(this.cls.error);
        }
    },

    setPassword: function (e) {
        this.model.set('password', $(e.target).val());
    },

    highlightInvalid: function () {
        if (!this.model.get('username')) {
            this.$el.find('.oauth-username').addClass(this.cls.error);
        }
    }
});