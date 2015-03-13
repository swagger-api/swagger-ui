'use strict';

SwaggerUi.Views.SignatureView = Backbone.View.extend({
  events: {
    'click a.description-link'       : 'switchToDescription',
    'click a.snippet-link'           : 'switchToSnippet',
    'mousedown .snippet'          : 'snippetToTextArea'
  },

  initialize: function () {

  },

  render: function(){

    $(this.el).html(Handlebars.templates.signature(this.model));

    this.switchToSnippet();

    this.isParam = this.model.isParam;

    if (this.isParam) {
      $('.notice', $(this.el)).text('Click to set as parameter value');
    }

    return this;
  },

  // handler for show signature
  switchToDescription: function(e){
    if (e) { e.preventDefault(); }

    $('.snippet', $(this.el)).hide();
    $('.description', $(this.el)).show();
    $('.description-link', $(this.el)).addClass('selected');
    $('.snippet-link', $(this.el)).removeClass('selected');
  },

  // handler for show sample
  switchToSnippet: function(e){
    if (e) { e.preventDefault(); }

    $('.description', $(this.el)).hide();
    $('.snippet', $(this.el)).show();
    $('.snippet-link', $(this.el)).addClass('selected');
    $('.description-link', $(this.el)).removeClass('selected');
  },

  // handler for snippet to text area
  snippetToTextArea: function(e) {
    if (this.isParam) {
      if (e) { e.preventDefault(); }

      var textArea = $('textarea', $(this.el.parentNode.parentNode.parentNode));
      if ($.trim(textArea.val()) === '') {
        textArea.val(this.model.sampleJSON);
      }
    }
  }
});