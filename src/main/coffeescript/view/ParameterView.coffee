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
        @trigger('applyUnexpandedFields', @model.availableChoices)


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
    @model.availableChoices = @model.choices.slice()
    @model.currentChoices = []
    @choiceViews = {}
    @currentChoiceViewValues = {}


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
    choiceView = new ParameterChoiceView({model: @model})
    @choiceViews[choiceView.cid] = choiceView
    @listenTo(choiceView, 'choiceSet', @choiceSet)
    @listenTo(choiceView, 'removeChoiceView', @removeChoiceView)
    $('.query-choices', $(@el)).append choiceView.render().el

  choiceSet: (choice) ->

    if @model.isExpand
      @updateExpansions()
      @trigger('applyUnexpandedFields', @model.availableChoices)

    if @model.isFilter
      @updateFiltersString()

  updateExpansions: ->
    queryParamString = ""
    @model.availableChoices = []
    @model.currentChoices = []
    lastChoiceIsBlank = false
    for viewId in Object.keys(@choiceViews)
      lastChoiceIsBlank = false
      choice = @choiceViews[viewId].currentValue
      if choice
        @model.currentChoices.push(choice)
        queryParamString = queryParamString.concat(choice, ",")
      else
        lastChoiceIsBlank = true

    queryParamString = queryParamString.slice(0, -1);
      
    for choice in @model.choices
      if choice not in @model.currentChoices
        @model.availableChoices.push(choice)

    $('input.parameter', $(@el)).val(queryParamString)

    @refreshChoiceViews()

    unless lastChoiceIsBlank
      @addChoiceView()

  updateFiltersString: ->
    queryParamString = ""
    for choiceView in Object.keys(@choiceViews)
      if choiceView.currentValue
        queryParamString = queryParamString.concat(choiceView.activeParam, "&filter=")

    queryParamString = queryParamString.slice(0, -8);

    $('input.parameter', $(@el)).val(queryParamString)

  removeChoiceView: (viewId) ->
    view = @choiceViews[viewId]
    view.remove()
    delete @choiceViews[viewId]
    @choiceSet()

  refreshChoiceViews: ->
    for viewId in Object.keys(@choiceViews)
      @choiceViews[viewId].render()










