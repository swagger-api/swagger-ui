'use strict';

SwaggerUi.Views.LoginView = Backbone.View.extend({
    template: Handlebars.templates.login,
    className: 'body-login-page',

    events: {
        'submit form': 'onFormSubmit',
        'keyup input': 'onInputChange'
    },

    render: function () {
        this.$el.html(this.template());

        this.ui = {
            $tenant: this.$el.find('#tenant'),
            $user: this.$el.find('#user'),
            $pass: this.$el.find('#pass'),

            $submit: this.$el.find('button')
        };

        return this;
    },

    onInputChange: function(options) {
        var $target = $(options.target),
            $container = $target.closest('div'),
            value = $target.val();

        $container[value ? 'removeClass' : 'addClass']('is-invalid');
        this.ui.$submit.prop('disabled', !this.isValidForm());
    },

    onFormSubmit: function(e) {
        if(!this.isValidForm()) {
            return;
        }

        var host = window.location;
        var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        var tokenUrl = host.protocol + '//' + host.host + pathname.replace('swagger2', 'token');
        var $btn = this.ui.$submit;

        $btn.prop('disabled', true).text('Logging in...');

        $.ajax({
            url: tokenUrl,
            type: 'post',
            contenttype: 'x-www-form-urlencoded',
            data: 'grant_type=password&username=' + this.ui.$user.val() + '&password=' + this.ui.$pass.val() + '&tenantId=' + this.ui.$tenant.val() + '&extend=roles',
            success: function (response) {
                var bearerToken = 'Bearer ' + response.access_token,
                    apiKeyAuth = new SwaggerClient.ApiKeyAuthorization('Authorization', bearerToken, 'header');

                //set supported HTTP methods
                window.swaggerUi.options.supportedSubmitMethods = (response.roles || []).indexOf('Admin') >= 0 ? ['get', 'post', 'put', 'delete', 'patch'] : ['get'];

                //set swagger client auth
                if(window.swaggerUi.api) {
                    window.swaggerUi.api.clientAuthorizations.add('Authorization', apiKeyAuth);
                } else {
                    window.swaggerUi.options.authorizations = {'Authorization': apiKeyAuth};
                }

                //navigate to main form
                Backbone.history.navigate('', true);
            },
            error: function (response) {
                window.alert(JSON.parse(response.responseText).error);
                $btn.prop('disabled', false).text('Log In');
            }
        });

        e.preventDefault();
    },

    isValidForm: function() {
        return !!this.ui.$tenant.val() && !!this.ui.$user.val() && !!this.ui.$pass.val();
    }

});