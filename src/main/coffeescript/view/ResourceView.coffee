class ResourceView extends Backbone.View
  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.resource(@model))

    # Render each operation
    @addOperation operation for operation in @model.operationsArray
    @

  addOperation: (operation) ->
    # Render an operation and add it to operations li
    operationView = new OperationView({model: operation, tagName: 'li', className: 'endpoint'})
    $('.endpoints', $(@el)).append operationView.render().el