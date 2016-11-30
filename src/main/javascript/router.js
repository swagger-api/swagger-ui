'use strict';

window.SwaggerUiRouter = Backbone.Router.extend({
    routes: {
        '': 'onIndex',
        'logout': 'onLogout',
        'doc': 'onDocumentation',
        'doc/:subdoc': 'onDocumentation'
    },

    initialize: function() {
        var url = this.getUrl();
        var token = this.getParameterByName('access_token');
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

            onFailure: function(data) {
                if(data === '401 : {\"message\":\"The identity is not set or unauthorized.\"} ' + window.swaggerUi.options.url) {

                    var host = window.location;
                    var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
                    var url = host.protocol + '//' + host.host + pathname.replace('swagger', 'login/url');
                    $.ajax({
                        url : url,
                        type: 'POST',
                        success: function (data)
                        {
                            window.location.href = data;
                        },
                        error: function ()
                        {
                            window.onOAuthComplete('');
                        }
                    });
                } else {
                    console.log('Unable to Load SwaggerUI');
                }

                window.swaggerUi.initialized = false;
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

            if (window.swaggerUi.api) {
                window.swaggerUi.api.clientAuthorizations.add('Authorization', apiKeyAuth);
            } else {
                window.swaggerUi.options.authorizations = {'Authorization': apiKeyAuth};
            }

            var host = window.location;
            var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
            var adminUrl = host.protocol + '//' + host.host + pathname.replace('swagger', 'login/isadmin');
            $.ajax({
                url : adminUrl,
                type: 'POST',
                beforeSend: function (request)
                {
                    request.setRequestHeader('Authorization', bearerToken);
                },
                success: function (data)
                {
                    if (data.toLowerCase() === 'true'){
                        window.swaggerUi.options.supportedSubmitMethods = ['get', 'post', 'put', 'delete', 'patch'];
                    }
                    else{
                        window.swaggerUi.options.supportedSubmitMethods = ['get'];
                    }

                    window.swaggerUi.load();
                },
                error: function ()
                {
                    window.onOAuthComplete('');
                }
            });
        }
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
        console.log('process logout');

        window.swaggerUi.api.clientAuthorizations.remove('Authorization');

        var host = window.location;
        var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        var url = host.protocol + '//' + host.host + pathname.replace('swagger', 'login/url');
        $.ajax({
            url : url,
            type: 'POST',
            success: function (data)
            {
                window.location.href = data.replace('oauth/authorize', 'account/logout');
            },
            error: function ()
            {
                window.swaggerUi.options.url = this.getUrl();
                window.swaggerUi.load();
            }
        });
    },

    onDocumentation: function(subdoc) {
        /*global Intapp */
        var deploymentType = (typeof Intapp !== undefined && Intapp.Config.Deployment === 'OnPremise') ? '_onpremise' : '_cloud';

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
        var host = window.location;
        var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));

        return host.protocol + '//' + host.host + pathname.replace('swagger', 'api/swagger/docs/v1') + '?_=' + Date.now();
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
