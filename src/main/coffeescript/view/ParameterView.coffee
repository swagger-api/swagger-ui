class ParameterView extends Backbone.View
  initialize: (options) ->
    if @model.get("isExpand")
      @listenTo(@model.get("choices"), "change", @updateChoices);

    Handlebars.registerHelper 'isArray',
      (param, opts) ->
        if param.type.toLowerCase() == 'array' || param.allowMultiple
          opts.fn(@)
        else
          opts.inverse(@)
          
  render: ->
    template = @template()
    $(@el).html(template(@model.toJSON()))

    @addSignatureView()
    @addPerameterContentTypeView()

    # render each choice

    if @model.get("isQuery")
      @addChoiceView()
    @

  # Return an appropriate template based on if the parameter is a list, readonly, required
  template: ->
    if @model.get("isList")
      Handlebars.templates.param_list
    else
      if @model.get("isQuery")
        Handlebars.templates.param_query
      else
        if @model.get("isReadOnly")
          if @model.get("required")
            Handlebars.templates.param_readonly_required
          else
            Handlebars.templates.param_readonly
        else
          if @model.get("required")
            Handlebars.templates.param_required
          else
            Handlebars.templates.param


  addSignatureView: ->
    if @model.get("sampleJSON") and @model.get("isBody")
      signatureView = new SignatureView({model: @model.getSignature(), tagName: 'div'})
      $('.model-signature', $(@el)).append(signatureView.render().el)
    else
      $('.data-type', $(@el)).html(@model.get("type"))

  addPerameterContentTypeView: ->
    isParam = false

    if @model.get("isBody")
      isParam = true

    contentTypeModel =
      isParam: isParam

    if isParam
      parameterContentTypeView = new ParameterContentTypeView({model: contentTypeModel})
      $('.parameter-content-type', $(@el)).append parameterContentTypeView.render().el
    else
      responseContentTypeView = new ResponseContentTypeView({model: contentTypeModel})
      $('.response-content-type', $(@el)).append responseContentTypeView.render().el

  addChoiceView: (currentValue) ->
    # Render a query choice
    choiceView = new ParameterChoiceView({model: @model.get("choices")})
    $('.query-choices', $(@el)).append choiceView.render().el

  updateChoices: ->
    $('input.parameter', $(@el)).val(@model.get("choices").get("queryParamString"))
    unless $('.close', $(@el)).last().prop('disabled')
      @addChoiceView()

  removeChoiceView: (viewId) ->
    view = @choiceViews[viewId]
    view.remove()
    delete @choiceViews[viewId]
    @choiceSet()

  refreshChoiceViews: ->
    for viewId in Object.keys(@choiceViews)
      @choiceViews[viewId].render()










