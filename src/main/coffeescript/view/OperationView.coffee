class OperationView extends Backbone.View
  events: {
  'submit .sandbox'         : 'submitOperation'
  'click .submit'           : 'submitOperation'
  'click .response_hider'   : 'hideResponse'
  'click .toggleOperation'  : 'toggleOperationContent'
  }

  initialize: ->

  render: ->
    isMethodSubmissionSupported = jQuery.inArray(@model.httpMethod, @model.supportedSubmitMethods()) >= 0
    @model.isReadOnly = true unless isMethodSubmissionSupported

    $(@el).html(Handlebars.templates.operation(@model))

    if @model.responseClassSignature and @model.responseClassSignature != 'string'
      signatureModel =
        sampleJSON: @model.responseSampleJSON
        isParam: false
        signature: @model.responseClassSignature
        
      responseSignatureView = new SignatureView({model: signatureModel, tagName: 'div'})
      $('.model-signature', $(@el)).append responseSignatureView.render().el
    else
      $('.model-signature', $(@el)).html(@model.responseClass)

    contentTypeModel =
      isParam: false

    # support old syntax
    if @model.supportedContentTypes
      contentTypeModel.produces = @model.supportedContentTypes

    if @model.produces
      contentTypeModel.produces = @model.produces

    contentTypeView = new ContentTypeView({model: contentTypeModel})
    $('.content-type', $(@el)).append contentTypeView.render().el

    # Render each parameter
    @addParameter param for param in @model.parameters

    # Render each response code
    @addStatusCode statusCode for statusCode in @model.errorResponses

    @

  addParameter: (param) ->
    # Render a parameter
    paramView = new ParameterView({model: param, tagName: 'tr', readOnly: @model.isReadOnly})
    $('.operation-params', $(@el)).append paramView.render().el

  addStatusCode: (statusCode) ->
    # Render status codes
    statusCodeView = new StatusCodeView({model: statusCode, tagName: 'tr'})
    $('.operation-status', $(@el)).append statusCodeView.render().el
  
  submitOperation: (e) ->
    e?.preventDefault()
    # Check for errors
    form = $('.sandbox', $(@el))
    error_free = true
    form.find("input.required").each ->
      $(@).removeClass "error"
      if jQuery.trim($(@).val()) is ""
        $(@).addClass "error"
        $(@).wiggle
          callback: => $(@).focus()
        error_free = false

    # if error free submit it
    if error_free
      map = {}
      for o in form.serializeArray()
        if(o.value? && jQuery.trim(o.value).length > 0)
          map[o.name] = o.value

      isFileUpload = form.children().find('input[type~="file"]').size() != 0

      isFormPost = false
      consumes = "application/json"
      if @model.consumes and @model.consumes.length > 0
        # honor the consumes setting above everything else
        consumes = @model.consumes[0]
      else 
        for o in @model.parameters
          if o.paramType == 'form'
            isFormPost = true
            consumes = false

        if isFileUpload
          consumes = false
        else if @model.httpMethod.toLowerCase() == "post" and isFormPost is false
          consumes = "application/json"

      if isFileUpload
        # requires HTML5 compatible browser
        bodyParam = new FormData()

        # add params except file
        for param in @model.parameters
          if (param.paramType is 'body' or 'form') and param.name isnt 'file' and map[param.name]?
            bodyParam.append(param.name, map[param.name])

        # add files
        $.each form.children().find('input[type~="file"]'), (i, el) ->
          bodyParam.append($(el).attr('name'), el.files[0])

        console.log(bodyParam)
      else if isFormPost
        bodyParam = new FormData()
        for param in @model.parameters
          if map[param.name]?
            bodyParam.append(param.name, map[param.name])
      else
        bodyParam = null
        for param in @model.parameters
          if param.paramType is 'body'
            bodyParam = map[param.name]

      log "bodyParam = " + bodyParam 

      headerParams = null
      invocationUrl = 
        if @model.supportHeaderParams()
          headerParams = @model.getHeaderParams(map)
          @model.urlify(map, false)
        else
          @model.urlify(map, true)

      log 'submitting ' + invocationUrl


      $(".request_url", $(@el)).html "<pre>" + invocationUrl + "</pre>"
      $(".response_throbber", $(@el)).show()

      obj = 
        type: @model.httpMethod
        url: invocationUrl
        headers: headerParams
        data: bodyParam
        contentType: consumes
        dataType: 'json'
        processData: false
        error: (xhr, textStatus, error) =>
          @showErrorStatus(xhr, textStatus, error)
        success: (data) =>
          @showResponse(data)
        complete: (data) =>
          @showCompleteStatus(data)

      paramContentTypeField = $("td select[name=contentType]", $(@el)).val()
      if paramContentTypeField
        obj.contentType = paramContentTypeField

      log 'content type = ' + obj.contentType

      if not obj.data or (obj.type is 'GET' or obj.type is 'DELETE')
        obj.contentType = false

      log 'content type is now = ' + obj.contentType

      responseContentTypeField = $('.content > .content-type > div > select[name=contentType]', $(@el)).val()
      if responseContentTypeField
        obj.headers = if obj.headers? then obj.headers else {}
        obj.headers.accept = responseContentTypeField
      
      jQuery.ajax(obj)
      false
      # $.getJSON(invocationUrl, (r) => @showResponse(r)).complete((r) => @showCompleteStatus(r)).error (r) => @showErrorStatus(r)

  # handler for hide response link
  hideResponse: (e) ->
    e?.preventDefault()
    $(".response", $(@el)).slideUp()
    $(".response_hider", $(@el)).fadeOut()


  # Show response from server
  showResponse: (response) ->
    prettyJson = JSON.stringify(response, null, "\t").replace(/\n/g, "<br>")
    $(".response_body", $(@el)).html escape(prettyJson)


  # Show error from server
  showErrorStatus: (data) ->
    @showStatus data

  # show the status codes
  showCompleteStatus: (data) ->
    @showStatus data

  # Adapted from http://stackoverflow.com/a/2893259/454004
  formatXml: (xml) ->
    reg = /(>)(<)(\/*)/g
    wsexp = /[ ]*(.*)[ ]+\n/g
    contexp = /(<.+>)(.+\n)/g
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2')
    pad = 0
    formatted = ''
    lines = xml.split('\n')
    indent = 0
    lastType = 'other'
    # 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
    transitions =
      'single->single': 0
      'single->closing': -1
      'single->opening': 0
      'single->other': 0
      'closing->single': 0
      'closing->closing': -1
      'closing->opening': 0
      'closing->other': 0
      'opening->single': 1
      'opening->closing': 0
      'opening->opening': 1
      'opening->other': 1
      'other->single': 0
      'other->closing': -1
      'other->opening': 0
      'other->other': 0

    for ln in lines
      do (ln) ->

        types =
          # is this line a single tag? ex. <br />
          single: Boolean(ln.match(/<.+\/>/))
          # is this a closing tag? ex. </a>
          closing: Boolean(ln.match(/<\/.+>/))
          # is this even a tag (that's not <!something>)
          opening: Boolean(ln.match(/<[^!?].*>/))

        [type] = (key for key, value of types when value)
        type = if type is undefined then 'other' else type

        fromTo = lastType + '->' + type
        lastType = type
        padding = ''

        indent += transitions[fromTo]
        padding = ('  ' for j in [0...(indent)]).join('')
        if fromTo == 'opening->closing'
          #substr removes line break (\n) from prev loop
          formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'
        else
          formatted += padding + ln + '\n'
      
    formatted
    

  # puts the response data in UI
  showStatus: (data) ->
    try
      code = $('<code />').text(JSON.stringify(JSON.parse(data.responseText), null, 2))
      pre = $('<pre class="json" />').append(code)
    catch error
      code = $('<code />').text(@formatXml(data.responseText))
      pre = $('<pre class="xml" />').append(code)
    response_body = pre
    $(".response_code", $(@el)).html "<pre>" + data.status + "</pre>"
    $(".response_body", $(@el)).html response_body
    $(".response_headers", $(@el)).html "<pre>" + data.getAllResponseHeaders() + "</pre>"
    $(".response", $(@el)).slideDown()
    $(".response_hider", $(@el)).show()
    $(".response_throbber", $(@el)).hide()
    hljs.highlightBlock($('.response_body', $(@el))[0])

  toggleOperationContent: ->
    elem = $('#' + Docs.escapeResourceName(@model.resourceName) + "_" + @model.nickname + "_" + @model.httpMethod + "_" + @model.number + "_content")
    if elem.is(':visible') then Docs.collapseOperation(elem) else Docs.expandOperation(elem)
