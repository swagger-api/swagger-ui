class EndpointView extends Backbone.View
  initialize: ->

  render: ->
    @setElement($(Handlebars.templates.endpoint(@model)))

    @number = 0

    # Render each operation
    @addOperation operation for operation in @model.operationsArray
    @

  addOperation: (operation) ->

    operation.number = @number

    # Render an operation and add it to operations li
    operationView = new OperationView({model: operation, tagName: 'ul', className: 'operations'})
    $('.operations', $(@el)).append operationView.render().el

    @number++
