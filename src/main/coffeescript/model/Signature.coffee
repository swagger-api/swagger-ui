class Signature extends Backbone.Model

  initialize: ->
    # remove the open and close curly braces
    cleanVersion = @get('signature').replace(' {</span>', '</span>')
    cleanVersion = cleanVersion.replace('<span class="strong">}</span>', '')
    # remove all of the punctuation floating between the spans
    cleanVersion = cleanVersion.replace(/>\W+<\/d/g, '></d')
    @set('cleanSignature', cleanVersion.replace(/>\W+<s/g, '/><s'))


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
