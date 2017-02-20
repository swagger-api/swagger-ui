'use strict';

SwaggerUi.Views.Oauth2View = Backbone.View.extend({
    events: {
        'change .oauth-scope': 'scopeChange',
        'change .oauth-username': 'setUsername',
        'change .oauth-password': 'setPassword',
        'change .oauth-client-authentication-type': 'setClientAuthenticationType',
        'change .oauth-client-id': 'setClientId',
        'change .oauth-client-secret': 'setClientSecret'
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

    setClientAuthenticationType: function (e) {
        var type = $(e.target).val();
        var $el = this.$el;
        this.model.set('clientAuthenticationType', type);

        switch(type) {
            case 'none':
                $el.find('.oauth-client-authentication').hide();
                break;
            case 'basic':
            case 'request-body':
                $el.find('.oauth-client-id').removeClass(this.cls.error);
                $el.find('.oauth-client-authentication').show();
                break;
        }
    },

    setClientId: function (e) {
        var val = $(e.target).val();
        this.model.set('clientId', val);
        if (val) {
            $(e.target).removeClass(this.cls.error);
        }
    },

    setClientSecret: function (e) {
        this.model.set('clientSecret', $(e.target).val());
        $(e.target).removeClass('error');
    },

    highlightInvalid: function () {
        if (!this.model.get('username')) {
            this.$el.find('.oauth-username').addClass(this.cls.error);
        }

        if (!this.model.get('clientId')) {
            this.$el.find('.oauth-client-id').addClass(this.cls.error);
        }
    }
});