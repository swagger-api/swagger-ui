class BasicAuthButton extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))

    @

  events:
    "click #basic_auth_button" : "togglePasswordContainer"
    "click #apply_basic_auth" : "applyPassword"

  applyPassword: ->
    username = $(".input_username").val()
    password = $(".input_password").val()
    window.authorizations.add(@model.type, new PasswordAuthorization("basic", username, password))
    window.swaggerUi.load()
    elem = $('#basic_auth_container').hide()


  togglePasswordContainer: ->
    if $('#basic_auth_container').length > 0
      elem = $('#basic_auth_container').show()
      if elem.is ':visible'
        elem.slideUp()
      else
        # hide others
        $('.auth_container').hide()
        elem.show()

  template: ->
    Handlebars.templates.basic_auth_button_view

