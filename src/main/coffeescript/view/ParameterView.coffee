class ParameterView extends Backbone.View
  initialize: (options) ->
    if (options.eventAggregator)
      this.eventAggregator = options.eventAggregator

    Handlebars.registerHelper 'isArray',
      (param, opts) ->
        if param.type.toLowerCase() == 'array' || param.allowMultiple
          opts.fn(@)
        else
          opts.inverse(@)

  events: {
    'click input.choice-checkbox': 'choiceToggled'
  }
          
  render: ->
    type = @model.type || @model.dataType
    @model.isBody = true if @model.paramType == 'body'
    @model.isFile = true if type.toLowerCase() == 'file'
    @model.isQuery = true if @model.paramType == 'query'
    @model.isFilter = true if @model.name == 'filter'

    if @model.isQuery
      choicesString = @model.description
      choicesString = choicesString.slice(choicesString.indexOf("[") + 1, choicesString.indexOf("]"))
      @model.choices = choicesString.split(/[\s,]+/)

      @model.activeChoices = {}
      for choice in @model.choices
        @model.activeChoices[choice] = false

      @choiceToggled()


    template = @template()
    $(@el).html(template(@model))

    signatureModel =
      sampleJSON: @model.sampleJSON
      isParam: true
      signature: @model.signature

    if @model.sampleJSON and @model.isBody
      signatureView = new SignatureView({model: signatureModel, tagName: 'div'})
      $('.model-signature', $(@el)).append signatureView.render().el
    else
      $('.data-type', $(@el)).html(@model.type)

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

  choiceToggled: (ev) ->
    if (ev)
      $checkbox = $(ev.currentTarget)
      @model.activeChoices[$checkbox.val()] = $checkbox.prop( "checked" )
      

    if @model.name == 'expand'
      @updateExpansionsString()
      this.eventAggregator.trigger('applyExpansions', @model.activeChoices)

    if @model.isFilter
      @updateFiltersString()

  updateExpansionsString: ->
    allChoices = Object.keys(@model.activeChoices)
    queryParamString = ""
    for choice in allChoices
      if @model.activeChoices[choice]
        queryParamString = queryParamString.concat(choice, ",")

    queryParamString = queryParamString.slice(0, -1);

    $('input.parameter', $(@el)).val(queryParamString)

  updateFiltersString: ->




  parseChoices: ->



