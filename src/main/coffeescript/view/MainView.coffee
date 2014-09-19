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

    log @model
    if @model.info.license and typeof @model.info.license is 'string'
      name = @model.info.license
      url = @model.info.licenseUrl
      @model.info.license = {}
      @model.info.license.name = name
      @model.info.license.url = url
 
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
