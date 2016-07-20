(function() {
    window.SwaggerApp = function() {
        hljs.configure({
            highlightSizeThreshold: 5000
        });

        var router = new window.SwaggerUiRouter({app: this});
        Backbone.history.start();
    };
})();