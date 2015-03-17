'use strict';

SwaggerUi.Views.BasicAuthButton = Backbone.View.extend({


  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  render: function(){
    var template = this.template();
    $(this.el).html(template(this.model));

    return this;
  },

  events: {
    'click #basic_auth_button' : 'togglePasswordContainer',
    'click #apply_basic_auth' : 'applyPassword'
  },

  applyPassword: function(){
    var username = $('.input_username').val();
    var password = $('.input_password').val();
    var basicAuth = new SwaggerClient.PasswordAuthorization('basic', username, password);
    this.router.api.clientAuthorizations.add(this.model.type, basicAuth);
    this.router.load();
    $('#basic_auth_container').hide();
  },

  togglePasswordContainer: function(){
    if ($('#basic_auth_container').length) {
      var elem = $('#basic_auth_container').show();
      if (elem.is(':visible')){
        elem.slideUp();
      } else {
        // hide others
        $('.auth_container').hide();
        elem.show();
      }
    }
  },

  template: function(){
    return Handlebars.templates.basic_auth_button_view;
  }

});