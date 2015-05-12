'use strict';

SwaggerUi.Views.SidebarItemView = Backbone.View.extend({

  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  render: function () {
    $(this.el).html(Handlebars.templates.sidebar_item(this.model));
    return this;
  }

});