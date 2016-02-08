class ResourceView extends Backbone.View
  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.resource(@model.toJSON()))

    # Render each operation
    @addOperations()
    @

  addOperations: ->
    for operationModel in @model.get('operationsArray')
      operationView = new OperationView({
        model: operationModel 
        tagName: 'li'
        className: operationModel.get('viewClassName')
        id: operationModel.get('viewId')
      })
      $('.endpoints', $(@el)).append operationView.render().el
    