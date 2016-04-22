class ParameterChoiceView extends Backbone.View
    
  events: {
    'blur input.filter-argument': 'choiceChanged'
    'change select': 'choiceChanged'
    'click .close' : 'removeThisView'
  }

  initialize: (options) ->
    this.options = options || {}
    @currentValue = options.currentValue

  render: ->
    template = @template()
    modelJSON = @model.toJSON()
    modelJSON["currentValue"] = @currentValue
    $(@el).html(template(modelJSON))
    $('select', $(@el)).select2()
    if @currentValue
      @enableCloseButton()
    @

  template: ->
    Handlebars.templates.param_choice_filter

  choiceChanged: ->
    @enableCloseButton()
    @updateFilter()

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

  removeThisView: ->
    if @currentValue
        @model.removeChoiceViewFilter(@cid)
    @remove()
    
  enableCloseButton: ->
    $('.close', $(@el)).prop('disabled', false)




    
