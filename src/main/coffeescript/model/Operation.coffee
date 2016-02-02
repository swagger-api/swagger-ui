class Operation extends Backbone.Model

  initialize: ->
    #This class is a wrapper for the SwaggerOperation passed to it
    @urlify = @get("urlify")
    @getHeaderParams = @get("getHeaderParams")
    @supportHeaderParams = @get("supportHeaderParams")
    @do = @get("do")

    @set("method", @get("method").toUpperCase())

    signature = @get("responseClassSignature")
    if signature and signature != 'string'
      # display only the first model (none of the expansion models)
      @set("abridgedSignature", signature.slice(0, signature.indexOf('}</span>') + 8))

    @buildParamModels()

  buildParamModels: ->
    params = []
    for paramBaseData in @get("parameters")
      param = new Param(paramBaseData)
      params.push(param)

      if param.get("name") == "expand"
        #a Choices Model subclass
        @set("JSONExpansions", param.get("choices"))

    # Second iteration so all params track expansions (expansions may be 'undefined')
    for param in params
      param.set("JSONExpansions", @get("JSONExpansions"))

    @set("parameterModels", params)


  getSignatureModel: ->
    signatureModel = null
    if @get("responseSampleJSON")
      signatureAttributes =
        sampleJSON: @get("responseSampleJSON")
        isParam: true
        signature: @get("abridgedSignature")
        JSONExpansions: @get("JSONExpansions")

      signatureModel = new Signature(signatureAttributes)

    return signatureModel
