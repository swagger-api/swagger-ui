'use strict';

SwaggerUi.Views.LoginView = Backbone.View.extend({
    template: Handlebars.templates.login,
    className: 'body-login-page',

    events: {
        'submit form': 'onFormSubmit'
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    onFormSubmit: function(e) {
        var host = window.location;
        var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        var tokenUrl = host.protocol + '//' + host.host + pathname.replace('swagger', 'token');

        //REMOVE
        tokenUrl = 'http://localhost/Open.Services/token';

        $.ajax({
            url: tokenUrl,
            type: 'post',
            contenttype: 'x-www-form-urlencoded',
            data: 'grant_type=password&username=' + $('#user').val() + '&password=' + $('#pass').val() + '&tenantId=' + $('#tenant').val() + '&extend=roles',
            success: function (response) {
                var bearerToken = 'Bearer ' + response.access_token,
                    apiKeyAuth = new SwaggerClient.ApiKeyAuthorization('Authorization', bearerToken, 'header');

                //set supported HTTP methods
                window.swaggerUi.options.supportedSubmitMethods = (response.roles || []).indexOf('Admin') >= 0 ? ['get', 'post', 'put', 'delete', 'patch'] : ['get'];

                //set swagger client auth
                window.swaggerUi.api ?
                    window.swaggerUi.api.clientAuthorizations.add('Authorization', apiKeyAuth) :
                    window.swaggerUi.options.authorizations = {'Authorization' : apiKeyAuth};

                //navigate to main form
                Backbone.history.navigate('', true);
            },
            error: function () {
                window.alert('Unable to Load SwaggerUI');
            }
        });

        e.preventDefault();
    }

});