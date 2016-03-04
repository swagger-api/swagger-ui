class Resource extends Backbone.Model

  initialize: ->
    operationsByType = {}
    types = []
    typeModels = []

    for swaggerOperation in @get('operationsArray')
      swaggerOperation.parentId = @get('id')

      # Use endpoint naming for type for consistancy
      type = @getType(swaggerOperation)
      if typeof operationsByType[type] is 'undefined'
        operationsByType[type] = []
        types.push type
      operationsByType[type].push(swaggerOperation)

    for type in types.sort()
      typeModels.push new Type({
        name: type
        viewId: @get('name') + "_" + type
        operationsArray: operationsByType[type]
        })
  
    @set('typeModels', typeModels)

  getType: (swaggerOperation) ->
    # get the final object identifier from the URI
    words = swaggerOperation.path.match(/\/((\w|\.)+)(\/{\w+}|\/|)$/)[1].split("_")
    capitalized = []
    for word in words
      capitalized.push(word.charAt(0).toUpperCase() + word.slice(1))
    return capitalized.join("")





