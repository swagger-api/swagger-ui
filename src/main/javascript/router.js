'use strict';

window.SwaggerUiRouter = Backbone.Router.extend({
    routes: {
        '': 'onIndex',
        'state=:state': 'onIndex',
        'logout': 'onLogout',
        'doc': 'onDocumentation',
        'doc/:subdoc': 'onDocumentation'
    },

    initialize: function() {
        var url = this.getUrl();
        var token = window.KC.token;
        var apiKeyAuth = null;
        var bearerToken = null;
        if (token !== null){
            bearerToken = 'Bearer ' + token;
            apiKeyAuth = new SwaggerClient.ApiKeyAuthorization('Authorization', bearerToken, 'header');

            Backbone.history.navigate('', false);
        }

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

                //add separators
                window.swaggerUi.mainView.$el.find('.resource_common_api').last().after('<li class="separator"></li>');
                window.swaggerUi.mainView.$el.find('.resource_intake_api').last().after('<li class="separator"></li>');
                window.swaggerUi.mainView.$el.find('.resource_conflicts_api').last().after('<li class="separator"></li>');

                window.swaggerUi.initialized = true;
                Backbone.history.navigate('', true);

                console.timeEnd('loadingMainView');
            },

            onFailure: function() {
                console.log('Unable to Load SwaggerUI');
                window.swaggerUi.initialized = false;
            },

            responseInterceptor: function() {
                this.obj.schemes = ['https'];
                return this;
            },

            docExpansion: 'none',

            apisSorter: function(a, b) {
                var getWeight = function(item) {
                    var weight = 0;
                    if (item.indexOf('Common') !== -1) {
                        weight += 100;
                    }
                    if (item.indexOf('Conflicts') !== -1) {
                        weight += 200;
                    }
                    if (item.indexOf('Intake') !== -1) {
                        weight += 300;
                    }
                    if (item.indexOf('Dictionary') !== -1) {
                        weight += 1;
                    }
                    if (item.indexOf('Entity') !== -1) {
                        weight += 2;
                    }
                    if (item.indexOf('Sub-entity') !== -1) {
                        weight += 3;
                    }
                    if (item.indexOf('Action') !== -1) {
                        weight += 4;
                    }
                    if (item.indexOf('Integration') !== -1) {
                        weight += 5;
                    }
                    if (item.indexOf('Settings') !== -1) {
                        weight += 6;
                    }
                    if (item.indexOf('Property') !== -1) {
                        weight += 7;
                    }

                    return weight;
                };

                return getWeight(a.tag) > getWeight(b.tag) ? 1 : -1;
            },

            operationsSorter: function(a, b) {
                return a.path === b.path ? a.method.localeCompare(b.method) : a.path.localeCompare(b.path);
            },

            showRequestHeaders: false,
            validatorUrl: null
        });
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

    onLogout: function() {
        window.KC.logout({redirectUri: location.href.replace('#logout', '')});
    },

    onDocumentation: function(subdoc) {
        /*global Intapp */
        var deploymentType = (typeof window.Intapp !== 'undefined' && Intapp.Config.Deployment === 'OnPremise') ? '_onpremise' : '_cloud';

        if(window.swaggerUi.initialized) {
            console.log('render documentation page');
            this.showView(new SwaggerUi.Views.DocumentationView(subdoc && { template: 'documentation_' + subdoc + deploymentType }));
        } else {
            this.navigate('', true);
        }
    },

    showView: function(view) {
        if(this.currentView) {
            this.currentView.remove();
        }

        this.currentView = view;

        $('#swagger-container').hide();
        view.render();
    },

    getUrl: function() {
        // var host = window.location;
        // var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        //
        // return host.protocol + '//' + host.host + pathname.replace('swagger', 'api/swagger/docs/v1') + '?_=' + Date.now();
        return 'proxy/tms.platform.intapp.com/v2/api-docs';
    },

    getParameterByName: function(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[#?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results){
            return null;
        }

        if (!results[2]) {
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
});
