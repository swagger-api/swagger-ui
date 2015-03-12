'use strict';

var StatusCodeView = Backbone.View.extend({
  initialize: function () {

  },

  render: function(){
    $(this.el).html(Handlebars.templates.status_code(this.model));

    if (swaggerUi.api.models.hasOwnProperty(this.model.responseModel)) {
      var responseModel = {
        sampleJSON: JSON.stringify(swaggerUi.api.models[this.model.responseModel].createJSONSample(), null, 2),
        isParam: false,
        signature: swaggerUi.api.models[this.model.responseModel].getMockSignature(),
      };

      var responseModelView = new SwaggerUi.Views.SignatureView({model: responseModel, tagName: 'div'});
      $('.model-signature', this.$el).append(responseModelView.render().el);
    } else {
      $('.model-signature', this.$el).html('');
    }
    return this;
  }
});