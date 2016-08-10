class SignatureView extends Backbone.View
  events: {
  # 'click a.description-link'       : 'switchToDescription'
  # 'click a.snippet-link'           : 'switchToSnippet'
  'mousedown .snippet'          : 'snippetToTextArea'
  'click span.expandable' : 'expansionFromJSON'
  }

  initialize: ->
    @listenTo(@model.get("JSONExpansions"), "change", @updateSignature)

  render: ->
    template = @template()
    $(@el).html(template(@model.toJSON()))

    @switchToSnippet()

    if @model.get("isParam")
      $('.notice', $(@el)).html('<i class="fa fa-exclamation-circle"></i>&nbsp;Click above to set as body')

    @updateSignature()


    @

  template: ->
      Handlebars.templates.signature

  # handler for show signature
  switchToDescription: (e) ->
    e?.preventDefault()
    $(".snippet", $(@el)).show()
    $(".description", $(@el)).show()
    $('.description-link', $(@el)).addClass('selected')
    $('.snippet-link', $(@el)).removeClass('selected')

  # handler for show sample
  switchToSnippet: (e) ->
    e?.preventDefault()
    $(".description", $(@el)).show()
    $(".snippet", $(@el)).show()
    $('.snippet-link', $(@el)).addClass('selected')
    $('.description-link', $(@el)).removeClass('selected')

  updateSignature: ->
    $("code", $(@el)).html(@model.getExpandedJSON())
    @highlightJSON()
    @enableExpandableSpans()

  highlightJSON: ->
    $("code", $(@el)).each (i, block) =>
      hljs.highlightBlock(block)

  enableExpandableSpans: ->
    $("span.string", $(@el)).each(
      ()->
        if $(this).text() == '"--Expandable Field--"'
          $(this).addClass("expandable")
        # if ($this).text() == '"--Expandable Field--"'
          # $(this).parent.addClass("expandable-value")
    )

  expansionFromJSON: (e) ->
    field = $(e.currentTarget).parent().prev().text()
    @model.get("JSONExpansions").expansionFromJSON(field)

  # handler for snippet to text area
  snippetToTextArea: (e) ->
    if @isParam
      e?.preventDefault()
      textArea = $('textarea', $(@el.parentNode.parentNode.parentNode))
      if $.trim(textArea.val()) == ''
        textArea.val(@model.get("sampleJSON"))
