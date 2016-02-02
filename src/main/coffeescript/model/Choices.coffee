class Choices extends Backbone.Model

  initialize: ->
    @parseChoices
    #use to track when value set from example json click, etc.
    @valueSetExternally=null
    @set("currentValues", {})
    @set("queryParamString", "")
    @update()

  parseChoices: ->
    #Based on current practice of having all choices in a string representation of an array in the description
    choicesString = @get("description")
    choiceArray = choicesString.slice(choicesString.indexOf("[") + 1, choicesString.indexOf("]")).split(/[\s,]+/)
    @set("allChoices", choiceArray)

  setSelectedValue: (choiceViewId, value) ->
    @get("currentValues")[choiceViewId] = value
    @update()

  update: ->
    #DEFINE IN CHILD CLASS
