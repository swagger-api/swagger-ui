class DocumentView extends Backbone.View
  events: {
    'change input.property': 'inputChanged'
    'change select.property': 'inputChanged'
    'click a.document-link': 'switchToDocument'
    'click a.json-link': 'switchToJSON'
  }

  initialize: ->
    try
      @value = JSON.parse @model.defaultValue
    catch e

  render: ->
    @model.dataType = @model.type || @model.dataType
    @model.isRoot = true
    @model.isPresent = true
    @model.document = @
    @model.path = 'body'
    if @model.dataType == 'array'
      @model.path = @model.path + '[]'

    $(@el).html Handlebars.templates.document @model
    @switchToDocument()

    @

  fillDocument: =>
    # if a model is defined then add fields for editing that object or array
    @model.value = @value;
    if @model.dataType == 'array'
      documentView = new DocumentArrayView({model: @model})
    else
      documentView = new DocumentObjectView({model: @model})
    $('.model-document', @$el).html documentView.render().el

  # handler for show signature
  switchToDocument: (e) =>
    e?.preventDefault()
    # rebuild document
    try
      @value = JSON.parse e.target.value
    catch
    @fillDocument()
    $('.model-json', @$el).hide()
    $('.model-document', @$el).show()
    $('.document-link', @$el).addClass('selected')
    $('.json-link', @$el).removeClass('selected')

  # handler for show sample
  switchToJSON: (e) =>
    e?.preventDefault()
    $('.model-document', @$el).hide()
    $('.model-json', @$el).show()
    $('.json-link', @$el).addClass('selected')
    $('.document-link', @$el).removeClass('selected')
    # clear document
    $('.model-document', @$el).empty()

  inputChanged: (e) =>
    map = {}

    # Check for errors
    form = $('.model-document', @$el)
    error_free = true

    #form.find("input.required").each ->
    #  if $.trim($(@).val()) is ""
    #    $(@).addClass "error"
    #    error_free = false
    #  else
    #    $(@).removeClass "error"
    #  true

    # if error free submit it
    if error_free
      for o in form.find("input.property")
        if o.value? && jQuery.trim(o.value).length > 0
          @setMapValue map, o.name, if $(o).hasClass('numeric') then +o.value else o.value

      for o in form.find("textarea.property")
        if o.value? && jQuery.trim(o.value).length > 0
          @setMapValue map, o.name, o.value

      for o in form.find("select.property") 
        if o.value? && jQuery.trim(o.value).length > 0
          @setMapValue map, o.name, JSON.parse o.value

      @value = map.body
      $('.body-textarea', @$el).val JSON.stringify(@value, null, '\t')


  # set a deep value of a nested set of objects and arrays, creating structures along the way
  # eg, setMapValue obj 'a.b.c[].2.d' 3  =>  obj['a']['b']['c'][2]['d'] = 3
  setMapValue: (map, name, value) ->
    nameParts = name.split '.'
    dest = map
    while nameParts.length > 1
      parent = dest
      namePart = nameParts.shift()
      if isArray
        namePart = +namePart
      isArray = false
      if namePart.match? /\[\]$/
        isArray = true
        namePart = namePart.replace '[]', ''
      dest = parent[namePart];
      if typeof dest != 'object'
         dest = parent[namePart] = if isArray then [] else {}
    # a trailing . will create the object without setting any values in it
    valueKey = nameParts.shift()
    dest[valueKey] = value if valueKey != '';

