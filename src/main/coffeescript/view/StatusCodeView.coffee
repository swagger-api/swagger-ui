class StatusCodeView extends Backbone.View
  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))

    models = this.options.parent.options.parent.options.parent.model.models

    if models.hasOwnProperty @model.responseModel
      models = this.options.parent.options.parent.options.parent.model.models
      responseModel =
        sampleJSON: JSON.stringify(models[@model.responseModel].createJSONSample(), null, 2)
        isParam: false
        signature: models[@model.responseModel].getMockSignature()

      responseModelView = new SignatureView({model: responseModel, tagName: 'div'})
      $('.model-signature', @$el).append responseModelView.render().el
    else
      $('.model-signature', @$el).html ''
    @

  template: ->
    Handlebars.templates.status_code

