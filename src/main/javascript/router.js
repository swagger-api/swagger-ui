'use strict';

window.SwaggerUiRouter = Backbone.Router.extend({
    routes: {
        '': 'onIndex',
        'login': 'onLogin',
        'logout': 'onLogout',
        'doc': 'onDocumentation'
    },

    initialize: function() {
        var url = this.getUrl();

        window.swaggerUi = new SwaggerUi({
            url: url,
            dom_id: 'swagger-ui-container',

            onComplete: function(){
                if(window.SwaggerTranslator) {
                    window.SwaggerTranslator.translate();
                }

                $('pre code').each(function(i, e) {
                    hljs.highlightBlock(e);
                });

                window.swaggerUi.initialized = true;
                $('#swagger-container').show();
            },

            onFailure: function(data) {
                if(data === '401 : {\"message\":\"The identity is not set or unauthorized.\"} ' + window.swaggerUi.options.url) {
                    Backbone.history.navigate('login', true);
                } else {
                    console.log('Unable to Load SwaggerUI');
                }

                window.swaggerUi.initialized = false;
            },

            docExpansion: 'none',
            apisSorter: 'alpha',
            operationsSorter: function(a, b) {
                return a.path === b.path ? a.method.localeCompare(b.method) : a.path.localeCompare(b.path);
            },
            showRequestHeaders: false,
            validatorUrl: null
        });

        window.swaggerUi.load();
    },

    onIndex: function() {
        console.log('render main page');

        if(window.swaggerUi.initialized) {
            $('#swagger-container').show();
        } else {
            window.swaggerUi.load();
        }

        if(this.currentView) {
            this.currentView.remove();
        }

        this.currentView = undefined;
    },

    onLogin: function() {
        console.log('render login page');
        this.showView(new SwaggerUi.Views.LoginView());
    },

    onLogout: function() {
        console.log('process logout');

        window.swaggerUi.api.clientAuthorizations.remove('Authorization');
        window.swaggerUi.options.url = this.getUrl();

        window.swaggerUi.load();
    },

    onDocumentation: function() {
        if(window.swaggerUi.initialized) {
            console.log('render documentation page');
            this.showView(new SwaggerUi.Views.DocumentationView());
        } else {
            this.navigate('login', true);
        }
    },

    showView: function(view) {
        if(this.currentView) {
            this.currentView.remove();
        }

        this.currentView = view;

        $('#swagger-container').hide();
        $(view.render().el).appendTo('body');
    },

    getUrl: function() {
        var host = window.location;
        var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        var url = host.protocol + '//' + host.host + pathname.replace('swagger', 'api/swagger/docs/v1') + '?_=' + Date.now();

        // REMOVE AFTER
        url = 'http://localhost/Open.Services/api/swagger/docs/v1' + '?_=' + Date.now();
        return url;
    }
});