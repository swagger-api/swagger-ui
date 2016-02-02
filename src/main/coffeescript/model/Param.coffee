class Param extends Backbone.Model

  initialize: ->
    if @get("paramType") == "query"
      if @get("name") == "expand"
        @set("choices", new Expansions({description: @get("description")}))
      else        
        @set("choices", new Filters({description: @get("description")}))

    type = @get("type") || @get("dataType")
    @set("isFile", true) if type.toLowerCase() == 'file'
    @set("isBody", true) if @get("paramType") == 'body'
    @set("isQuery", true) if @get("paramType") == 'query'
    @set("isFilter", true) if @get("name") == 'filter'
    @set("isExpand", true) if @get("name") == 'expand'


    signature = @get("signature")
    if signature and signature != 'string'
      # display only the first model (none of the expansion models)
      @set("abridgedSignature", signature.slice(0, signature.indexOf('}</span>') + 8))

  getSignatureModel: ->
    signatureModel = null
    if @get("sampleJSON")
      signatureAttributes =
        sampleJSON: @get("sampleJSON")
        isParam: true
        signature: @get("abridgedSignature")
        JSONExpansions: @get("JSONExpansions")

      signatureModel = new Signature(signatureAttributes)
    return signatureModel



