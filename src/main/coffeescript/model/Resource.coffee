class Resource extends Backbone.Model

  initialize: ->
    methods = {}
    wrappedOperationModels = []
    for swaggerOperation in @get('operationsArray')
      counter = 2
      nickname = swaggerOperation.nickname
      while typeof methods[nickname] isnt 'undefined'
        nickname = nickname + "_" + counter
        counter += 1

      methods[nickname] = swaggerOperation
      swaggerOperation.nickname = nickname
      swaggerOperation.parentId = @get('id')

      swaggerOperation.viewClassName = swaggerOperation.method.toUpperCase() + ' operation'
      swaggerOperation.viewId = swaggerOperation.parentId + "_" + swaggerOperation.nickname
      #wrap swaggerOperation in a Backbone Model
      wrappedOperationModels.push(new Operation(swaggerOperation))

    @set('operationsArray', wrappedOperationModels)

