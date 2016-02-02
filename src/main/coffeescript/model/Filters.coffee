class Filters extends Choices

  initialize: ->
    # extra attributes: currentFilters, queryParamString, allChoices, isFilters
    @set("isFilters", true)
    @parseChoices()
    @set("currentFilters", {})
    @set("queryParamString", "")

  parseChoices: ->
    #Based on current practice of having all choices in a string representation of an array in the description
    choicesString = @get("description")
    choiceArray = choicesString.slice(choicesString.indexOf("[") + 1, choicesString.indexOf("]")).split(/[\s,]+/)
    @set("allChoices", choiceArray)

  setChoiceViewFilter: (choiceViewId, value) ->
    @get("currentFilters")[choiceViewId] = value
    @update()

  removeChoiceViewFilter: (choiceViewId) ->
    delete @get("currentFilters")[choiceViewId]
    @update()

  update: ->
    currentValues = @get("currentFilters")
    queryParamString = ""
    for own viewId of currentValues
      value = currentValues[viewId]
      queryParamString = queryParamString.concat(value, "&filter=")

    @set("queryParamString", queryParamString.slice(0, -8))