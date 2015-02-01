class MainView extends Backbone.View
  sorters = {
    'alpha'   : (a,b) -> return a.path.localeCompare(b.path),
    'method'  : (a,b) -> return a.method.localeCompare(b.method),
  }

  initialize: (opts={}) ->
    # set up the UI for input
    @model.auths = []
    for key, value of @model.securityDefinitions
      auth = {name: key, type: value.type, value: value}
      @model.auths.push auth

    if @model.swaggerVersion is "2.0"
      if "validatorUrl" of opts.swaggerOptions
        # Validator URL specified explicitly
        @model.validatorUrl = opts.swaggerOptions.validatorUrl
      else if @model.url.indexOf("localhost") > 0
        # Localhost override
        @model.validatorUrl = null
      else
        # Default validator
        @model.validatorUrl = "http://online.swagger.io/validator"
 
  render: ->
    if @model.securityDefinitions
      for name of @model.securityDefinitions
        auth = @model.securityDefinitions[name]
        if auth.type is "apiKey" and $("#apikey_button").length is 0
          button = new ApiKeyButton({model: auth}).render().el
          $('.auth_main_container').append button
        if auth.type is "basicAuth" and $("#basic_auth_button").length is 0
          button = new BasicAuthButton({model: auth}).render().el
          $('.auth_main_container').append button

    # Render the outer container for resources
    $(@el).html(Handlebars.templates.main(@model))

    # Render each resource

    resources = {}
    counter = 0
    for resource in @model.apisArray
      id = resource.name
      while typeof resources[id] isnt 'undefined'
        id = id + "_" + counter
        counter += 1
      resource.id = id
      resources[id] = resource
      @addResource resource, @model.auths

    $('.propWrap').hover(
      ->
        $('.optionsWrapper', $(this)).show()
      ,->
        $('.optionsWrapper', $(this)).hide()
    )
    @

  addResource: (resource, auths) ->
    # Render a resource and add it to resources li
    resource.id = resource.id.replace(/\s/g, '_')
    resourceView = new ResourceView({
      model: resource, 
      tagName: 'li', 
      id: 'resource_' + resource.id, 
      className: 'resource', 
      auths: auths,
      swaggerOptions: @options.swaggerOptions
    })
    $('#resources').append resourceView.render().el

  clear: ->
    $(@el).html ''
