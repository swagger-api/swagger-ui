class Signature extends Backbone.Model

  getExpandedJSON: ->
    # currentExpansions is an object of the following pattern: {expansionField: currentlyUnexpanded}
    expandedJSON = @get("sampleJSON")
    if expandedJSON
      expandedJSON = @cleanSignature(expandedJSON)

      jsonExpansions = @get("JSONExpansions")
      if jsonExpansions
        unexpandedFields = jsonExpansions.get("unexpandedFields")
        JSONobject = $.parseJSON(expandedJSON)
        for own field in unexpandedFields
          JSONobject[field] = "--Expandable Field--"

        expandedJSON = JSON.stringify(JSONobject, null, '  ')

    return expandedJSON

  cleanSignature: (expandedJSON) ->
    # remove the open and close curly braces
    expandedJSON = expandedJSON.replace(' {</span>', '</span>')
    expandedJSON = expandedJSON.replace('<span class="strong">}</span>', '')
    # remove all of the punctuation floating between the spans
    return expandedJSON.replace(/>\W+<s/g, '/><s')


