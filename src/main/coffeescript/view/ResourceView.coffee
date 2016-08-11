class ResourceView extends Backbone.View

  events: {
    'click .expand_button' : 'expandOperations'
    'click .collapse_button' : 'collapseOperations'
  }

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


  expandOperations: ->
    $(@el).find('.expand_button').attr('hidden', true)
    $(@el).find('.collapse_button').attr('hidden', false)
    $('li#resource_' + swaggerUiRouter.escapeResourceName(@model.get('id'))).find('div.content').slideDown()

  collapseOperations: ->
    $(@el).find('.expand_button').attr('hidden', false)
    $(@el).find('.collapse_button').attr('hidden', true)
    $('li#resource_' + swaggerUiRouter.escapeResourceName(@model.get('id'))).find('div.content').slideUp()
