class ContentTypeView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))

    $('label[for=contentType]', $(@el)).text('Content Type do Retorno')

    @

  template: ->
    Handlebars.templates.content_type

