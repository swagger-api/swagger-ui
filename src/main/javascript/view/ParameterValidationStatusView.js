'use strict';

SwaggerUi.Views.ParameterValidationStatusView = Backbone.View.extend({
  initialize: function () {
    // Model should look like:
    // {
    //  status: 'error',
    //  message: 'something failed'
    // }
    this.model.on('change', this.render, this);
  },

  render: function(){
    var params = {
      isError: (this.model.get('status') === 'error'),
      message: this.model.get('message')
    };
    $(this.el).html(Handlebars.templates.parameter_validation_status(params));
    return this;
  }
});
