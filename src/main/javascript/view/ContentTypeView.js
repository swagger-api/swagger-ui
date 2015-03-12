'use strict';

SwaggerUi.Views.ContentTypeView = Backbone.View.extend({
  initialize: function() {},

  render: function(){
    $(this.el).html(Handlebars.templates.content_type(this.model));

    $('label[for=contentType]', $(this.el)).text('Response Content Type');

    return this;
  }
});