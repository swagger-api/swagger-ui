class Signature extends Backbone.Model

  getExpandedJSON: ->
    # currentExpansions is an object of the following pattern: {expansionField: currentlyUnexpanded}
    expandedJSON = @get("sampleJSON")
    if expandedJSON
      jsonExpansions = @get("JSONExpansions")
      if jsonExpansions
        unexpandedFields = jsonExpansions.get("unexpandedFields")
        JSONobject = $.parseJSON(expandedJSON)
        for own field in unexpandedFields
          JSONobject[field] = "--Expandable Field--"

        expandedJSON = JSON.stringify(JSONobject, null, '  ')

    return expandedJSON