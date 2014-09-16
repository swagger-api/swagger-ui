class ParameterView extends Backbone.View
  initialize: ->
    Handlebars.registerHelper 'isArray',
      (param, opts) ->
        if param.type.toLowerCase() == 'array' || param.allowMultiple
          opts.fn(@)
        else
          opts.inverse(@)
          
  render: ->
    type = @model.param.type || @model.param.dataType
    @model.param.isBody = true if @model.param.paramType == 'body'
    @model.param.isFile = true if type.toLowerCase() == 'file'

    template = @template()
    $(@el).html(template(@model.param))

    modelAnchor = @model.param.type || @model.param.dataType
    modelLabel = @model.param.type || @model.param.dataType
    if modelAnchor.indexOf('[') >= 0
      modelAnchor = modelAnchor.replace(/\[/, 'ArrayOf').replace(/\]/, '')
      modelLabel = modelLabel.replace(/\[/, 'Array of ').replace(/\]/, '')
    signatureModel =
      parentId: @model.container.resourceName,
      nickname: @model.container.nickname,
      modelAnchor: modelAnchor,
      sampleJSON: if typeof @model.param.sampleJSON == 'function' then @model.param.sampleJSON(@model.param) else @model.param.sampleJSON
      isParam: true
      signature: if typeof @model.param.signature == 'function' then @model.param.signature(@model.param) else @model.param.signature
      modelLabel: modelLabel

    if @model.param.sampleJSON
      signatureView = new SignatureView({model: signatureModel, tagName: 'div'})
      $('.model-signature', $(@el)).append signatureView.render().el
    else
      $('.model-signature', $(@el)).html(@model.param.signature)

    isParam = false

    if @model.param.isBody
      isParam = true

    contentTypeModel =
      isParam: isParam

    contentTypeModel.consumes = @model.param.consumes

    if isParam
      parameterContentTypeView = new ParameterContentTypeView({model: contentTypeModel})
      $('.parameter-content-type', $(@el)).append parameterContentTypeView.render().el

    else
      responseContentTypeView = new ResponseContentTypeView({model: contentTypeModel})
      $('.response-content-type', $(@el)).append responseContentTypeView.render().el

    @

  # Return an appropriate template based on if the parameter is a list, readonly, required
  template: ->
    if @model.param.isList
      Handlebars.templates.param_list
    else
      if @options.readOnly
        if @model.param.required
          Handlebars.templates.param_readonly_required
        else
          Handlebars.templates.param_readonly
      else
        if @model.param.required
          Handlebars.templates.param_required
        else
          Handlebars.templates.param
