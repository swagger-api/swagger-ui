class ParameterChoiceView extends Backbone.View
    
  events: {
    'click input.expansion-checkbox': 'expansionToggled'
    'click input.filter-checkbox': 'filterToggled'
    'blur input.filter-argument': 'checkForCompleteFilter'
    'change select.filter-operator': 'checkForCompleteFilter'
  }

  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))
    @

  template: ->
    if @model.choiceType == 'expand'
        Handlebars.templates.param_choice_expansion
    #else == 'filter'
    else
        Handlebars.templates.param_choice_filter

  expansionToggled: (ev) ->
    @trigger('choiceToggled', {name: @model.name, activeParam: $(ev.currentTarget).prop('checked')})

  filterToggled: (ev) ->
    isChecked = $(ev.currentTarget).prop('checked')
    if isChecked
      $('.filter-operator', $(@el)).prop('disabled', false)
      $('.filter-argument', $(@el)).prop('disabled', false)
    else
      $('.filter-operator', $(@el)).prop('disabled', true)
      $('.filter-argument', $(@el)).prop('disabled', true)
    @checkForCompleteFilter()

  checkForCompleteFilter: () ->
    checked = $('.filter-checkbox', $(@el)).prop('checked')
    argument = $('.filter-argument', $(@el)).val()

    # if not empty argument and checked
    if checked and argument.trim()
      operator = $('.filter-operator', $(@el)).val()
      @trigger('choiceToggled', {name: @model.name, activeParam: {operator: operator, argument: argument}})
    else
      @trigger('choiceToggled', {name: @model.name, activeParam: false})


    
