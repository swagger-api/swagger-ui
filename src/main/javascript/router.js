'use strict';

window.SwaggerUiRouter = Backbone.Router.extend({
    routes: {
        '': 'onIndex',
        'login': 'onLogin',
        'doc': 'onDocumentation'
    },

    initialize: function() {
        var host = window.location;
        var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        var url = host.protocol + '//' + host.host + pathname.replace('swagger', 'api/swagger/docs/v1');

        // REMOVE AFTER
        url = 'http://localhost/Open.Services/api/swagger/docs/v1';

        window.swaggerUi = new SwaggerUi({
            url: url,
            dom_id: "swagger-ui-container",
            onComplete: function(swaggerApi, swaggerUi){
                if(window.SwaggerTranslator) {
                    window.SwaggerTranslator.translate();
                }

                $('pre code').each(function(i, e) {
                    hljs.highlightBlock(e);
                });
            },
            onFailure: function(data) {
                if(data === '401 : {\"message\":\"The identity is not set or unauthorized.\"} ' + url) {
                    Backbone.history.navigate('login', true);
                } else {
                    console.log("Unable to Load SwaggerUI");
                }
            },
            docExpansion: "none",
            apisSorter: "alpha",
            operationsSorter: function(a, b) {
                return a.path === b.path ? a.method.localeCompare(b.method) : a.path.localeCompare(b.path);
            },
            showRequestHeaders: false,
            validatorUrl: null
        });
    },

    onIndex: function() {
        console.log('render main page');

        if(swaggerUi.mainView) {
            swaggerUi.mainView.$el.show();
        } else {
            swaggerUi.load();
        }

        this.currentView && this.currentView.remove();
        this.currentView = undefined;
    },

    onLogin: function() {
        console.log('render login page');
        this.showView(new SwaggerUi.Views.LoginView());
    },

    onDocumentation: function() {
        console.log('render documentation page');
        this.showView(new SwaggerUi.Views.DocumentationView());
    },

    showView: function(view) {
        this.currentView && this.currentView.remove();
        this.currentView = view;

        if(window.swaggerUi && swaggerUi.mainView) {
            swaggerUi.mainView.$el.hide();
        }

        $(view.render().el).appendTo('body');
    }
});