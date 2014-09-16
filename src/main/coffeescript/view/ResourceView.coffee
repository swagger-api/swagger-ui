class ResourceView extends Backbone.View
  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.resource(@model))

    methods = {}

    if @model.basePaths && Object.keys(@model.basePaths).length > 0
      $('div.resourceContent div.basePaths', $(@el)).css('display','block')

    for env, basePath of @model.basePaths
      @addBasePath(env, basePath)

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
      operation.swaggerRoot = $("script[src]").last().attr("src").split('?')[0].split('/').slice(0, -1).join('/')+'/..';

      @addOperation operation 
    @

  addOperation: (operation) ->

    operation.number = @number

    # Render an operation and add it to operations li
    operationView = new OperationView({model: operation, tagName: 'li', className: 'endpoint', swaggerOptions: @options.swaggerOptions})
    $('.endpoints', $(@el)).append operationView.render().el

    @number++

  addBasePath: (env, basePath) ->
    # Render a basePath and add it to basePath li
    basePathView = new BasePathView({model: {env: env, basePath: basePath}, tagName: 'tr', className: 'basePath'})
    $('.basePath-Values', $(@el)).append basePathView.render().el