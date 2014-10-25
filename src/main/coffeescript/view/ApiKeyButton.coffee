class ApiKeyButton extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))

    @

  events:
    "click #apikey_button" : "toggleApiKeyContainer"
    "click #apply_api_key" : "applyApiKey"

  applyApiKey: ->
    window.authorizations.add(@model.name, new ApiKeyAuthorization(@model.name, $("#input_apiKey_entry").val(), @model.in))
    window.swaggerUi.load()
    elem = $('#apikey_container').show()

  toggleApiKeyContainer: ->
    if $('#apikey_container').length > 0
      elem = $('#apikey_container').first()
      if elem.is ':visible'
        elem.hide()
      else
        # hide others
        $('.auth_container').hide()
        elem.show()

  template: ->
    Handlebars.templates.apikey_button_view

