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
      $('#resources', $(@el)).append resourceView.render().el

  addNav: ->
    navView = new NavView({model: @model, tagName: 'ul', id: 'main_nav', className: 'nav nav-pills nav-stacked'})
    $('#main_nav_container', $(@el)).append navView.render().el
    @setAffix()

  clear: ->
    $(@el).html ''

  setAffix: ->
    $("nav.rest-api-sidebar", $(@el)).affix({offset: { top: 220, bottom: 0 }})
