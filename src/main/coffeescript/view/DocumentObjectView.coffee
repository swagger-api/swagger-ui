class DocumentObjectView extends Backbone.View

  initialize: =>

  render: =>
    if !@model.isPresent
      @$el.html(Handlebars.templates.object_undefined(@model))
    else
      if @model.required
        @$el.html(Handlebars.templates.object_required(@model))
      else
        @$el.html(Handlebars.templates.object(@model))
      @addProperty property for property in @model.refModel.properties

    $('#'+@model.id+'-set', @$el).click @setObject
    $('#'+@model.id+'-undefined', @$el).click @removeObject    

    @

  addProperty: (type) ->
    # Render a parameter
    property = $.extend {}, type
    property.id = @model.id + '_' + property.name
    property.path = @model.path + '.' + property.name
    property.value = @model.value && @model.value[ property.name ]
    if property.refModel
      property.document = @model.document
      property.isPresent = !!property.value || property.required
      if property.dataType == 'array'
        property.path = property.path + '[]'
        propertyView = new DocumentArrayView({model: property})
      else
        propertyView = new DocumentObjectView({model: property})
    else
      propertyView = new DocumentPropertyView({model: property})
    $('#' + @model.id, @$el).append propertyView.render().el

  setObject: =>
    @model.isPresent = true
    @render()
    @model.document.inputChanged()

  removeObject: =>
    @model.isPresent = false
    @render()
    @model.document.inputChanged()
