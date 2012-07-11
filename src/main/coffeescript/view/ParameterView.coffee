class ParameterView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))
    @

  # Return an appropriate template based on if the parameter is a list, readonly, required
  template: ->
    if @model.isList
      Handlebars.templates.param_list
    else
      if @options.readOnly
        if @model.required
          Handlebars.templates.param_readonly_required
        else
          Handlebars.templates.param_readonly
      else
        if @model.required
          Handlebars.templates.param_required
        else
          Handlebars.templates.param
