class ContentTypeView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))

    @isParam = @model.isParam

    if @isParam
      $('label[for=contentType]', $(@el)).text('Parameter content type:')
    else
      $('label[for=contentType]', $(@el)).text('Response Content Type')

    @

  template: ->
    Handlebars.templates.content_type

