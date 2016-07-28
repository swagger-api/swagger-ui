'use strict';

SwaggerUi.Views.LoginView = Backbone.View.extend({
    el: '#main-container',
    template: Handlebars.templates.login,
    className: 'body-login-page',

    events: {
        'submit form': 'onFormSubmit',
        'keyup input': 'onInputChange'
    },

    render: function () {
        this.$el.html(this.template());

        this.ui = {
            $tenant: this.$el.find('#tenant').focus(),
            $user: this.$el.find('#user')
                .one('change', this.onFirstUserInputChange.bind(this))
                .focus(this.offFirstUserInputChange.bind(this)), //autofill fix

            $pass: this.$el.find('#pass'), //autofill fix

            $submit: this.$el.find('button'),
            $serverValidationError: this.$el.find('#server-validation-error')
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
        var $target = $(e.target),
            $container = $target.closest('div'),
            value = $target.val();

        if(e.which !== 13) {
            $container[value ? 'removeClass' : 'addClass']('is-invalid');
            this.ui.$submit.prop('disabled', !this.isValidForm());
            this.ui.$serverValidationError.removeClass('is-invalid');
        }
    },

    onFirstUserInputChange: function() {
        var self = this;

        // fix for form auto-fill change event
        setTimeout(function() {
            if(self.ui.$user.val())  {
                self.ui.$submit.prop('disabled', !self.isValidForm(true));
            }
        });
    },

    offFirstUserInputChange: function() {
        this.ui.$user.off('change');
    },

    onFormSubmit: function(e) {
        if(!this.isValidForm()) {
            return;
        }

        var host = window.location;
        var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        var tokenUrl = host.protocol + '//' + host.host + pathname.replace('swagger', 'token');
        var $btn = this.ui.$submit;
        var $serverValidationError = this.ui.$serverValidationError;

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
                $serverValidationError.addClass('is-invalid');

                try {
                    $serverValidationError.children('.error-msg').text(JSON.parse(response.responseText).error);
                } catch(e) {}

                $btn.prop('disabled', false).text('Log In');
            }
        });

        e.preventDefault();
        e.stopPropagation();

        return false;
    },

    isValidForm: function(checkAutoFill) {
        var isTenantValid = Intapp.Config.Deployment === 'OnPremise' ? true : !!this.ui.$tenant.val(),
            isUserPassValid = !!this.ui.$user.val() && (checkAutoFill ? true : !!this.ui.$pass.val());

        return isTenantValid && isUserPassValid;
    }
});