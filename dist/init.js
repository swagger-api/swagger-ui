'use strict';

$(function () {
    var url = window.location.search.match(/url=([^&]+)/);
    if (url && url.length > 1) {
      url = decodeURIComponent(url[1]);
    } else {
      url = 'http://petstore.swagger.io/v2/swagger.json';
    }

    // Pre load translate...
    if (window.SwaggerTranslator) {
      window.SwaggerTranslator.translate();
    }
    window.swaggerUi = new SwaggerUi({
      url: url,
      dom_id: 'swagger-ui-container',
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      onComplete: function() {
        if (typeof window.initOAuth === 'function') {
          window.initOAuth({
            clientId: 'your-client-id',
            clientSecret: 'your-client-secret-if-required',
            realm: 'your-realms',
            appName: 'your-app-name',
            scopeSeparator: ',',
            additionalQueryStringParams: {}
          });
        }

        if(window.SwaggerTranslator) {
          window.SwaggerTranslator.translate();
        }

        $('pre code').each(function(i, e) {
          hljs.highlightBlock(e);
        });

        addApiKeyAuthorization();
      },
      onFailure: function() {
        log('Unable to Load SwaggerUI');
      },
      docExpansion: 'none',
      jsonEditor: false,
      apisSorter: 'alpha',
      defaultModelRendering: 'schema',
      showRequestHeaders: false
    });

    function addApiKeyAuthorization(){
      var key = encodeURIComponent($('#input_apiKey')[0].value);
      if(key && key.trim() !== '') {
          var apiKeyAuth = new SwaggerClient.ApiKeyAuthorization('api_key', key, 'query');
          window.swaggerUi.api.clientAuthorizations.add('api_key', apiKeyAuth);
          log('added key ' + key);
      }
    }

    $('#input_apiKey').change(addApiKeyAuthorization);

    // if you have an apiKey you would like to pre-populate on the page for demonstration purposes...
    /*
      var apiKey = "myApiKeyXXXX123456789";
      $('#input_apiKey').val(apiKey);
    */

    window.swaggerUi.load();

    function log() {
      if ('console' in window) {
        console.log.apply(console, arguments);
      }
    }
});
