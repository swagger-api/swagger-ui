class SwaggerUiRouter extends Backbone.Router

  # Attributes
  options: null
  api: null
  headerView: null
  mainView: null

  # SwaggerUi accepts all the same options as SwaggerApi
  initialize: (options={}) ->

    @options = options

    # Set the callbacks
    @options.success = => @render()
    @options.progress = (d) => @showMessage(d)
    @options.failure = (d) => @onLoadFailure(d)

  # Create an api and render
  load: ->
    # Initialize the API object
    @mainView?.clear()
    url = @options.url
    if url.indexOf("http") isnt 0
      url = @buildUrl(window.location.href.toString(), url)

    @options.url = url

    @api = new SwaggerApi(@options)
    @api.build()

  # This is bound to success handler for SwaggerApi
  # so it gets called when SwaggerApi completes loading
  render:() ->
    @showMessage('Finished Loading Resource Information. Rendering Swagger UI...')
        # wrap swaggerApi in backbone model
    apiModel  = new Api(@api)
    @mainView = new MainView({model: apiModel, el: $('#swagger-ui-container')}).render()
    @showMessage()
    @options.onComplete(@api, @) if @options.onComplete
    @setUiLibraries()
    setTimeout(
      =>
        @checkShebang()
      400
    )

  buildUrl: (base, url) ->
    log "base is " + base
    if url.indexOf("/") is 0
      parts = base.split("/")
      base = parts[0] + "//" + parts[2]
      base + url
    else
      endOfPath = base.length
      if base.indexOf("?") > -1
        endOfPath = Math.min(endOfPath, base.indexOf("?"))
      if base.indexOf("#") > -1
        endOfPath = Math.min(endOfPath, base.indexOf("#"))
      base = base.substring(0, endOfPath);
      if base.indexOf( "/", base.length - 1 ) isnt -1
        return base + url
      return base + "/" + url

  setUiLibraries: () ->
    selectPlaceholder = $('select.param-choice').attr('placeholder');
    $('select.param-choice').select2({
      placeholder: selectPlaceholder,
      containerCssClass: 'tpx-select2-container',
      dropdownCssClass: 'tpx-select2-drop',
      dropdownAutoWidth : true,
      })

  # Shows message on topbar of the ui
  showMessage: (data = '') ->
    $('#message-bar').removeClass 'message-fail'
    $('#message-bar').addClass 'message-success'
    $('#message-bar').html data

  # shows message in red
  onLoadFailure: (data = '') ->
    $('#message-bar').removeClass 'message-success'
    $('#message-bar').addClass 'message-fail'
    val = $('#message-bar').html data
    @options.onFailure(data) if @options.onFailure?
    val

  checkShebang: ->
    # If shebang has an operation nickname in it..
    # e.g. /docs/#!/words/get_search
    fragments = $.param.fragment().split('/')
    fragments.shift() # get rid of the bang

    #Expand operation
    dom_id = 'resource_' + fragments[0]
    $("#"+dom_id).slideto({highlight: false})

    # Expand operation
    li_dom_id = fragments.join('_')
    li_content_dom_id = li_dom_id + "_content"

    $('#'+li_content_dom_id).slideDown()
    $('#'+li_dom_id).slideto({highlight: false})

  escapeResourceName: (resource) ->
    resource.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&")


window.SwaggerUiRouter = SwaggerUiRouter
