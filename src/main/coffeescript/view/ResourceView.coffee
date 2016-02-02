class ResourceView extends Backbone.View
  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.resource(@model))

    methods = {}

    # Render each operation
    for swaggerOperation in @model.operationsArray
      counter = 0

      id = swaggerOperation.nickname
      while typeof methods[id] isnt 'undefined'
        id = id + "_" + counter
        counter += 1

      methods[id] = swaggerOperation

      swaggerOperation.nickname = id
      swaggerOperation.parentId = @model.id
      @addOperation swaggerOperation 
    @

  addOperation: (swaggerOperation) ->

    swaggerOperation.number = @number
    #wrap SwaggerOperation in a Backbone Model
    operation = new Operation(swaggerOperation)

    # Render an operation and add it to operations li
    operationView = new OperationView({model: operation, tagName: 'li', className: 'endpoint'})
    $('.endpoints', $(@el)).append operationView.render().el

    @number++
    