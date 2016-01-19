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
    'click input.expand-checkbox': 'expandToggled'
  }
          
  render: ->
    type = @model.type || @model.dataType
    @model.isBody = true if @model.paramType == 'body'
    @model.isFile = true if type.toLowerCase() == 'file'
    @model.isQuery = true if @model.paramType == 'query'

    if @model.isQuery
      choicesString = @model.description
      choicesString = choicesString.slice(choicesString.indexOf("[") + 1, choicesString.indexOf("]"))
      @model.choices = choicesString.split(/[\s,]+/)

      if @model.name == 'expand'
        @model.activeExpansions = {}
        for choice in @model.choices
          @model.activeExpansions[choice] = false

        @expandToggled()


    template = @template()
    $(@el).html(template(@model))

    signatureModel =
      sampleJSON: @model.sampleJSON
      isParam: true
      signature: @model.signature

    if @model.sampleJSON and @model.isBody
      signatureView = new SignatureView({model: signatureModel, tagName: 'div'})
      $('.model-signature', $(@el)).append signatureView.render().el

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

  expandToggled: (ev) ->
    if (ev)
      $checkbox = $(ev.currentTarget)
      @model.activeExpansions[$checkbox.val()] = $checkbox.prop( "checked" )

    this.eventAggregator.trigger('applyExpansions', @model.activeExpansions)
