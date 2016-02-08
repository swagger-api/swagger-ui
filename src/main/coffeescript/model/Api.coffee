class Api extends Backbone.Model

  initialize: ->
    resources = {}
    wrappedResourceModels = []
    for resource in @get("apisArray")
      counter = 2
      id = resource.name
      while typeof resources[id] isnt 'undefined'
        id = id + "_" + counter
        counter += 1
      resource.id = id
      resource.viewId = 'resource_' + resource.id
      resources[id] = resource

      wrappedResourceModels.push new Resource(resource)

    @set("resourcesArray", wrappedResourceModels)