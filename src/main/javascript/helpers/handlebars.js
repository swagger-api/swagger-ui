'use strict';
/*jslint eqeq: true*/

Handlebars.registerHelper('sanitize', function (text) {
    var result;

    if (text === undefined) { return ''; }

    result = sanitizeHtml(text, {
        allowedTags: [ 'div', 'span', 'b', 'i', 'em', 'strong', 'a', 'br', 'table', 'tbody', 'tr', 'th', 'td' ],
        allowedAttributes: {
            'div': [ 'class' ],
            'span': [ 'class' ],
            'table': [ 'class' ],
            'td': [ 'class' ],
            'th': [ 'colspan' ],
            'a': [ 'href' ]
        }
    });

    return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('renderTextParam', function(param) {
    var result, type = 'text', idAtt = '';
    var paramType = param.type || param.schema && param.schema.type || '';
    var isArray = paramType.toLowerCase() === 'array' || param.allowMultiple;
    var defaultValue = isArray && Array.isArray(param.default) ? param.default.join('\n') : param.default;
    var name = Handlebars.Utils.escapeExpression(param.name);
    var valueId = Handlebars.Utils.escapeExpression(param.valueId);
    paramType = Handlebars.Utils.escapeExpression(paramType);

    var dataVendorExtensions = Object.keys(param).filter(function(property) {
        // filter X-data- properties
        return property.match(/^X-data-/i) !== null;
    }).reduce(function(result, property) {
        // remove X- from property name, so it results in html attributes like data-foo='bar'
        return result += ' ' + property.substring(2, property.length) + '=\'' + param[property] + '\'';
    }, '');

    if(param.format && param.format === 'password') {
        type = 'password';
    }

    if(valueId) {
        idAtt = ' id=\'' + valueId + '\'';
    }

    if (defaultValue) {
      defaultValue = sanitizeHtml(defaultValue);
    } else {
      defaultValue = '';
    }

    if(isArray) {
        result = '<textarea class=\'body-textarea' + (param.required ? ' required' : '') + '\' name=\'' + name + '\'' + idAtt + dataVendorExtensions;
        result += ' placeholder=\'Provide multiple values in new lines' + (param.required ? ' (at least one required).' : '.') + '\'>';
        result += defaultValue + '</textarea>';
    } else {
        var parameterClass = 'parameter';
        if(param.required) {
          parameterClass += ' required';
        }
        result = '<input class=\'' + parameterClass + '\' minlength=\'' + (param.required ? 1 : 0) + '\'';
        result += ' name=\'' + name +'\' placeholder=\'' + (param.required ? '(required)' : '') + '\'' + idAtt + dataVendorExtensions;
        result += ' type=\'' + type + '\' value=\'' + defaultValue + '\'/>';
    }
    return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper('escape', function (value) {
    var text = Handlebars.Utils.escapeExpression(value);

    return new Handlebars.SafeString(text);
});
