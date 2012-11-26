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

    @switchToDescription()

    @isParam = @model.isParam

    if @isParam
      $('.notice', $(@el)).text('Click to set as parameter value')

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

  # handler for snippet to text area
  snippetToTextArea: (e) ->
    if @isParam
      e?.preventDefault()
      textArea = $('textarea', $(@el.parentNode.parentNode.parentNode))
      if $.trim(textArea.val()) == ''
        textArea.val(@model.sampleJSON)


    
