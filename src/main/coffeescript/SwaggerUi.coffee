class SwaggerUi extends Backbone.Router

  # Defaults
  domEl: $('#swagger_ui')

  # Attributes
  options: null
  api: null
  headerView: null
  mainView: null

  # SwaggerUi accepts all the same options as SwaggerApi
  initialize: (options={}) ->
    # Allow dom_id to be overridden
    if options.dom_id?
      @domEl = $('#' + options.dom_id)
      delete options.dom_id

    # Allow domeEl to be specified
    else if options.domEl?
      @domEl = options.domEl

    if not options.supportedSubmitMethods?
      options.supportedSubmitMethods = [
        'get'
        'put'
        'post'
        'delete'
        'head'
        'options'
        'patch'
      ]

    # Make sure this.domeEl is a jQuery element
    @domEl = $(@domEl)

    # if domEl is not attached to document append it to <body>
    if !$.contains(document.documentElement, @domEl.get(0))
      $('body').append(@domEl)

    @options = options

    # set marked options
    marked.setOptions(gfm: true)

    # Set the callbacks
    @options.success = =>
      @render()
    @options.progress = (d) => @showMessage(d)
    @options.failure = (d) =>
      @onLoadFailure(d)

    # Create view to handle the header inputs if there is header element
    if $('#header').length
      @headerView = new HeaderView({el: $('#header')})

      # Event handler for when the baseUrl/apiKey is entered by user
      @headerView.on 'update-swagger-ui', (data) => @updateSwaggerUi(data)

  # Set an option after initializing
  setOption: (option,value) ->
    @options[option] = value

  # Get the value of a previously set option
  getOption: (option) ->
    @options[option]

  # Event handler for when url/key is received from user
  updateSwaggerUi: (data) ->
    @options.url = data.url
    @load()

  # Create an api and render
  load: ->
    # Initialize the API object
    @mainView?.clear()
    url = @options.url
    if url && url.indexOf("http") isnt 0
      url = @buildUrl(window.location.href.toString(), url)

    @options.url = url
    if @headerView
      @headerView.update(url)

    @api = new SwaggerClient(@options)

  # collapse all sections
  collapseAll:() ->
    Docs.collapseEndpointListForResource('')

  # list operations for all sections
  listAll:() ->
    Docs.collapseOperationsForResource('')

  # expand operations for all sections
  expandAll:() ->
    Docs.expandOperationsForResource('')

  # This is bound to success handler for SwaggerApi
  #  so it gets called when SwaggerApi completes loading
  render:() ->
    @showMessage('Finished Loading Resource Information. Rendering Swagger UI...')
    @mainView = new MainView({model: @api, el: @domEl, swaggerOptions: @options, router: @}).render()
    @showMessage()
    switch @options.docExpansion
      when "full" then @expandAll()
      when "list" then @listAll()
    @renderGFM()
    @options.onComplete(@api, @) if @options.onComplete
    setTimeout(
      =>
        Docs.shebang()
      100
    )

  buildUrl: (base, url) ->
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

  # Renders GFM for elements with 'markdown' class
  renderGFM: (data = '') ->
    $('.markdown').each (index) ->
      $(this).html(marked($(this).html()))

window.SwaggerUi = SwaggerUi
