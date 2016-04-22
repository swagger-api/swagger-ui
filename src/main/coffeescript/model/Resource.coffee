class Resource extends Backbone.Model

  initialize: ->
    operationsByType = {}
    types = []
    typeModels = []

    nicknameCounts = {}
    for swaggerOperation in @get('operationsArray')
      # Use count to allow proper DOM ids for dupe operation nicknames
      nickname = swaggerOperation.nickname
      if nicknameCounts[nickname]
        nicknameCounts[nickname] += 1
        nickname = nickname + "_" + nicknameCounts[nickname]
      else
        nicknameCounts[nickname] = 1
      swaggerOperation.nickname = nickname

      swaggerOperation.parentId = @get('id')

      # Use endpoint naming for type for consistancy
      type = @getType(swaggerOperation)
      if typeof operationsByType[type] is 'undefined'
        operationsByType[type] = []
        types.push type
      operationsByType[type].push(swaggerOperation)

    for type in types
      typeModels.push new Type({
        name: type
        viewId: @get('name') + "_" + type
        operationsArray: operationsByType[type]
        })
  
    @set('typeModels', typeModels)

  getType: (swaggerOperation) ->
    # get the final object identifier from the URI
    words = swaggerOperation.path.match(/\/((\w|\.)+)(\/{\w+}|\/|)$/)[1].split(/_|\./)
    capitalized = []
    for word in words
      if word == "csv"
        capitalized.push("CSV")
      else
        capitalized.push(word.charAt(0).toUpperCase() + word.slice(1))
    return capitalized.join("")