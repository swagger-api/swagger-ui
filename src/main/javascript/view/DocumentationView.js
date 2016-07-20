'use strict';

SwaggerUi.Views.DocumentationView = Backbone.View.extend({
    template: Handlebars.templates.documentation,

    render: function () {
        this.$el.html(this.template());
        return this;
    }
});