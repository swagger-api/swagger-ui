'use strict';

SwaggerUi.Views.BasicAuthButton = Backbone.View.extend({


  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  template: Handlebars.templates.basic_auth_button_view,

  render: function(){
    $(this.el).html(this.template(this.model));

    return this;
  },

  events: {
    'submit .key_input_container' : 'applyPassword',
    'click .auth_logout__button'  : 'clickLogout'
  },

  applyPassword: function(event) {
    event.preventDefault();
    var username = this.$('.basic_auth__username').val();
    var password = this.$('.basic_auth__password').val();
    var basicAuth = new SwaggerClient.PasswordAuthorization('basic', username, password);
    this.router.api.clientAuthorizations.add(this.model.type, basicAuth);
    this.router.load();
  },

  clickLogout: function () {
    window.swaggerUi.api.clientAuthorizations.remove(this.model.name);
    this.router.load();
  }

});