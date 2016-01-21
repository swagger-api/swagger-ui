class ParameterChoiceView extends Backbone.View
    
  events: {
    'click input.expansion-checkbox': 'expansionToggled'
    'click input.filter-checkbox': 'filterToggled'
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
    @trigger('choiceToggled', {name: @model.name, checked: $(ev.currentTarget).prop('checked')})

  filterToggled: (ev) ->


