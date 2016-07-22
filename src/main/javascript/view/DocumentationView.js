'use strict';

SwaggerUi.Views.DocumentationView = Backbone.View.extend({
    el: '#main-container',
    template: Handlebars.templates.documentation,

    initialize: function(options) {
        this.options = options;
    },

    render: function () {
        this.$el.html(this.options.template ? Handlebars.templates[this.options.template]() : this.template());
        return this;
    },

    remove: function() {
        this.$el.empty();
        this.undelegateEvents();
    },
});