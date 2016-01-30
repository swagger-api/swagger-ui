class ParameterChoiceView extends Backbone.View
    
  events: {
    'blur input.filter-argument': 'choiceChanged'
    'change select': 'choiceChanged'
    'click .close' : 'removeThisView'

  }

  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model.toJSON()))
    if @currentValue
      @enableCloseButton()
    @

  template: ->
    if @model.isExpand
        Handlebars.templates.param_choice_expansion
    else
        Handlebars.templates.param_choice_filter

  choiceChanged: ->
    @enableCloseButton()
    if @model.get("isExpansions")
      @updatedExpansion
    else
      @updateFilter

  updatedExpansion: ->
    choice = $('.param-choice', $(@el)).val()
    if choice
      @currentValue = choice
      @model.setExpansion(@currentValue, true)
    else if @currentValue
      @model.setExpansion(@currentValue, false)
      @currentValue = null

  updateFilter: ->
    choice = $('.param-choice', $(@el)).val()
    operator = $('.filter-operator', $(@el)).val()
    argument = $('.filter-argument', $(@el)).val()
    if argument
      argument = argument.trim()

    if choice and argument
      @model.setChoiceViewFilter(@cid, "#{choice}#{operator}#{argument}")
    else
      @model.removeChoiceViewFilter(@cid)

  removeThisView: ->
    @remove()
    
  enableCloseButton: ->
    $('.close', $(@el)).prop('disabled', false)




    
