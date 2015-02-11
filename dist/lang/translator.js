/**
 * Translator for documentation pages.
 *
 * To enable translation you should include one of language-files in your index.html
 * after <script src='lang/translator.js' type='text/javascript'></script>.
 * For example - <script src='lang/ru.js' type='text/javascript'></script>
 * 
 * Then you should create a SwaggerUI object this way:
 * new SwaggerUi({
 *    ....
 *    onComplete: function(swaggerApi, swaggerUi){
 *        SwaggerTranslator.translate();
 *        ....
 *    }
 * })
 * in your index.html.
 *
 * If you wish to translate some new texsts you should do two things:
 * 1. Add new phrase pair ("New Phrase": "New Translation") into your language file (for example lang/ru.js). It will be great if you add it in other language files too.
 * 2. Mark that text it templates this way <anyHtmlTag data-swTarnslate>New Phrase</anyHtmlTag> or <anyHtmlTag data-swTarnslate value='New Phrase'/>. 
 * The main thing here is attribute data-swTarnslate. Only inner html and value-attribute are going to translate.
 *
 */
SwaggerTranslator = {
    
    _words:[],
    
    translate: function() {
	var $this = this;
	$("[data-swTarnslate]").each(
	    function() {
		$(this).html(
		    $this._tryTranslate($(this).html())
		);
		$(this).val(
		    $this._tryTranslate($(this).val())
		);
	    }
	)
    },
    
    _tryTranslate: function(word) {
	return this._words[word] != undefined ? this._words[word] : word;
    },
    
    learn: function(wordsMap) {
	this._words = wordsMap;
    }
}

