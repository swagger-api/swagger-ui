class ParameterContentTypeView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))

    $('label[for=parameterContentType]', $(@el)).text('Parameter content type:')

    @

  template: ->
    Handlebars.templates.parameter_content_type

