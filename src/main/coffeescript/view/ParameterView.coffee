class ParameterView extends Backbone.View
  initialize: ->

  render: ->
    @model.isBody = true if @model.paramType == 'body'
    @model.isFile = true if @model.dataType == 'file'

    template = @template()
    $(@el).html(template(@model))

    signatureModel =
      sampleJSON: @model.sampleJSON
      isParam: true
      signature: @model.signature

    if @model.sampleJSON
      signatureView = new SignatureView({model: signatureModel, tagName: 'div'})
      $('.model-signature', $(@el)).append signatureView.render().el
    else
      $('.model-signature', $(@el)).html(@model.signature)

    contentTypeModel =
      isParam: false

    # support old syntax
    if @model.supportedContentTypes
      contentTypeModel.produces = @model.supportedContentTypes

    if @model.produces
      contentTypeModel.produces = @model.produces

    contentTypeView = new ContentTypeView({model: contentTypeModel})
    $('.content-type', $(@el)).append contentTypeView.render().el

    @

  # Return an appropriate template based on if the parameter is a list, readonly, required
  template: ->
    if @model.isList
      Handlebars.templates.param_list
    else
      if @options.readOnly
        if @model.required
          Handlebars.templates.param_readonly_required
        else
          Handlebars.templates.param_readonly
      else
        if @model.required
          Handlebars.templates.param_required
        else
          Handlebars.templates.param
