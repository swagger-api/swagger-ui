class ResponseContentTypeView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()

    $(@el).html(template(@model))
    
    $('label[for=responseContentType]', $(@el)).text('Response Content Type')

    @

  template: ->
    Handlebars.templates.response_content_type
