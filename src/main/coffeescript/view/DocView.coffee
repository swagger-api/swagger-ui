class DocView extends Backbone.View
  events: {
    'click .toggleOperation': 'toggleOperationContent'
  }

  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.overview(@model))
        
    @

  toggleOperationContent: ->
    elem = $('#' + @model.name + "_doc_content")
    
    if elem.is(':visible')
      Docs.collapseOperation(elem)
    else
      Docs.expandOperation(elem)