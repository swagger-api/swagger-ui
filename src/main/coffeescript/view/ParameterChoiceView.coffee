class ParameterChoiceView extends Backbone.View
    
  events: {
    'blur input.filter-argument': 'checkForCompleteFilter'
    'change select': 'checkForCompleteFilter'

  }

  initialize: ->

  render: ->
    if @model.choiceType == 'expand'
      @model.isExpand = true
    else
      @model.isFilter = true

    template = @template()
    $(@el).html(template(@model))
    @

  template: ->
    if @model.isExpand
        Handlebars.templates.param_choice_expansion
    else
        Handlebars.templates.param_choice_filter

  checkForCompleteFilter: ->
    choice = $('.param-choice', $(@el)).val()
    argument = $('.filter-argument', $(@el)).val()
    if argument
      argument = argument.trim()
    operator = $('.filter-operator', $(@el)).val()
    if @model.isExpand and choice
      @trigger('choiceSet', {name: choice, activeParam: true})
    else if @model.isFilter and choice and argument
      @trigger('choiceSet', {name: choice, activeParam: "#{choice}#{operator}#{argument}"})
    else
      @trigger('choiceSet', {name: choice, activeParam: false})

    
