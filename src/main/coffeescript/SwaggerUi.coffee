class SwaggerUi extends Backbone.Router

  # Defaults
  dom_id: "swagger_ui"

  # Attributes
  options: null
  api: null
  headerView: null
  mainView: null

  # SwaggerUi accepts all the same options as SwaggerApi
  initialize: (options={}) ->
    # Allow dom_id to be overridden
    if options.dom_id?
      @dom_id = options.dom_id
      delete options.dom_id

    # Create an empty div which contains the dom_id
    $('body').append('<div id="' + @dom_id + '"></div>') if not $('#' + @dom_id)?

    @options = options

    # Set the callbacks
    @options.success = => @render()
    @options.progress = (d) => @showMessage(d)
    @options.failure = (d) => @onLoadFailure(d)

    # Create view to handle the header inputs
    @headerView = new HeaderView({el: $('#header')})

    # Event handler for when the baseUrl/apiKey is entered by user
    @headerView.on 'update-swagger-ui', (data) => @updateSwaggerUi(data)

  # Event handler for when url/key is received from user
  updateSwaggerUi: (data) ->
    @options.url = data.url
    @load()

  # Create an api and render
  load: ->
    # Initialize the API object
    @mainView?.clear()
    url = @options.url
    if url.indexOf("http") isnt 0
      url = @buildUrl(window.location.href.toString(), url)

    @options.url = url
    @headerView.update(url)
    @api = new SwaggerApi(@options)
    @api.build()
    @api

  # This is bound to success handler for SwaggerApi
  #  so it gets called when SwaggerApi completes loading
  render:() ->
    @showMessage('Finished Loading Resource Information. Rendering Swagger UI...')
    @mainView = new MainView({model: @api, el: $('#' + @dom_id), swaggerOptions: @options}).render()
    @showMessage()
    switch @options.docExpansion
      when "full" then Docs.expandOperationsForResource('')
      when "list" then Docs.collapseOperationsForResource('')
    @options.onComplete(@api, @) if @options.onComplete
    setTimeout(
      =>
        Docs.shebang()
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

window.SwaggerUi = SwaggerUi
