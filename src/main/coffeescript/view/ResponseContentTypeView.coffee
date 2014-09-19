class ResponseContentTypeView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()

    $(@el).html(template(@model))

    $('label[for=responseContentType]', $(@el)).text('Content-Type do retorno:')

    @

  template: ->
    Handlebars.templates.response_content_type
