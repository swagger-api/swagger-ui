'use strict';

var BasicAuthButton = Backbone.View.extend({


  initialize: function () {},

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
    var basicAuth = new PasswordAuthorization('basic', username, password);
    window.authorizations.add(this.model.type, basicAuth);
    window.swaggerUi.load();
    $('#basic_auth_container').hide();
  },

  togglePasswordContainer: function(){
    if ($('#basic_auth_container').length > 0) {
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