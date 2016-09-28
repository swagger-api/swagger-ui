'use strict';

SwaggerUi.Views.LoginView = Backbone.View.extend({
    el: '#main-container',
    template: Handlebars.templates.login,
    className: 'body-login-page',

    events: {
        'submit form': 'onFormSubmit',
        'keyup input': 'onInputChange',
        'blur input': 'onInputChange'
    },

    render: function () {
        this.$el.html(this.template());

        this.ui = {
            $tenant: this.$el.find('#tenant').focus(),
            $user: this.$el.find('#user')
                .one('change', this.onFirstUserInputChange.bind(this))
                .focus(this.offFirstUserInputChange.bind(this)), //autofill fix

            $pass: this.$el.find('#pass'),
            $submit: this.$el.find('button'),
            $serverValidationError: this.$el.find('#server-validation-error')
        };

        this.ui.$tenant.val(location.hostname.split('.')[0].split('-')[1]);

        //hide tenant control when OnPremise deployment or filled from URL
        /*global Intapp */
        if(this.ui.$tenant.val() || (typeof Intapp !== undefined && Intapp.Config.Deployment === 'OnPremise')) {
            this.ui.$tenant.parent().hide();
            this.delay(function() {
                this.ui.$user.focus();
            });
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

        // Check "Enter" or "Tab" key pressed
        if(e.which !== 13 && e.which !== 9) {
            $container[value ? 'removeClass' : 'addClass']('is-invalid');

            this.ui.$submit.prop('disabled', !this.isValidForm());
            this.ui.$serverValidationError.removeClass('is-invalid');
        }
    },

    onFirstUserInputChange: function() {
        // fix for form auto-fill change event
        this.delay(function() {
            if(this.ui.$user.val())  {
                this.ui.$submit.prop('disabled', !this.isValidForm(true));
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
        var tokenUrl = host.protocol + '//' + host.host.replace('api', 'auth') + pathname.replace('Services', 'AuthorizationServer').replace('swagger', 'oauth/token');
        var $btn = this.ui.$submit;

        this.delay(function() {
            $btn.text('Logging in...').prop('disabled', true);
        });

        $.ajax({
            url: tokenUrl,
            type: 'post',
            contenttype: 'x-www-form-urlencoded',
            data: 'grant_type=password&username=' + this.ui.$user.val() + '&password=' + this.ui.$pass.val() + '&tenantId=' + this.ui.$tenant.val() + '&extend=roles',
            success: this.onAuthenticationSuccess.bind(this),
            error: this.onAuthenticationError.bind(this)
        });

        e.preventDefault();
        e.stopPropagation();

        return false;
    },

    onAuthenticationSuccess: function(response) {
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
        console.time('loadingMainView');
        window.swaggerUi.load();
    },

    onAuthenticationError: function(response) {
        var $serverValidationError = this.ui.$serverValidationError.addClass('is-invalid');

        try {
            $serverValidationError.children('.error-msg').text(JSON.parse(response.responseText).error);
        } catch(e) {}

        this.ui.$submit.prop('disabled', false).text('Log In');
    },

    isValidForm: function(checkAutoFill) {
        var isTenantValid = this.ui.$tenant.is(':hidden') || !!this.ui.$tenant.val(),
            isUserPassValid = !!this.ui.$user.val() && (checkAutoFill ? true : !!this.ui.$pass.val());

        return isTenantValid && isUserPassValid;
    },

    delay: function(fn, interval) {
        setTimeout(fn.bind(this), interval || 0);
    }
});
