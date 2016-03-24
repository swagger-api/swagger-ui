class GlobalParametersView extends Backbone.View

  events: {
    'change #input_mId' : 'setId'
    'change #input_apiToken' : 'setToken'
  }

  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.global_parameters())
    @

  setId: (ev) ->
    $('[name="mId"]').val($(ev.currentTarget).val()).trigger("change")

  setToken: (ev) ->
    key = $(ev.currentTarget).val()
    if (key && key.trim() != "")
      window.authorizations.add("key", new ApiKeyAuthorization("Authorization","Bearer " + key, "header"))


    # $('#mId_selector').submit(function() {return false});
    # $('#api_selector').submit(function() {return false});