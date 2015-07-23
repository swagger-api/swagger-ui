'use strict';

SwaggerUi.Views.ResponseClassView = Backbone.View.extend({

  initialize: function () { },

  renderResponseContentType: function() {

    var responseContentTypeView = new SwaggerUi.Views.ResponseContentTypeView({
      model: {produces: this.model.produces},
      router: this.router
    });

    $('.response-content-type', $(this.el)).html(responseContentTypeView.render().el);
  },

  render: function(){

    var signatureModel = null;

    // Get the last response with an object?
    if (this.model.successResponse) {
      var successResponse = this.model.successResponse;

      // Get last key/value
      var key,resp;
      for (key in successResponse) { resp = successResponse[key]; }

      this.model.successCode = key;
      signatureModel = {
        isParam: false,
        schema: resp
      };

     } else if (this.model.responseClassSignature && this.model.responseClassSignature !== 'string') {
       signatureModel = {
         sampleJSON: this.model.responseSampleJSON,
         isParam: false,
         signature: this.model.responseClassSignature
       };
     }

     this.$el.html(Handlebars.templates.response_class(this.model));

     if(signatureModel) {

      var responseSignatureView = new SwaggerUi.Views.SignatureView({
        model: signatureModel,
        router: this.router,
        tagName: 'div'
      });

      $('.model-signature', $(this.el)).append(responseSignatureView.render().el);

     } else {

      this.model.responseClassSignature = 'string';
      $('.model-signature', $(this.el)).html(this.model.type);

     }

     this.renderResponseContentType();

    return this;
  }

});
