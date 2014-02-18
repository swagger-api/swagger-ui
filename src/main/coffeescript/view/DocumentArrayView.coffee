class DocumentArrayView extends Backbone.View

  initialize: =>


  render: =>
    @items = 0;

    if !@model.isPresent
      @$el.html(Handlebars.templates.array_undefined(@model))
    else
      if @model.required
        @$el.html(Handlebars.templates.array_required(@model))
      else
        @$el.html(Handlebars.templates.array(@model))

    $('#'+@model.id+'-set', @$el).click @setArray
    $('#'+@model.id+'-undefined', @$el).click @removeArray
    $('#'+@model.id+'-add', @$el).click @addItem
    $('#'+@model.id+'-remove', @$el).click @removeItem

    # add existing items
    for val in @model.values?
      @addItem()

    @

  newItem: =>
    # Render an array item
    property = {}
    property.name = @items
    property.id = @model.id + '_' + property.name
    property.path = @model.path + '.' + property.name
    property.dataType = @model.refModel?.name || @model.refDataType
    property.refModel = @model.refModel
    property.isRoot = true
    property.isPresent = true
    property.value = @model.value && @model.value[ property.name ]
    log 'ADD', @model
    if @model.refModel
      property.document = @model.document
      if property.dataType == 'array'
        property.path = property.path + '[]'
        propertyView = new DocumentArrayView({model: property, className: 'array-item'})
      else
        propertyView = new DocumentObjectView({model: property, className: 'array-item'})
    else
      propertyView = new DocumentPropertyView({model: property, className: 'array-item'})
    $('#' + @model.id, @$el).append propertyView.render().el

    @items++

  addItem: =>
    @newItem()
    @model.document.inputChanged()

  removeItem: =>
    $('#' + @model.id, @$el).children().last().remove();
    @model.document.inputChanged()

  setArray: =>
    @model.isPresent = true
    @render()
    @model.document.inputChanged()

  removeArray: =>
    @model.isPresent = false
    @render()
    @model.document.inputChanged()

