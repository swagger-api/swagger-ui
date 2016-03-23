'use strict';

SwaggerUi.Views.ResponseContentTypeView = Backbone.View.extend({
  initialize: function(){},

  render: function(){
    $(this.el).html(Handlebars.templates.response_content_type(this.model));

    $('label.responseContentType', $(this.el)).text('Response Content Type');

    return this;
  }
});