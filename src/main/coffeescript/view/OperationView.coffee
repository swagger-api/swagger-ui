class OperationView extends Backbone.View
  events: {
  'submit .sandbox'         : 'submitOperation'
  'click .submit'           : 'submitOperation'
  'click .response_hider'   : 'hideResponse'
  'click .toggleOperation'  : 'toggleOperationContent'
  }

  initialize: ->

  render: ->
    isMethodSubmissionSupported = true #jQuery.inArray(@model.method, @model.supportedSubmitMethods) >= 0
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
      $('.model-signature', $(@el)).html(@model.type)

    contentTypeModel =
      isParam: false

    contentTypeModel.consumes = @model.consumes
    contentTypeModel.produces = @model.produces

    for param in @model.parameters
      type = param.type || param.dataType
      if type.toLowerCase() == 'file'
        if !contentTypeModel.consumes
          console.log "set content type "
          contentTypeModel.consumes = 'multipart/form-data'

    responseContentTypeView = new ResponseContentTypeView({model: contentTypeModel})
    $('.response-content-type', $(@el)).append responseContentTypeView.render().el

    # Render each parameter
    @addParameter param, contentTypeModel.consumes for param in @model.parameters

    # Render each response code
    @addStatusCode statusCode for statusCode in @model.responseMessages

    @

  addParameter: (param, consumes) ->
    # Render a parameter
    param.consumes = consumes
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
      opts = {parent: @}
      #for o in form.serializeArray()
        #if(o.value? && jQuery.trim(o.value).length > 0)
          #map[o.name] = o.value

      for o in form.find("input")
        if(o.value? && jQuery.trim(o.value).length > 0)
          map[o.name] = encodeURI(o.value)

      for o in form.find("textarea")
        if(o.value? && jQuery.trim(o.value).length > 0)
          map["body"] = o.value

      for o in form.find("select")
        if(o.value? && jQuery.trim(o.value).length > 0)
          map[o.name] = o.value

      opts.responseContentType = $("div select[name=responseContentType]", $(@el)).val()
      opts.requestContentType = $("div select[name=parameterContentType]", $(@el)).val()

      $(".response_throbber", $(@el)).show()

      @model.do(map, opts, @showCompleteStatus, @showErrorStatus, @)

  success: (response, parent) ->
    parent.showCompleteStatus response


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
  showErrorStatus: (data, parent) ->
    parent.showStatus data

  # show the status codes
  showCompleteStatus: (data, parent) ->
    parent.showStatus data

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
    content = data.content.data
    headers = data.getHeaders()

    # if server is nice, and sends content-type back, we can use it
    contentType = headers["Content-Type"]

    if content == undefined
      code = $('<code />').text("no content")
      pre = $('<pre class="json" />').append(code)
    else if contentType.indexOf("application/json") == 0
      code = $('<code />').text(JSON.stringify(JSON.parse(content), null, 2))
      pre = $('<pre class="json" />').append(code)
    else if contentType.indexOf("application/xml") == 0
      code = $('<code />').text(@formatXml(content))
      pre = $('<pre class="xml" />').append(code)
    else if contentType.indexOf("text/html") == 0
      code = $('<code />').html(content)
      pre = $('<pre class="xml" />').append(code)
    else
      # don't know what to render!
      code = $('<code />').text(content)
      pre = $('<pre class="json" />').append(code)

    response_body = pre
    $(".request_url").html "<pre>" + data.request.url + "</pre>"
    $(".response_code", $(@el)).html "<pre>" + data.status + "</pre>"
    $(".response_body", $(@el)).html response_body
    $(".response_headers", $(@el)).html "<pre>" + JSON.stringify(data.getHeaders()) + "</pre>"
    $(".response", $(@el)).slideDown()
    $(".response_hider", $(@el)).show()
    $(".response_throbber", $(@el)).hide()
    hljs.highlightBlock($('.response_body', $(@el))[0])

  toggleOperationContent: ->
    elem = $('#' + Docs.escapeResourceName(@model.resourceName) + "_" + @model.nickname + "_" + @model.method + "_" + @model.number + "_content")
    if elem.is(':visible') then Docs.collapseOperation(elem) else Docs.expandOperation(elem)
