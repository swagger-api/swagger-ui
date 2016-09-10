
$(function () {
    var url = window.location.search.match(/url=([^&]+)/);
    var langButtons = null;
    var languages = $('#languages');
    languages.css('display', 'none');

    if (url && url.length > 1) {
      url = decodeURIComponent(url[1]);
    } else {
      url = "http://petstore.swagger.io/v2/swagger.json";
    }

    hljs.configure({
      highlightSizeThreshold: 5000
    });

    // Pre load translate...
    if (window.SwaggerTranslator) {
      languages.css('display', 'block');
      window.SwaggerTranslator.pickLanguage('en');
    }
    window.swaggerUi = new SwaggerUi({
      url: url,
      dom_id: "swagger-ui-container",
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      onComplete: function(swaggerApi, swaggerUi){
        if (typeof initOAuth == "function") {
          initOAuth({
            clientId: "your-client-id",
            clientSecret: "your-client-secret-if-required",
            realm: "your-realms",
            appName: "your-app-name",
            scopeSeparator: " ",
            additionalQueryStringParams: {}
          });
        }

        if (window.SwaggerTranslator) {
          window.SwaggerTranslator.pickLanguage('en');
          

          langButtons = $('.swagger-language-button');
          
          langButtons.on('click', function (event) {
              var id = _.trim(event.currentTarget.id);
              langButtons
                        .prop('disabled', false)
                        .filter('#'+id)
                        .prop('disabled', true);
              window.SwaggerTranslator.pickLanguage(id);
          }).filter('#en')
            .prop('disabled', true);

        }
      },
      onFailure: function(data) {
        log("Unable to Load SwaggerUI");
      },
      docExpansion: "none",
      jsonEditor: false,
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