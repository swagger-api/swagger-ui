'use strict';

/**
 * Translator for documentation pages.
 *
 * To enable translation you should include one of language-files in your index.html
 * after <script src='lang/translator.js' type='text/javascript'></script>.
 * For example - <script src='lang/ru.js' type='text/javascript'></script>
 *
 * If you wish to translate some new texsts you should do two things:
 * 1. Add a new phrase pair ("New Phrase": "New Translation") into your language file (for example lang/ru.js). It will be great if you add it in other language files too.
 * 2. Mark that text it templates this way <anyHtmlTag data-sw-translate>New Phrase</anyHtmlTag> or <anyHtmlTag data-sw-translate value='New Phrase'/>.
 * The main thing here is attribute data-sw-translate. Only inner html, title-attribute and value-attribute are going to translate.
 *
 */
window.SwaggerTranslator = {

    _words:[],
    _availableLanguages: {},
    _currentLanguage: null,
    _languages:{},
    _reverse: null,

    addLanguage: function (language, translation) {
      this._languages[language] = translation;
      this._availableLanguages[language] = true;
    },

    pickLanguage: function (value) {
      if (this._availableLanguages[value]) {
        var language = this._languages[value];
        this._untranslate();
        this.learn(language);
        this.translate();
        _.forEach(language, function (value, key) {
          language[value] = key;
        });
        this._reverse = language;
        this._currentLanguage = value;
      }
    },
    _untranslate: function () {
      if (!this._reverse) {
        this._reverse = this._languages['en'];
      } 
      this.learn(this._reverse);
      this.translate();
    },

    translate: function(sel) {
      var $this = this;
      var language = null;
      sel = sel || '[data-sw-translate]';

      $(sel).each(function() {
        var cache = $(this);
        cache.html($this._tryTranslate(cache.html()));
        cache.val($this._tryTranslate(cache.val()));
        cache.attr('title', $this._tryTranslate(cache.attr('title')));
      });
    },

    _tryTranslate: function(word) {
      var translation = this._words[$.trim(word)];
      return translation !== undefined ? translation : word;
    },

    learn: function(wordsMap) {
      this._words = wordsMap;
    }
};
