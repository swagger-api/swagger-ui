'use strict';

SwaggerUi.Views.LoginView = Backbone.View.extend({
    template: Handlebars.templates.login,

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
                var bearerToken = 'Bearer ' + response.access_token;

                window.swaggerUi.options.supportedSubmitMethods = (response.roles || []).indexOf('Admin') >= 0 ? ['get', 'post', 'put', 'delete', 'patch'] : ['get'];
                window.swaggerUi.options.authorizations = {'Authorization' : new SwaggerClient.ApiKeyAuthorization('Authorization', bearerToken, 'header')};

                Backbone.history.navigate('', true);
            },
            error: function () {
                window.alert('Unable to Load SwaggerUI');
            }
        });

        e.preventDefault();
    }

});