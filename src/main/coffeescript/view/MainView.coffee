class MainView extends Backbone.View
  sorters = {
    'alpha'   : (a,b) -> return a.path.localeCompare(b.path),
    'method'  : (a,b) -> return a.method.localeCompare(b.method),
  }

  initialize: (opts={}) ->
    if opts.swaggerOptions.sorter
      sorterName = opts.swaggerOptions.sorter
      sorter = sorters[sorterName]
      if @model.apisArray
        for route in @model.apisArray
          route.operationsArray.sort sorter
        if (sorterName == "alpha") # sort top level paths if alpha 
          @model.apisArray.sort sorter

    if @model.info and @model.info.license and typeof @model.info.license is 'string'
      name = @model.info.license
      url = @model.info.licenseUrl
      @model.info.license = {}
      @model.info.license.name = name
      @model.info.license.url = url

    if !@model.info
      @model.info = {}

    if !@model.info.version
      @model.info.version = @model.apiVersion

    if @model.swaggerVersion is "2.0"
      if "validatorUrl" of opts.swaggerOptions
        # Validator URL specified explicitly
        @model.validatorUrl = opts.swaggerOptions.validatorUrl
      else if @model.url.match(/https?:\/\/localhost/)
        # Localhost override
        @model.validatorUrl = @model.url
      else
        # Default validator
        @model.validatorUrl = "http://online.swagger.io/validator"
 
  render: ->
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
      @addResource resource
    @

  addResource: (resource) ->
    # Render a resource and add it to resources li
    resource.id = resource.id.replace(/\s/g, '_')
    resourceView = new ResourceView({model: resource, tagName: 'li', id: 'resource_' + resource.id, className: 'resource', swaggerOptions: @options.swaggerOptions})
    $('#resources').append resourceView.render().el

  clear: ->
    $(@el).html ''
