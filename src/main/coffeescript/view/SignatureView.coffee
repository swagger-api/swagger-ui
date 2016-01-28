class SignatureView extends Backbone.View
  events: {
  'click a.description-link'       : 'switchToDescription'
  'click a.snippet-link'           : 'switchToSnippet'
  'mousedown .snippet'          : 'snippetToTextArea'
  }

  initialize: ->

  render: ->
    template = @template()
    $(@el).html(template(@model))

    @switchToSnippet()

    @isParam = @model.isParam

    if @isParam
      $('.notice', $(@el)).text('Click above to set as body')

    $("code", $(@el)).each (i, block) =>
      hljs.highlightBlock(block)
    
    @enableExpandableSpans()

    @

  template: ->
      Handlebars.templates.signature

  # handler for show signature
  switchToDescription: (e) ->
    e?.preventDefault()
    $(".snippet", $(@el)).hide()
    $(".description", $(@el)).show()
    $('.description-link', $(@el)).addClass('selected')
    $('.snippet-link', $(@el)).removeClass('selected')
    
  # handler for show sample
  switchToSnippet: (e) ->
    e?.preventDefault()
    $(".description", $(@el)).hide()
    $(".snippet", $(@el)).show()
    $('.snippet-link', $(@el)).addClass('selected')
    $('.description-link', $(@el)).removeClass('selected')

  enableExpandableSpans: ->
    $("span.string", $(@el)).each(
      ()->
        if $(this).text() == '"<Expandable Field>"'
          $(this).addClass("expandable")
    )

  # handler for snippet to text area
  snippetToTextArea: (e) ->
    if @isParam
      e?.preventDefault()
      textArea = $('textarea', $(@el.parentNode.parentNode.parentNode))
      if $.trim(textArea.val()) == ''
        textArea.val(@model.sampleJSON)