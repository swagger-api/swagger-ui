'use strict';

SwaggerUi.Views.NavigationView = Backbone.View.extend({
  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  render: function(){
    $(this.el).html(Handlebars.templates.navigation(this.model));
    return this;
  }
});