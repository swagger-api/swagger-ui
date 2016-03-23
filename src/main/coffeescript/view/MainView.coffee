class MainView extends Backbone.View
  initialize: ->

  render: ->
    # Render the outer container for resources
    $(@el).html(Handlebars.templates.main(@model))

    # Render each resource

    resources = {}
    @resourceViewReferences = []
    counter = 0

    @addGlobalParameters()
    @addResources()
    @addNav()
    @

  addNav: ->
    navView = new NavView({model: @model, tagName: 'ul', id: 'main_nav', className: 'nav nav-pills nav-stacked'})
    $('#main_nav_container', $(@el)).append navView.render().el
    @setAffix()

  addGlobalParameters: ->
    $('#global_params_container', $(@el)).append new GlobalParametersView({model: @model}).render().el
    @setAffixGlobalParameters()

  addResources: ->
    for resource in @model.get("resourcesArray")
      resourceView = new ResourceView({model: resource, tagName: 'li', id: resource.get("viewId"), className: 'resource active'})
      $('#resources', $(@el)).append resourceView.render().el

  clear: ->
    $(@el).html ''

  setAffix: ->
    $("nav.rest-api-sidebar", $(@el)).affix({offset: { top: 120, bottom: 0 }})

  setAffixGlobalParameters: ->
    $("#global_params_container", $(@el)).affix({offset: { top: 160, bottom: 0 }})
