class ResourceView extends Backbone.View
  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.resource(@model))

    methods = {}

    # Render each operation
    for operation in @model.operationsArray
      counter = 0

      id = operation.nickname
      while typeof methods[id] isnt 'undefined'
        id = id + "_" + counter
        counter += 1

      methods[id] = operation

      operation.nickname = id
      operation.parentId = @model.id
      @addOperation operation 
    @

  addOperation: (operation) ->

    operation.number = @number

    # Render an operation and add it to operations li
    operationView = new OperationView({model: operation, tagName: 'li', className: 'endpoint'})
    $('.endpoints', $(@el)).append operationView.render().el

    @number++