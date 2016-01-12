'use strict';

/* jshint -W122 */
SwaggerUi.partials.signature = (function () {
  var sampleDate = new Date();

  var getSampleDate = function (type) {
    var date;

    switch(type) {
      case 'date-time': date = sampleDate.toISOString(); break;
      case 'date': date = sampleDate.toISOString().split('T')[0]; break;
      default: date = sampleDate.toISOString().split('T')[0];
    }

    return date;
  };

  var resolveSchema = function (schema) {
    if (_.isPlainObject(schema.schema)) {
      schema = resolveSchema(schema.schema);
    }

    return schema;
  };

  var simpleRef = function (name) {
    if (typeof name === 'undefined') {
      return null;
    }

    if (name.indexOf('#/definitions/') === 0) {
      return name.substring('#/definitions/'.length);
    } else {
      return name;
    }
  };

  var getInlineModel = function(inlineStr) {
    if(/^Inline Model \d+$/.test(inlineStr)) {
      var id = parseInt(inlineStr.substr('Inline Model'.length).trim(),10); //
      var model = this.inlineModels[id];
      return model;
    }
    // I'm returning null here, should I rather throw an error?
    return null;
  };

  var formatXml = function(xml) {
    var contexp, fn, formatted, indent, l, lastType, len, lines, ln, pad, reg, transitions, wsexp;
    reg = /(>)(<)(\/*)/g;
    wsexp = /[ ]*(.*)[ ]+\n/g;
    contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    pad = 0;
    formatted = '';
    lines = xml.split('\n');
    indent = 0;
    lastType = 'other';
    transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
    };
    fn = function(ln) {
      var fromTo, j, key, padding, type, types, value;
      types = {
        single: Boolean(ln.match(/<.+\/>/)),
        closing: Boolean(ln.match(/<\/.+>/)),
        opening: Boolean(ln.match(/<[^!?].*>/))
      };
      type = ((function() {
        var results;
        results = [];
        for (key in types) {
          value = types[key];
          if (value) {
            results.push(key);
          }
        }
        return results;
      })())[0];
      type = type === void 0 ? 'other' : type;
      fromTo = lastType + '->' + type;
      lastType = type;
      padding = '';
      indent += transitions[fromTo];
      padding = ((function() {
        var m, ref1, results;
        results = [];
        for (j = m = 0, ref1 = indent; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
          results.push('  ');
        }
        return results;
      })()).join('');
      if (fromTo === 'opening->closing') {
        formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
      } else {
        formatted += padding + ln + '\n';
      }
    };
    for (l = 0, len = lines.length; l < len; l++) {
      ln = lines[l];
      fn(ln);
    }
    return formatted;
  };

  var getModelSignature = function (name, schema, models, modelPropertyMacro) {
    var strongOpen = '<span class="strong">';
    var strongClose = '</span>';

    var optionHtml = function (label, value) {
      return '<tr><td class="optionName">' + label + ':</td><td>' + value + '</td></tr>';
    };


    // Allow for ignoring the 'name' argument.... shifting the rest
    if(_.isObject(arguments[0])) {
      name = void 0;
      schema = arguments[0];
      models = arguments[1];
      modelPropertyMacro = arguments[2];
    }

    models = models || {};

    // Resolve the schema (Handle nested schemas)
    schema = resolveSchema(schema);

    // Return for empty object
    if(_.isEmpty(schema)) {
      return strongOpen + 'Empty' + strongClose;
    }

    // Dereference $ref from 'models'
    if(typeof schema.$ref === 'string') {
      name = simpleRef(schema.$ref);
      schema = models[name];
      if(typeof schema === 'undefined')
      {
        return strongOpen + name + ' is not defined!' + strongClose;
      }
    }

    if(typeof name !== 'string') {
      name = schema.title || 'Inline Model';
    }

    // If we are a Model object... adjust accordingly
    if(schema.definition) {
      schema = schema.definition;
    }

    if(typeof modelPropertyMacro !== 'function') {
      modelPropertyMacro = function(prop){
        return (prop || {}).default;
      };
    }

    var references = {};
    var seenModels = [];
    var inlineModels = 0;

    // Generate current HTML
    var html = processModel(schema, name);

    // Generate references HTML
    while (_.keys(references).length > 0) {
      /* jshint ignore:start */
      _.forEach(references, function (schema, name) {
        var seenModel = _.indexOf(seenModels, name) > -1;

        delete references[name];

        if (!seenModel) {
          seenModels.push(name);

          html += '<br />' + processModel(schema, name);
        }
      });
      /* jshint ignore:end */
    }

    return html;


    function addReference(schema, name, skipRef) {
      var modelName = name;
      var model;

      if (schema.$ref) {
        modelName = schema.title || simpleRef(schema.$ref);
        model = models[modelName];
      } else if (_.isUndefined(name)) {
        modelName = schema.title || 'Inline Model ' + (++inlineModels);
        model = {definition: schema};
      }

      if (skipRef !== true) {
        references[modelName] = _.isUndefined(model) ? {} : model.definition;
      }

      return modelName;
    }

    function primitiveToHTML(schema) {
      var html = '<span class="propType">';
      var type = schema.type || 'object';

      if (schema.$ref) {
        html += addReference(schema, simpleRef(schema.$ref));
      } else if (type === 'object') {
        if (!_.isUndefined(schema.properties)) {
          html += addReference(schema);
        } else {
          html += 'object';
        }
      } else if (type === 'array') {
        html += 'Array[';

        if (_.isArray(schema.items)) {
          html += _.map(schema.items, addReference).join(',');
        } else if (_.isPlainObject(schema.items)) {
          if (_.isUndefined(schema.items.$ref)) {
            if (!_.isUndefined(schema.items.type) && _.indexOf(['array', 'object'], schema.items.type) === -1) {
              html += schema.items.type;
            } else {
              html += addReference(schema.items);
            }
          } else {
            html += addReference(schema.items, simpleRef(schema.items.$ref));
          }
        } else {
          console.log('Array type\'s \'items\' schema is not an array or an object, cannot process');
          html += 'object';
        }

        html += ']';
      } else {
        html += schema.type;
      }

      html += '</span>';

      return html;
    }

    function primitiveToOptionsHTML(schema, html) {
      var options = '';
      var type = schema.type || 'object';
      var isArray = type === 'array';

      if (isArray) {
        if (_.isPlainObject(schema.items) && !_.isUndefined(schema.items.type)) {
          type = schema.items.type;
        } else {
          type = 'object';
        }
      }

      if (!_.isUndefined(schema.default)) {
        options += optionHtml('Default', schema.default);
      }

      switch (type) {
      case 'string':
        if (schema.minLength) {
          options += optionHtml('Min. Length', schema.minLength);
        }

        if (schema.maxLength) {
          options += optionHtml('Max. Length', schema.maxLength);
        }

        if (schema.pattern) {
          options += optionHtml('Reg. Exp.', schema.pattern);
        }
        break;
      case 'integer':
      case 'number':
        if (schema.minimum) {
          options += optionHtml('Min. Value', schema.minimum);
        }

        if (schema.exclusiveMinimum) {
          options += optionHtml('Exclusive Min.', 'true');
        }

        if (schema.maximum) {
          options += optionHtml('Max. Value', schema.maximum);
        }

        if (schema.exclusiveMaximum) {
          options += optionHtml('Exclusive Max.', 'true');
        }

        if (schema.multipleOf) {
          options += optionHtml('Multiple Of', schema.multipleOf);
        }

        break;
      }

      if (isArray) {
        if (schema.minItems) {
          options += optionHtml('Min. Items', schema.minItems);
        }

        if (schema.maxItems) {
          options += optionHtml('Max. Items', schema.maxItems);
        }

        if (schema.uniqueItems) {
          options += optionHtml('Unique Items', 'true');
        }

        if (schema.collectionFormat) {
          options += optionHtml('Coll. Format', schema.collectionFormat);
        }
      }

      if (_.isUndefined(schema.items)) {
        if (_.isArray(schema.enum)) {
          var enumString;

          if (type === 'number' || type === 'integer') {
            enumString = schema.enum.join(', ');
          } else {
            enumString = '"' + schema.enum.join('", "') + '"';
          }

          options += optionHtml('Enum', enumString);
        }
      }

      if (options.length > 0) {
        html = '<span class="propWrap">' + html + '<table class="optionsWrapper"><tr><th colspan="2">' + type + '</th></tr>' + options + '</table></span>';
      }

      return html;
    }

    function processModel(schema, name) {
      var type = schema.type || 'object';
      var isArray = schema.type === 'array';
      var html = strongOpen + name + ' ' + (isArray ? '[' : '{') + strongClose;
      var contents;

      if (name) {
        seenModels.push(name);
      }

      if (isArray) {
        if (_.isArray(schema.items)) {
          html += '<div>' + _.map(schema.items, function (item) {
            var type = item.type || 'object';

            if (_.isUndefined(item.$ref)) {
              if (_.indexOf(['array', 'object'], type) > -1) {
                if (type === 'object' && _.isUndefined(item.properties)) {
                  return 'object';
                } else {
                  return addReference(item);
                }
              } else {
                return primitiveToOptionsHTML(item, type);
              }
            } else {
              return addReference(item, simpleRef(item.$ref));
            }
          }).join(',</div><div>');
        } else if (_.isPlainObject(schema.items)) {
          if (_.isUndefined(schema.items.$ref)) {
            if (_.indexOf(['array', 'object'], schema.items.type || 'object') > -1) {
              if ((_.isUndefined(schema.items.type) || schema.items.type === 'object') && _.isUndefined(schema.items.properties)) {
                html += '<div>object</div>';
              } else {
                html += '<div>' + addReference(schema.items) + '</div>';
              }
            } else {
              html += '<div>' + primitiveToOptionsHTML(schema.items, schema.items.type) + '</div>';
            }
          } else {
            html += '<div>' + addReference(schema.items, simpleRef(schema.items.$ref)) + '</div>';
          }
        } else {
          console.log('Array type\'s \'items\' property is not an array or an object, cannot process');
          html += '<div>object</div>';
        }
      } else {
        if (schema.$ref) {
          html += '<div>' + addReference(schema, name) + '</div>';
        } else if (type === 'object') {
          if (_.isPlainObject(schema.properties)) {
            contents = _.map(schema.properties, function (property, name) {
              var propertyIsRequired = (_.indexOf(schema.required, name) >= 0);
              var cProperty = _.cloneDeep(property);

              var requiredClass = propertyIsRequired ? 'required' : '';
              var html = '<div' + (property.readOnly ? ' class="readOnly"' : '') + '><span class="propName ' + requiredClass + '">' + name + '</span> (';
              var model;
              var propDescription;

              // Allow macro to set the default value
              cProperty.default = modelPropertyMacro(cProperty);

              // Resolve the schema (Handle nested schemas)
              cProperty = resolveSchema(cProperty);

              propDescription = property.description || cProperty.description;

              // We need to handle property references to primitives (Issue 339)
              if (!_.isUndefined(cProperty.$ref)) {
                model = models[simpleRef(cProperty.$ref)];

                if (!_.isUndefined(model) && _.indexOf([undefined, 'array', 'object'], model.definition.type) === -1) {
                  // Use referenced schema
                  cProperty = resolveSchema(model.definition);
                }
              }

              html += primitiveToHTML(cProperty);

              if(!propertyIsRequired) {
                html += ', <span class="propOptKey">optional</span>';
              }

              if(property.readOnly) {
                  html += ', <span class="propReadOnly">read only</span>';
              }

              html += ')';

              if (!_.isUndefined(propDescription)) {
                html += ': ' + '<span class="propDesc">' + propDescription + '</span>';
              }

              if (cProperty.enum) {
                html += ' = <span class="propVals">[\'' + cProperty.enum.join('\', \'') + '\']</span>';
              }

              return primitiveToOptionsHTML(cProperty, html);
            }).join(',</div>');
          }

          if (contents) {
            html += contents + '</div>';
          }
        } else {
          html += '<div>' + primitiveToOptionsHTML(schema, type) + '</div>';
        }
      }

      return html + strongOpen + (isArray ? ']' : '}') + strongClose;
    }

  };

  var schemaToJSON = function (schema, models, modelsToIgnore, modelPropertyMacro) {
    // Resolve the schema (Handle nested schemas)
    schema = resolveSchema(schema);

    if(typeof modelPropertyMacro !== 'function') {
      modelPropertyMacro = function(prop){
        return (prop || {}).default;
      };
    }

    modelsToIgnore= modelsToIgnore || {};

    var type = schema.type || 'object';
    var format = schema.format;
    var model;
    var output;

    if (!_.isUndefined(schema.example)) {
      output = schema.example;
    } else if (_.isUndefined(schema.items) && _.isArray(schema.enum)) {
      output = schema.enum[0];
    }

    if (_.isUndefined(output)) {
      if (schema.$ref) {
        model = models[simpleRef(schema.$ref)];

        if (!_.isUndefined(model)) {
          if (_.isUndefined(modelsToIgnore[model.name])) {
            modelsToIgnore[model.name] = model;
            output = schemaToJSON(model.definition, models, modelsToIgnore, modelPropertyMacro);
            delete modelsToIgnore[model.name];
          } else {
            if (model.type === 'array') {
              output = [];
            } else {
              output = {};
            }
          }
        }
      } else if (!_.isUndefined(schema.default)) {
        output = schema.default;
      } else if (type === 'string') {
        if (format === 'date-time') {
          output = new Date().toISOString();
        } else if (format === 'date') {
          output = new Date().toISOString().split('T')[0];
        } else {
          output = 'string';
        }
      } else if (type === 'integer') {
        output = 0;
      } else if (type === 'number') {
        output = 0.0;
      } else if (type === 'boolean') {
        output = true;
      } else if (type === 'object') {
        output = {};

        _.forEach(schema.properties, function (property, name) {
          var cProperty = _.cloneDeep(property);

          // Allow macro to set the default value
          cProperty.default = modelPropertyMacro(property);

          output[name] = schemaToJSON(cProperty, models, modelsToIgnore, modelPropertyMacro);
        });
      } else if (type === 'array') {
        output = [];

        if (_.isArray(schema.items)) {
          _.forEach(schema.items, function (item) {
            output.push(schemaToJSON(item, models, modelsToIgnore, modelPropertyMacro));
          });
        } else if (_.isPlainObject(schema.items)) {
          output.push(schemaToJSON(schema.items, models, modelsToIgnore, modelPropertyMacro));
        } else if (_.isUndefined(schema.items)) {
          output.push({});
        } else {
          console.log('Array type\'s \'items\' property is not an array or an object, cannot process');
        }
      }
    }

    return output;
  };

  var createJSONSample = function (value, modelsToIgnore) {
    modelsToIgnore = modelsToIgnore || {};

    modelsToIgnore[value.name] = value;

    // Response support
    if (value.examples && _.isPlainObject(value.examples) && value.examples['application/json']) {
      value.definition.example = value.examples['application/json'];

      if (_.isString(value.definition.example)) {
        value.definition.example = jsyaml.safeLoad(value.definition.example);
      }
    } else if (!value.definition.example) {
      value.definition.example = value.examples;
    }

    return schemaToJSON(value.definition, value.models, modelsToIgnore, value.modelPropertyMacro);
  };

  var getParameterModelSignature = function (type, definitions) {
      var isPrimitive, listType;

      if (type instanceof Array) {
        listType = true;
        type = type[0];
      }

      // Convert undefined to string of 'undefined'
      if (typeof type === 'undefined') {
        type = 'undefined';
        isPrimitive = true;

      } else if (definitions[type]){
        // a model def exists?
        type = definitions[type]; /* Model */
        isPrimitive = false;

      } else if (getInlineModel(type)) {
        type = getInlineModel(type); /* Model */
        isPrimitive = false;

      } else {
        // We default to primitive
        isPrimitive = true;
      }

      if (isPrimitive) {
        if (listType) {
          return 'Array[' + type + ']';
        } else {
          return type.toString();
        }
      } else {
        if (listType) {
          return 'Array[' + getModelSignature(type.name, type.definition, type.models, type.modelPropertyMacro) + ']';
        } else {
          return getModelSignature(type.name, type.definition, type.models, type.modelPropertyMacro);
        }
      }
  };

  var createParameterJSONSample = function (type, models) {
    var listType, sampleJson, innerType;
    models = models || {};

    listType = (type instanceof Array);
    innerType = listType ? type[0] : type;

    if(models[innerType]) {
      sampleJson = createJSONSample(models[innerType]);
    } else if (getInlineModel(innerType)){
      sampleJson = createJSONSample(getInlineModel(innerType)); // may return null, if type isn't correct
    }


    if (sampleJson) {
      sampleJson = listType ? [sampleJson] : sampleJson;

      if (typeof sampleJson === 'string') {
        return sampleJson;
      } else if (_.isObject(sampleJson)) {
        var t = sampleJson;

        if (sampleJson instanceof Array && sampleJson.length > 0) {
          t = sampleJson[0];
        }

        if (t.nodeName && typeof t === 'Node') {
          var xmlString = new XMLSerializer().serializeToString(t);

          return formatXml(xmlString);
        } else {
          return JSON.stringify(sampleJson, null, 2);
        }
      } else {
        return sampleJson;
      }
    }
  };

  var wrapTag = function (name, value) {
    var str = [
      '<', name, '>',
        value,
      '</', name, '>'
    ];

    return str.join('');
  };

  var createXMLSample = function (name, definition) {
    var primitivesMap = {
      'string': {
        'date': getSampleDate('date'),
        'date-time' : getSampleDate('date-time'),
        'default': 'string'
      },
      'integer': 1,
      'number': 1.1,
      'boolean': true
    };
    var type = definition.type;
    var format = definition.format;
    var xml = definition.xml || {};
    var value;

    if (xml.name) {
      name = xml.name;
    }

    if (xml.prefix) {
      name = xml.prefix + ':' + name;
    }

    if (_.keys(primitivesMap).indexOf(type) !== -1) {
      if (type === 'string') {
        value = format ? primitivesMap.string[format] : primitivesMap.string.default;
      } else {
        value = primitivesMap[type];
      }

      return wrapTag(name, value);
    }

    return '';
  };

  return {
      getModelSignature: getModelSignature,
      createJSONSample: createJSONSample,
      getParameterModelSignature: getParameterModelSignature,
      createParameterJSONSample: createParameterJSONSample,
      createXMLSample: createXMLSample,
      getSampleDate: getSampleDate
  };

})();
