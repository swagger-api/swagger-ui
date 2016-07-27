'use strict';

SwaggerUi.Views.LoginView = Backbone.View.extend({
    el: '#main-container',
    template: Handlebars.templates.login,
    className: 'body-login-page',

    events: {
        'submit form': 'onFormSubmit',
        'keyup input': 'onInputChange',

        //autofill hack to catch all browser change events
        'change input': 'onInputChange'
    },

    render: function () {
        this.$el.html(this.template());

        this.ui = {
            $tenant: this.$el.find('#tenant').focus(),
            $user: this.$el.find('#user'),
            $pass: this.$el.find('#pass'),

            $submit: this.$el.find('button')
        };

        //hide tenant control when OnPremise deployment
        /*global Intapp */
        if (typeof Intapp !== undefined && Intapp.Config.Deployment === 'OnPremise') {
            this.ui.$tenant.hide();
        } else {
            this.ui.$tenant.val(location.hostname.split('.')[0].split('-')[1]);
        }

        return this;
    },

    remove: function() {
        this.$el.empty();
        this.undelegateEvents();
    },

    onInputChange: function(e) {
        var self = this,
            $target = $(e.target),
            $container = $target.closest('div'),
            value = $target.val();

        if(e.which !== 13) {
            $container[value ? 'removeClass' : 'addClass']('is-invalid');
            setTimeout(function() { self.ui.$submit.prop('disabled', !self.isValidForm()); });
        }
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
                window.swaggerUi.load();
            },
            error: function (response) {
                window.alert(JSON.parse(response.responseText).error);
                $btn.prop('disabled', false).text('Log In');
            }
        });

        e.preventDefault();
        e.stopPropagation();

        return false;
    },

    isValidForm: function() {
        var isTenantValid = Intapp.Config.Deployment === 'OnPremise' ? true : !!this.ui.$tenant.val(),
            isUserPassValid = this.ui.$user.is(':-webkit-autofill') || (!!this.ui.$user.val() && !!this.ui.$pass.val());

        return isTenantValid && isUserPassValid;
    }
});