class BasePathView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))
    @

  template: ->
    Handlebars.templates.basePath
