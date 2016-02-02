class ParameterChoiceView extends Backbone.View
    
  events: {
    'blur input.filter-argument': 'choiceChanged'
    'change select': 'choiceChanged'
    'click .close' : 'removeThisView'

  }

  initialize: (options) ->
    this.options = options || {}
    @currentValue = options.currentValue
    if @model.get("isExpansions")
      @listenTo(@model, "change", @updateSelect)

  render: ->
    template = @template()
    modelJSON = @model.toJSON()
    modelJSON["currentValue"] = @currentValue
    $(@el).html(template(modelJSON))
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
      @currentValue = "#{choice}#{operator}#{argument}"
      @model.setChoiceViewFilter(@cid, @currentValue)
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
        @model.removeChoiceViewFilter(@cid)

    @remove()
    
  enableCloseButton: ->
    $('.close', $(@el)).prop('disabled', false)




    
