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

      isFileUpload = $('input[type~="file"]').size != 0

      if isFileUpload
        # requires HTML5 compatible browser
        bodyParam = new FormData()

        # add params
        for param in @model.parameters
          if param.paramType is 'body'
            bodyParam.append(param.name, map[param.name])

        # add files
        $.each $('input[type~="file"]'), (i, el) ->
          bodyParam.append($(el).attr('name'), el.files[0])

        console.log(bodyParam)
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
        dataType: 'json'
        processData: false
        error: (xhr, textStatus, error) =>
          @showErrorStatus(xhr, textStatus, error)
        success: (data) =>
          @showResponse(data)
        complete: (data) =>
          @showCompleteStatus(data)

      obj.contentType = "application/json" if (obj.type.toLowerCase() == "post" or obj.type.toLowerCase() == "put" or obj.type.toLowerCase() == "patch")
      obj.contentType = false if isFileUpload
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
    $(".response_body", $(@el)).html prettyJson


  # Show error from server
  showErrorStatus: (data) ->
    @showStatus data

  # show the status codes
  showCompleteStatus: (data) ->
    @showStatus data

  # puts the response data in UI
  showStatus: (data) ->
    try
      response_body = '<pre class="json"><code>' + JSON.stringify(JSON.parse(data.responseText), null, 2) + "</code></pre>"
    catch error
      response_body = "<span style='color:red'>&nbsp;&nbsp;&nbsp;[unable to parse as json; raw response below]</span><br><pre>" + data.responseText + "</pre>"
    $(".response_code", $(@el)).html "<pre>" + data.status + "</pre>"
    $(".response_body", $(@el)).html response_body
    $(".response_headers", $(@el)).html "<pre>" + data.getAllResponseHeaders() + "</pre>"
    $(".response", $(@el)).slideDown()
    $(".response_hider", $(@el)).show()
    $(".response_throbber", $(@el)).hide()
    hljs.highlightBlock($('.response_body', $(@el))[0])

  toggleOperationContent: ->
    elem = $('#' + @model.resourceName + "_" + @model.nickname + "_" + @model.httpMethod + "_content");
    if elem.is(':visible') then Docs.collapseOperation(elem) else Docs.expandOperation(elem)
