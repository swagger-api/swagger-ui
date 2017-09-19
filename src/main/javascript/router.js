'use strict';

window.SwaggerUiRouter = Backbone.Router.extend({
    routes: {
        '': 'onIndex',
        'logout': 'onLogout',
        'doc': 'onDocumentation',
        'doc/:subdoc': 'onDocumentation'
    },
    configs: null,
    suffix: 'Swagger',

    initialize: function(options) {
        this.configs = options.configs;

        for(var i = 0; i < this.configs.length; i++){
            var url = this.configs[i].url;
            var key = this.configs[i].key;
            this.getSwagger(url, key);
        }
    },

    onIndex: function() {
        console.log('render main page');

        $('#swagger-container').show();
        for(var i = 0; i < this.configs.length; i++) {
            var key = this.configs[i].key;
            var namespace = key + this.suffix;

            if (window[namespace].initialized) {
                $('#swagger-ui-container-' + key).show();
            } else {
                window[namespace].load();
            }

            if (this.currentView) {
                this.currentView.remove();
            }

            this.currentView = undefined;
        }
    },

    onLogout: function() {
        window.KC.logout({redirectUri: location.href.replace('#logout', '')});
    },

    onDocumentation: function(subdoc) {
        /*global Intapp */
        var deploymentType = (typeof window.Intapp !== 'undefined' && Intapp.Config.Deployment === 'OnPremise') ? '_onpremise' : '_cloud';

        console.log('render documentation page');
        this.showView(new SwaggerUi.Views.DocumentationView(subdoc && { template: 'documentation_' + subdoc + deploymentType }));

        $('#swagger-container').hide();
    },

    showView: function(view) {
        if (this.currentView) {
            this.currentView.remove();
        }

        this.currentView = view;
        view.render();
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
    },

    getSwagger: function(url, key) {
        // var url = this.getUrl();
        var token = window.KC.token;
        var domId = 'swagger-ui-container-' + key;
        var namespace = key + this.suffix;
        var apiKeyAuth = null;
        var bearerToken = null;

        if (token !== null){
            bearerToken = 'Bearer ' + token;
            apiKeyAuth = new SwaggerClient.ApiKeyAuthorization('Authorization', bearerToken, 'header');

            Backbone.history.navigate('', false);
        }

        window[namespace] = new SwaggerUi({
            url: url,
            dom_id: domId,

            onComplete: function(){
                if(window.SwaggerTranslator) {
                    window.SwaggerTranslator.translate();
                }

                $('pre code').each(function(i, e) {
                    hljs.highlightBlock(e);
                });

                //add separators
                window[namespace].mainView.$el.find('.resource_common_api').last().after('<li class="separator"></li>');
                window[namespace].mainView.$el.find('.resource_intake_api').last().after('<li class="separator"></li>');
                window[namespace].mainView.$el.find('.resource_conflicts_api').last().after('<li class="separator"></li>');

                window[namespace].initialized = true;
                Backbone.history.navigate('', true);

                console.timeEnd('loadingMainView');
                $('.switch-button-panel').not(':first').remove();

            },

            onFailure: function() {
                console.log('Unable to Load SwaggerUI');
                window[namespace].initialized = false;
            },

            responseInterceptor: function() {
                this.obj && (this.obj.schemes = ['https']);
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

        //set swagger client auth
        if (apiKeyAuth !== null) {
            //set supported HTTP methods

            if ( window[namespace].api) {
                window[namespace].api.clientAuthorizations.add('Authorization', apiKeyAuth);
            } else {
                window[namespace].options.authorizations = {'Authorization': apiKeyAuth};
            }
        }
    }
});
