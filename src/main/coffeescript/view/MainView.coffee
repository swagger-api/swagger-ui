class MainView extends Backbone.View
  initialize: (opts={}) ->
    if opts.swaggerOptions.sortAlphabetically == true
      pathSorter = (a,b) -> return a.path.localeCompare(b.path)
      # sort apis
      @model.apisArray.sort pathSorter
      # sort operations
      for route in @model.apisArray
        route.operationsArray.sort pathSorter

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
    resourceView = new ResourceView({model: resource, tagName: 'li', id: 'resource_' + resource.id, className: 'resource'})
    $('#resources').append resourceView.render().el

  clear: ->
    $(@el).html ''
