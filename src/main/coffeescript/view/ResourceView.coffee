class ResourceView extends Backbone.View
  initialize: (opts={}) ->
    @auths = opts.auths
    if "" is @model.description
      @model.description = null
    if @model.description?
      @model.summary = @model.description

  render: ->
    methods = {}


    $(@el).html(Handlebars.templates.resource(@model))

    # Render each operation
    for operation in @model.operationsArray
      counter = 0

      id = operation.nickname
      while typeof methods[id] isnt 'undefined'
        id = id + "_" + counter
        counter += 1

      methods[id] = operation

      operation.nickname = id
      operation.parentId = @model.id
      @addOperation operation 

    $('.toggleEndpointList', @el).click(this.callDocs.bind(this, 'toggleEndpointListForResource'))
    $('.collapseResource', @el).click(this.callDocs.bind(this, 'collapseOperationsForResource'))
    $('.expandResource', @el).click(this.callDocs.bind(this, 'expandOperationsForResource'))
    
    return @

  addOperation: (operation) ->

    operation.number = @number

    # Render an operation and add it to operations li
    operationView = new OperationView({
      model: operation,
      tagName: 'li',
      className: 'endpoint',
      swaggerOptions: @options.swaggerOptions,
      auths: @auths
    })
    $('.endpoints', $(@el)).append operationView.render().el

    @number++

  #
  # Generic Event handler (`Docs` is global)
  #

  callDocs: (fnName, e) ->
    e.preventDefault()
    Docs[fnName](e.currentTarget.getAttribute('data-id'))
