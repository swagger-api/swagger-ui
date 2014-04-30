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

    $('#'+@model.id+'-remove', @$el).hide()

    # add existing items
    if @model.value
      for val in @model.value
        @newItem()

    @

  newItem: =>
    # Render an array item
    property = {}
    property.name = @items
    property.id = @model.id + '_' + property.name
    property.path = @model.path + '.' + property.name
    property.dataType = @model.refModel?.name || @model.refDataType
    property.refModel = @model.refModel
    property.isPresent = true
    property.required = true
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

    $('#' + @model.id+'-remove', @$el).show()
    $('#' + @model.id+'-undefined', @$el).hide()

    @items++

  addItem: =>
    @newItem()
    @model.document.inputChanged()

  removeItem: =>
    if @items <= 1
      $('#' + @model.id, @$el).empty();
      $('#' + @model.id+'-remove', @$el).hide()
      $('#' + @model.id+'-undefined', @$el).show()
      @items = 0
    else
      $('#' + @model.id, @$el).children().last().remove();
      @items--

    @model.document.inputChanged()

  setArray: =>
    @model.isPresent = true
    @render()
    @newItem()
    @model.document.inputChanged()

  removeArray: =>
    @model.isPresent = false
    @render()
    @model.document.inputChanged()

