class ResourceView extends Backbone.View
  initialize: ->

  render: ->
    $(@el).html(Handlebars.templates.resource(@model))

    @number = 0

    if @model.endpointsArray?
      # Render each endpoint
      @addEndpoint endpoint for endpoint in @model.endpointsArray
    else
      # Render each operation separately into manually create endpoint
      empty_endpoint = {path: '', description: '', operationsArray: [], operations: {}}
      endpoint_el = $(Handlebars.templates.endpoint(empty_endpoint))
      $('.endpoints', $(@el)).append endpoint_el
      @addOperation operation for operation in @model.operationsArray
    @

  addEndpoint: (endpoint) ->
    endpointView = new EndpointView({model: endpoint})
    $('.endpoints', $(@el)).append endpointView.render().el

  addOperation: (operation) ->

    operation.number = @number

    # Render an operation and add it to operations li
    # TODO:
    # - Create empty endpoint and put operations directly inside it.
    operationView = new OperationView({model: operation})
    $('.operations', $(@el)).append operationView.render().el

    @number++

    
