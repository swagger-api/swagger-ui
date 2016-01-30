class ParameterChoiceView extends Backbone.View
    
  events: {
    'blur input.filter-argument': 'choiceChanged'
    'change select': 'choiceChanged'
    'click .close' : 'removeThisView'

  }

  initialize: ->
    if @model.get("isExpansions")
      @listenTo(@model, "change", @updateSelect)
  render: ->
    template = @template()
    $(@el).html(template(@model.toJSON()))
    if @currentValue
      @enableCloseButton()
    @

  template: ->
    if @model.get("isExpansions")
        Handlebars.templates.param_choice_expansion
    else
        Handlebars.templates.param_choice_filter

  choiceChanged: ->
    @enableCloseButton()
    if @model.get("isExpansions")
      @updateExpansion()
    else
      @updateFilter()

  updateExpansion: ->
    choice = $('.param-choice', $(@el)).val()
    if @currentValue
      @model.setExpansion(@currentValue, false)
    @currentValue = choice
    @model.setExpansion(@currentValue, true)

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

  updateSelect: ->
    $select = $('select.param-choice', $(@el))
    $select.empty()
    data = {
      currentValue: @currentValue
      unexpandedFields: @model.get("unexpandedFields")
    }
    $select.html(Handlebars.templates.expansion_select(data))

  removeThisView: ->
    if @currentValue
      if @model.get("isExpansions")
        @model.setExpansion(@currentValue, false)
      else

    @remove()
    
  enableCloseButton: ->
    $('.close', $(@el)).prop('disabled', false)




    
