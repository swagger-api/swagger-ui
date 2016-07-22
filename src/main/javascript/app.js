(function() {
    'use strict';

    window.SwaggerApp = function() {
        hljs.configure({
            highlightSizeThreshold: 5000
        });

        Backbone.history.start(new window.SwaggerUiRouter({app: this}));
    };
})();