class HeaderView extends Backbone.View
  events: {
    'click #show-pet-store-icon'    : 'showPetStore'
    'click #show-wordnik-dev-icon'  : 'showWordnikDev'
    'click #show-howareyou-icon'    : 'showHowAreYou'
    'click #explore'                : 'showCustom'
    'keyup #input_baseUrl'          : 'showCustomOnKeyup'
    'keyup #input_apiKey'           : 'showCustomOnKeyup'
    'keyup #input_consumerSecret'   : 'showCustomOnKeyup'
  }

  initialize: ->


  showPetStore: (e) ->
    @trigger(
      'update-swagger-ui'
      {discoveryUrl:"http://petstore.swagger.wordnik.com/api/api-docs.json", apiKey:"special-key"}
    )

  showWordnikDev: (e) ->
    @trigger(
      'update-swagger-ui'
      {discoveryUrl:"http://api.wordnik.com/v4/resources.json", apiKey:""}
    )

  showHowAreYou: (e) ->
    @trigger(
      'update-swagger-ui'
      {discoveryUrl:"https://api.howareyou.com/cds_doc.json", consumerKey: "ea6d7475b6509f4150644c0823dd512a", consumerSecret: "0d26c7516c9dbf6d3a99ebb93477d74e"}
    )

  showCustomOnKeyup: (e) ->
    @showCustom() if e.keyCode is 13

  showCustom: (e) ->
    e?.preventDefault()
    apiKey = $('#input_apiKey').val()
    @trigger(
      'update-swagger-ui'
      {discoveryUrl: $('#input_baseUrl').val(), apiKey: apiKey, consumerKey: apiKey, consumerSecret: $('#input_consumerSecret').val()}
    )

  update: (options, trigger = false) ->
    $('#input_baseUrl').val options.discoveryUrl
    $('#input_apiKey').val(options.consumerKey || options.apiKey)
    $('#input_consumerSecret').val options.consumerSecret

    @trigger 'update-swagger-ui', {discoveryUrl:url, apiKey:apiKey} if trigger
