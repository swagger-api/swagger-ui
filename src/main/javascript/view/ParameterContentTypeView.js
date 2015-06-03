'use strict';

SwaggerUi.Views.ParameterContentTypeView = Backbone.View.extend({
  initialize: function  () {},

  render: function(){
    $(this.el).html(Handlebars.templates.parameter_content_type(this.model));

    //$('label[for=parameterContentType]', $(this.el)).text('Parameter content type:');

    return this;
  }

});