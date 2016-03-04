class Type extends Backbone.Model

  initialize: ->
    operationModels = []
    for swaggerOperation in @get('operationsArray')
      operationModels.push new Operation(swaggerOperation)

    @set('operationModels', operationModels)