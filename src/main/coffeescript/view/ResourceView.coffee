class ResourceView extends Backbone.View
  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.resource(@model.toJSON()))

    # Render each operation
    @addTypes()
    @

  addTypes: ->
    for typeModel in @model.get('typeModels')
      typeView = new TypeView({
        model: typeModel 
        tagName: 'li'
        id: typeModel.get('viewId')
      })
      $('.operationTypes', $(@el)).append(typeView.render().el)
     
    