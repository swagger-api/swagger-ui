'use strict';

SwaggerUi.Views.StatusCodeView = Backbone.View.extend({
  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  render: function(){

    this.$el.html(Handlebars.templates.status_code(this.model));

    // Add signature view of model
    var schema = this.model.schema || {};
    var responseModel = {
      schema: schema,
      isParam: false,
    };
    var responseModelView = new SwaggerUi.Views.SignatureView({
      model: responseModel,
      tagName: 'div',
      router: this.router
    });
    $('.model-signature', this.$el).append(responseModelView.render().el);

    return this;
  }
});
