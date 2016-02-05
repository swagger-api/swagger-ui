class MainView extends Backbone.View
  initialize: ->

  render: ->
    # Render the outer container for resources
    $(@el).html(Handlebars.templates.main(@model))

    # Render each resource

    resources = {}
    @resourceViewIds = []
    counter = 0
    for resource in @model.apisArray
      id = resource.name
      while typeof resources[id] isnt 'undefined'
        id = id + "_" + counter
        counter += 1
      resource.id = id
      resources[id] = resource
      resourceViewId = 'resource_' + resource.id
      @resourceViewIds.push(resourceViewId)
      @addResource resource
    
    @addNav()
    @



  addResource: (resource, resourceViewId) ->
    # Render a resource and add it to resources li
    resourceView = new ResourceView({model: resource, tagName: 'li', id: resourceViewId, className: 'resource'})
    $('#resources').append resourceView.render().el

  addNav: ->
    navData = {}
    navData['resourceViewIds'] = @resourceViewIds
    navView = new NavView({model: navData, id: 'main_nav', className: 'nav nav-pills nav-stacked'})
    $('#main_nav_container').append navView.render().el

  clear: ->
    $(@el).html ''