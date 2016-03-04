class TypeView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model.toJSON()))
    @addOperations()
    @

  template: ->
    Handlebars.templates.type


  addOperations: ->
    for operationModel in @model.get('operationModels')
      operationView = new OperationView({
        model: operationModel 
        tagName: 'li'
      })
      $('.operations', $(@el)).append(operationView.render().el)