class StatusCodeView extends Backbone.View
  initialize: ->

  isListType: (type) ->
    listType = null
    if type && type.indexOf('[') >= 0
      listType = type.substring(type.indexOf('[') + 1, type.indexOf(']'))
    else
      listType = undefined
    listType

  render: ->
    template = @template()
    @model.statusCode.hasResponseModel = @model.statusCode.responseModel && @model.statusCode.responseModel != 'void'
    $(@el).html(template(@model.statusCode))
    listType = @isListType(@model.statusCode.responseModel)
    isPrimitive = false
    if (listType != null && swaggerUi.api.models[listType]) || swaggerUi.api.models[@model.statusCode.responseModel]
      isPrimitive = false
    else
      isPrimitive = true
    jsonSample = null;
    mockSignature = null;
    modelAnchor = null;
    if isPrimitive
      jsonSample = SwaggerModelProperty.prototype.toSampleValue(listType || @model.statusCode.responseModel)
      mockSignature = listType || @model.statusCode.responseModel
      if typeof jsonSample == 'string'
        jsonSample = '"' + jsonSample + '"'
      if listType
        jsonSample = '[' + jsonSample + ']'
        modelAnchor = 'ArrayOf' + mockSignature
        mockSignature = '<span class="strong">Array of ' + mockSignature + '</span>'
    else if listType
      jsonSample = '[' + JSON.stringify(swaggerUi.api.models[listType].createJSONSample(), null, 2) + ']'
      mockSignature = '<span class="strong">Array of </span>' + swaggerUi.api.models[listType].getMockSignature()
      modelAnchor = 'ArrayOf' + swaggerUi.api.models[listType].name
    else
      jsonSample = JSON.stringify(swaggerUi.api.models[@model.statusCode.responseModel].createJSONSample(), null, 2)
      mockSignature = swaggerUi.api.models[@model.statusCode.responseModel].getMockSignature()
      modelAnchor = swaggerUi.api.models[@model.statusCode.responseModel].name
    if mockSignature && mockSignature.indexOf('{') > -1
      modelLabel = mockSignature.substring(0, mockSignature.indexOf('{')) + '</span>'
    else
      modelLabel = mockSignature
    responseModel =
      parentId: @model.container.resourceName,
      nickname: @model.container.nickname,
      modelAnchor: modelAnchor
      modelLabel: modelLabel
      sampleJSON: jsonSample
      isParam: false
      signature: mockSignature

    responseModelView = new SignatureView({model: responseModel, tagName: 'div'})
    $('.model-signature', @$el).append responseModelView.render().el
    @

  template: ->
    Handlebars.templates.status_code

