/* jshint ignore:start */
$(function () {
  'use strict';
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = 'http://petstore.swagger.io/v2/swagger.json';
  }

  // Pre load translate...
  if(window.SwaggerTranslator) {
    window.SwaggerTranslator.translate();
  }
  window.swaggerUi = new SwaggerUi({
    url: url,
    dom_id: 'swagger-ui-container',
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    onComplete: function(){
      if(typeof initOAuth === 'function') {
        initOAuth({
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

  window.swaggerUi.load();

  function log() {
    if ('console' in window) {
      console.log.apply(console, arguments);
    }
  }
});

/* jshint ignore:end */