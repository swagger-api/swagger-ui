class ParameterChoiceView extends Backbone.View
    
  events: {
    'blur input.filter-argument': 'choiceChanged'
    'change select': 'choiceChanged'
    'click .close' : 'removeThisView'

  }

  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template($.extend({}, @model, {currentValue: @currentValue})))
    if @currentValue
      @enableCloseButton()
    @

  template: ->
    if @model.isExpand
        Handlebars.templates.param_choice_expansion
    else
        Handlebars.templates.param_choice_filter

  choiceChanged: ->
    choice = $('.param-choice', $(@el)).val()
    argument = $('.filter-argument', $(@el)).val()
    @enableCloseButton()
    if argument
      argument = argument.trim()
    operator = $('.filter-operator', $(@el)).val()
    if @model.isExpand and choice
      @currentValue = choice
      @trigger('choiceSet')
    else if @model.isFilter and choice and argument
      @currentValue = "#{choice}#{operator}#{argument}"
      @trigger('choiceSet')
    else
      @currentValue = null
      @trigger('choiceSet')

  removeThisView: ->
    @trigger('removeChoiceView', @cid)

  enableCloseButton: ->
    $('.close', $(@el)).prop('disabled', false)




    
