class ResourceView extends Backbone.View
  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.resource(@model.toJSON()))

    # Render each operation
    for operationModel in @model.get('operationsArray')
      @addOperation operationModel

    @

  addOperation: (operationModel) ->
    operationView = new OperationView({
      model: operationModel 
      tagName: 'li'
      className: operationModel.get('viewClassName')
      id: operationModel.get('viewId')
    })
    $('.endpoints', $(@el)).append operationView.render().el
    