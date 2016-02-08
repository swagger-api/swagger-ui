class MainView extends Backbone.View
  initialize: ->

  render: ->
    # Render the outer container for resources
    $(@el).html(Handlebars.templates.main(@model))

    # Render each resource

    resources = {}
    @resourceViewReferences = []
    counter = 0

    @addResources()
    @addNav()
    @



  addResources: ->
    for resource in @model.get("resourcesArray")
      resourceView = new ResourceView({model: resource, tagName: 'li', id: resource.get("viewId"), className: 'resource active'})
      $('#resources').append resourceView.render().el

  addNav: ->
    navView = new NavView({model: @model, id: 'main_nav', className: 'nav nav-pills nav-stacked'})
    $('#main_nav_container').append navView.render().el

  clear: ->
    $(@el).html ''