class ParameterView extends Backbone.View
  initialize: (options) ->
    this.options = options || {}

    Handlebars.registerHelper 'isArray',
      (param, opts) ->
        if param.type.toLowerCase() == 'array' || param.allowMultiple
          opts.fn(@)
        else
          opts.inverse(@)
          
  render: ->
    type = @model.type || @model.dataType
    @model.isBody = true if @model.paramType == 'body'
    @model.isFile = true if type.toLowerCase() == 'file'
    @model.isQuery = true if @model.paramType == 'query'
    @model.isFilter = true if @model.name == 'filter'
    @model.isExpand = true if @model.name == 'expand'

    if @model.isQuery
      @parseChoices()
      if @model.isExpand
        #notify OperationView to build JSON based on default expansions (none)
        @trigger('applyExpansions', @model.activeChoices)

    template = @template()
    $(@el).html(template(@model))

    @addSignatureView()
    @addPerameterContentTypeView()

    # render each choice

    if @model.isQuery
      @addChoiceView()

    @

  # Return an appropriate template based on if the parameter is a list, readonly, required
  template: ->
    if @model.isList
      Handlebars.templates.param_list
    else
      if @model.isQuery
        Handlebars.templates.param_query
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


  parseChoices: ->
    #Based on current practice of having all choices in a string representation of an array
    choicesString = @model.description
    @model.choices = choicesString.slice(choicesString.indexOf("[") + 1, choicesString.indexOf("]")).split(/[\s,]+/)
    @model.activeChoices = {}
    for choice in @model.choices
      @model.activeChoices[choice] = false

  addSignatureView: ->
    signatureModel =
      sampleJSON: @model.sampleJSON
      isParam: true
      signature: @model.signature

    if @model.sampleJSON and @model.isBody
      signatureView = new SignatureView({model: signatureModel, tagName: 'div'})
      $('.model-signature', $(@el)).append signatureView.render().el
    else
      $('.data-type', $(@el)).html(@model.type)

  addPerameterContentTypeView: ->
    isParam = false

    if @model.isBody
      isParam = true

    contentTypeModel =
      isParam: isParam

    contentTypeModel.consumes = @model.consumes

    if isParam
      parameterContentTypeView = new ParameterContentTypeView({model: contentTypeModel})
      $('.parameter-content-type', $(@el)).append parameterContentTypeView.render().el
    else
      responseContentTypeView = new ResponseContentTypeView({model: contentTypeModel})
      $('.response-content-type', $(@el)).append responseContentTypeView.render().el

  addChoiceView: (choices, choiceType) ->
    # Render a query choice
    choiceView = new ParameterChoiceView({model: {choices: @model.choices, choiceType: @model.name}})
    @listenTo(choiceView, 'choiceSet', @choiceSet)
    $('.query-choices', $(@el)).append choiceView.render().el

  choiceSet: (choice) ->
    @model.activeChoices[choice.name] = choice.activeParam

    if @model.isExpand
      @updateExpansionsString()
      @trigger('applyExpansions', @model.activeChoices)

    if @model.isFilter
      @updateFiltersString()

  updateExpansionsString: ->
    queryParamString = ""
    for choice in @model.choices
      if @model.activeChoices[choice]
        queryParamString = queryParamString.concat(choice, ",")

    queryParamString = queryParamString.slice(0, -1);

    $('input.parameter', $(@el)).val(queryParamString)

  updateFiltersString: ->
    queryParamString = ""
    for choice in @model.choices
      if @model.activeChoices[choice]
        activeParam = @model.activeChoices[choice]
        queryParamString = queryParamString.concat(activeParam, "&filter=")

    queryParamString = queryParamString.slice(0, -8);

    $('input.parameter', $(@el)).val(queryParamString)







