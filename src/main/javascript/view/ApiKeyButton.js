'use strict';

SwaggerUi.Views.ApiKeyButton = Backbone.View.extend({ // TODO: append this to global SwaggerUi

  events:{
    'click .auth_submit_button' : 'applyApiKey'
  },

  template: Handlebars.templates.apikey_button_view,

  initialize: function(opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  render: function(){
    this.$el.html(this.template(this.model));

    return this;
  },


  applyApiKey: function() {
    var keyAuth = new SwaggerClient.ApiKeyAuthorization(
      this.model.name,
      this.$('.input_apiKey_entry').val(),
      this.model.in
    );
    this.router.api.clientAuthorizations.add(this.model.name, keyAuth);
    this.router.load();
  }

});