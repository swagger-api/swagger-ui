class HeaderView extends Backbone.View
  events: {
    'click #show-pet-store-icon'    : 'showPetStore'
    'click #show-wordnik-dev-icon'  : 'showWordnikDev'
    'click #explore'                : 'showCustom'
    'keyup #input_baseUrl'          : 'showCustomOnKeyup'
    'keyup #input_apiKey'           : 'showCustomOnKeyup'
  }

  initialize: ->


  showPetStore: (e) ->
    @trigger(
      'update-swagger-ui'
      {discoveryUrl:"http://petstore.swagger.wordnik.com/api/resources.json", apiKey:"special-key"}
    )

  showWordnikDev: (e) ->
    @trigger(
      'update-swagger-ui'
      {discoveryUrl:"http://api.wordnik.com/v4/resources.json", apiKey:"b39ee8d5f05d0f566a0080b4c310ceddf5dc5f7606a616f53"}
    )

  showCustomOnKeyup: (e) ->
    @showCustom() if e.keyCode is 13

  showCustom: (e) ->
    e?.preventDefault()
    @trigger(
      'update-swagger-ui'
      {discoveryUrl: $('#input_baseUrl').val(), apiKey: $('#input_apiKey').val()}
    )

  update: (url, apiKey, trigger = false) ->
    $('#input_baseUrl').val url
    $('#input_apiKey').val apiKey
    @trigger 'update-swagger-ui', {discoveryUrl:url, apiKey:apiKey} if trigger
