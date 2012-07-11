class MainView extends Backbone.View
  initialize: ->

  render: ->
    # Render the outer container for resources
    $(@el).html(Handlebars.templates.main(@model))

    # Render each resource
    @addResource resource for resource in @model.resourcesArray
    @

  addResource: (resource) ->
    # Render a resource and add it to resources li
    resourceView = new ResourceView({model: resource, tagName: 'li', id: 'resource_' + resource.name, className: 'resource'})
    $('#resources').append resourceView.render().el

  clear: ->
    $(@el).html ''