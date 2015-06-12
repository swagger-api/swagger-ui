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

    // Allow passing in schema as well
    var model = {
      signature: this.model.signature || this.createSampleMarkup(this.model.schema),
      sampleJSON: this.model.sampleJSON || this.createSample(this.model.schema)
    };

    $(this.el).html(Handlebars.templates.signature(model));

    this.switchToSnippet();

    this.isParam = this.model.isParam;

    if (this.isParam) {
      $('.notice', $(this.el)).text('Click to set as parameter value');
    }

    return this;
  },

  createSample: function(response) {
    var json;

    if(typeof response !== 'object') {
      return;
    }

    // Allow for model objects with #createJSONSample...
    if(typeof response.createJSONSample === 'function') {
      json = response.createJSONSample();
    } else {
      json = SwaggerClient.SchemaMarkup.schemaToJSON(response);
    }

    return JSON.stringify(json, null, 2);
  },

  createSampleMarkup: function (response) {
    var markup = '';
    if(typeof response !== 'object') {
      return;
    }

    // Allow for model objects with #getMockSignature...
    if(typeof response.getMockSignature === 'function') {
      markup += response.getMockSignature();
    } else {
      markup += SwaggerClient.SchemaMarkup.schemaToHTML(response);
    }

    return markup;

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
