class NavView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model.toJSON()))
    @

  template: ->
    Handlebars.templates.nav