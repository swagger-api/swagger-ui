'use strict';

SwaggerUi.Views.DocumentationView = Backbone.View.extend({
    template: Handlebars.templates.documentation,

    initialize: function(options) {
        this.options = options;
    },

    render: function () {
        this.$el.html(this.options.template ? Handlebars.templates[this.options.template]() : this.template());
        return this;
    }
});