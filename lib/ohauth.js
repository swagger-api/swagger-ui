(function(e){if("function"==typeof bootstrap)bootstrap("ohauth",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeOhauth=e}else"undefined"!=typeof window?window.ohauth=e():global.ohauth=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
'use strict';

var hashes = require('jshashes'),
    sha1 = new hashes.SHA1();

var ohauth = {};

ohauth.qsString = function(obj) {
    return Object.keys(obj).sort().map(function(key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(obj[key]);
    }).join('&');
};

ohauth.stringQs = function(str) {
    return str.split('&').reduce(function(obj, pair){
        var parts = pair.split('=');
        obj[parts[0]] = (null === parts[1]) ?
            '' : decodeURIComponent(parts[1]);
        return obj;
    }, {});
};

ohauth.rawxhr = function(method, url, data, headers, callback) {
    var xhr = new XMLHttpRequest(),
        twoHundred = /^20\d$/;
    xhr.onreadystatechange = function() {
        if (4 == xhr.readyState && 0 !== xhr.status) {
            if (twoHundred.test(xhr.status)) callback(null, xhr);
            else return callback(xhr, null);
        }
    };
    xhr.onerror = function(e) { return callback(e, null); };
    xhr.open(method, url, true);
    for (var h in headers) xhr.setRequestHeader(h, headers[h]);
    xhr.send(data);
};

ohauth.xhr = function(method, url, auth, data, options, callback) {
    var headers = (options && options.header) || {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    headers.Authorization = 'OAuth ' + ohauth.authHeader(auth);
    ohauth.rawxhr(method, url, data, headers, callback);
};

ohauth.nonce = function() {
    for (var o = ''; o.length < 6;) {
        o += '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'[Math.floor(Math.random() * 61)];
    }
    return o;
};

ohauth.authHeader = function(obj) {
    return Object.keys(obj).sort().map(function(key) {
        return encodeURIComponent(key) + '="' + encodeURIComponent(obj[key]) + '"';
    }).join(', ');
};

ohauth.timestamp = function() { return ~~((+new Date()) / 1000); };

ohauth.percentEncode = function(s) {
    return encodeURIComponent(s)
        .replace(/\!/g, '%21').replace(/\'/g, '%27')
        .replace(/\*/g, '%2A').replace(/\(/g, '%28').replace(/\)/g, '%29');
};

ohauth.baseString = function(method, url, params) {
    if (params.oauth_signature) delete params.oauth_signature;
    return [
        method.toUpperCase(),
        ohauth.percentEncode(url),
        ohauth.percentEncode(ohauth.qsString(params))].join('&');
};

ohauth.signature = function(oauth_secret, token_secret, baseString) {
    return sha1.b64_hmac(
        ohauth.percentEncode(oauth_secret) + '&' +
        ohauth.percentEncode(token_secret),
        baseString);
};

// Little helper function for copying properties
var put = function (obj) {
    var param, input, i;
    for (i = 1; i < arguments.length; ++i) {
        input = arguments[i] || {};
        for (param in input) {
            obj[param] = input[param];
        }
    }
    return obj;
};

/**
 * Takes an options object for configuration (consumer_key,
 * consumer_secret, version, signature_method, token) and returns a
 * function that generates the Authorization header for given data.
 *
 * The returned function takes these parameters:
 * - method: GET/POST/...
 * - uri: full URI with protocol, port, path and query string
 * - extra_params: any extra parameters (that are passed in the POST data),
 *   can be an object or a from-urlencoded string.
 *
 * Returned function returns full OAuth header with "OAuth" string in it.
 */

ohauth.headerGenerator = function (options) {
    var consumer_key     = options.consumer_key     || '';
    var consumer_secret  = options.consumer_secret  || '';
    var signature_method = options.signature_method || 'HMAC-SHA1';
    var version          = options.version          || '1.0';
    var token            = options.token            || '';

    return function (method, uri, extra_params) {
        method = method.toUpperCase();
        if (typeof extra_params === 'string' && extra_params.length > 0) {
            extra_params = ohauth.stringQs(extra_params);
        }

        var uri_parts = uri.split('?', 2);
        var base_uri = uri_parts[0];

        var query_params = uri_parts.length === 2 ? ohauth.stringQs(uri_parts[1]) : {};

        var oauth_params = {
            oauth_consumer_key: consumer_key,
            oauth_signature_method: signature_method,
            oauth_version: version,
            oauth_timestamp: ohauth.timestamp(),
            oauth_nonce: ohauth.nonce()
        };

        if (token) oauth_params.oauth_token = token;

        var all_params = put({}, oauth_params, query_params, extra_params);

        var base_str = ohauth.baseString(method, base_uri, all_params);
        oauth_params.oauth_signature = ohauth.signature(consumer_secret, token, base_str);

        var header = 'OAuth ' + ohauth.authHeader(oauth_params);
        return header;
    };
};

module.exports = ohauth;

},{"jshashes":2}],2:[function(require,module,exports){
(function(global){/**
 * jsHashes - A fast and independent hashing library pure JavaScript implemented (ES5 compliant) for both server and client side
 * 
 * @class Hashes
 * @author Tomas Aparicio <tomas@rijndael-project.com>
 * @license New BSD (see LICENSE file)
 * @version 1.0.3
 *
 * Algorithms specification:
 *
 * MD5 <http://www.ietf.org/rfc/rfc1321.txt>
 * RIPEMD-160 <http://homes.esat.kuleuven.be/~bosselae/ripemd160.html>
 * SHA1   <http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf>
 * SHA256 <http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf>
 * SHA512 <http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf>
 * HMAC <http://www.ietf.org/rfc/rfc2104.txt>
 *
 */
(function(){
  var Hashes;
  
  // private helper methods
  function utf8Encode(input) {
    var  x, y, output = '', i = -1, l = input.length;
    while ((i+=1) < l) {
      /* Decode utf-16 surrogate pairs */
      x = input.charCodeAt(i);
      y = i + 1 < l ? input.charCodeAt(i + 1) : 0;
      if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
          x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
          i += 1;
      }
      /* Encode output as utf-8 */
      if (x <= 0x7F) {
          output += String.fromCharCode(x);
      } else if (x <= 0x7FF) {
          output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                      0x80 | ( x & 0x3F));
      } else if (x <= 0xFFFF) {
          output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                      0x80 | ((x >>> 6 ) & 0x3F),
                      0x80 | ( x & 0x3F));
      } else if (x <= 0x1FFFFF) {
          output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                      0x80 | ((x >>> 12) & 0x3F),
                      0x80 | ((x >>> 6 ) & 0x3F),
                      0x80 | ( x & 0x3F));
      }
    }
    return output;
  }
  
  function utf8Decode(str_data) {
    var i, ac, c1, c2, c3, arr = [], l = str_data.length;
    i = ac = c1 = c2 = c3 = 0;
    str_data += '';

    while (i < l) {
        c1 = str_data.charCodeAt(i);
        ac += 1;
        if (c1 < 128) {
            arr[ac] = String.fromCharCode(c1);
            i+=1;
        } else if (c1 > 191 && c1 < 224) {
            c2 = str_data.charCodeAt(i + 1);
            arr[ac] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            arr[ac] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return arr.join('');
  }

  /**
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /**
   * Bitwise rotate a 32-bit number to the left.
   */
  function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /**
   * Convert a raw string to a hex string
   */
  function rstr2hex(input, hexcase) {
    var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef',
        output = '', x, i = 0, l = input.length;
    for (; i < l; i+=1) {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
  }

  /**
   * Encode a string as utf-16
   */
  function str2rstr_utf16le(input) {
    var i, l = input.length, output = '';
    for (i = 0; i < l; i+=1) {
      output += String.fromCharCode( input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
    }
    return output;
  }

  function str2rstr_utf16be(input) {
    var i, l = input.length, output = '';
    for (i = 0; i < l; i+=1) {
      output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
    }
    return output;
  }

  /**
   * Convert an array of big-endian words to a string
   */
  function binb2rstr(input) {
    var i, l = input.length * 32, output = '';
    for (i = 0; i < l; i += 8) {
        output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
    }
    return output;
  }

  /**
   * Convert an array of little-endian words to a string
   */
  function binl2rstr(input) {
    var i, l = input.length * 32, output = '';
    for (i = 0;i < l; i += 8) {
      output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
    }
    return output;
  }

  /**
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */
  function rstr2binl(input) {
    var i, l = input.length * 8, output = Array(input.length >> 2), lo = output.length;
    for (i = 0; i < lo; i+=1) {
      output[i] = 0;
    }
    for (i = 0; i < l; i += 8) {
      output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
    }
    return output;
  }
  
  /**
   * Convert a raw string to an array of big-endian words 
   * Characters >255 have their high-byte silently ignored.
   */
   function rstr2binb(input) {
      var i, l = input.length * 8, output = Array(input.length >> 2), lo = output.length;
      for (i = 0; i < lo; i+=1) {
            output[i] = 0;
        }
      for (i = 0; i < l; i += 8) {
            output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
        }
      return output;
   }

  /**
   * Convert a raw string to an arbitrary string encoding
   */
  function rstr2any(input, encoding) {
    var divisor = encoding.length,
        remainders = Array(),
        i, q, x, ld, quotient, dividend, output, full_length;
  
    /* Convert to an array of 16-bit big-endian values, forming the dividend */
    dividend = Array(Math.ceil(input.length / 2));
    ld = dividend.length;
    for (i = 0; i < ld; i+=1) {
      dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
    }
  
    /**
     * Repeatedly perform a long division. The binary array forms the dividend,
     * the length of the encoding is the divisor. Once computed, the quotient
     * forms the dividend for the next step. We stop when the dividend is zerHashes.
     * All remainders are stored for later use.
     */
    while(dividend.length > 0) {
      quotient = Array();
      x = 0;
      for (i = 0; i < dividend.length; i+=1) {
        x = (x << 16) + dividend[i];
        q = Math.floor(x / divisor);
        x -= q * divisor;
        if (quotient.length > 0 || q > 0) {
          quotient[quotient.length] = q;
        }
      }
      remainders[remainders.length] = x;
      dividend = quotient;
    }
  
    /* Convert the remainders to the output string */
    output = '';
    for (i = remainders.length - 1; i >= 0; i--) {
      output += encoding.charAt(remainders[i]);
    }
  
    /* Append leading zero equivalents */
    full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    for (i = output.length; i < full_length; i+=1) {
      output = encoding[0] + output;
    }
    return output;
  }

  /**
   * Convert a raw string to a base-64 string
   */
  function rstr2b64(input, b64pad) {
    var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        output = '',
        len = input.length, i, j, triplet;
    b64pad= b64pad || '=';
    for (i = 0; i < len; i += 3) {
      triplet = (input.charCodeAt(i) << 16)
            | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
            | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
      for (j = 0; j < 4; j+=1) {
        if (i * 8 + j * 6 > input.length * 8) { 
          output += b64pad; 
        } else { 
          output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F); 
        }
       }
    }
    return output;
  }

  Hashes = {
  /**  
   * @property {String} version
   * @readonly
   */
  VERSION : '1.0.3',
  /**
   * @member Hashes
   * @class Base64
   * @constructor
   */
  Base64 : function () {
    // private properties
    var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        pad = '=', // default pad according with the RFC standard
        url = false, // URL encoding support @todo
        utf8 = true; // by default enable UTF-8 support encoding

    // public method for encoding
    this.encode = function (input) {
      var i, j, triplet,
          output = '', 
          len = input.length;

      pad = pad || '=';
      input = (utf8) ? utf8Encode(input) : input;

      for (i = 0; i < len; i += 3) {
        triplet = (input.charCodeAt(i) << 16)
              | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
              | (i + 2 < len ? input.charCodeAt(i+2) : 0);
        for (j = 0; j < 4; j+=1) {
          if (i * 8 + j * 6 > len * 8) {
              output += pad;
          } else {
              output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
          }
        }
      }
      return output;    
    };

    // public method for decoding
    this.decode = function (input) {
      // var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      var i, o1, o2, o3, h1, h2, h3, h4, bits, ac,
        dec = '',
        arr = [];
      if (!input) { return input; }

      i = ac = 0;
      input = input.replace(new RegExp('\\'+pad,'gi'),''); // use '='
      //input += '';

      do { // unpack four hexets into three octets using index points in b64
        h1 = tab.indexOf(input.charAt(i+=1));
        h2 = tab.indexOf(input.charAt(i+=1));
        h3 = tab.indexOf(input.charAt(i+=1));
        h4 = tab.indexOf(input.charAt(i+=1));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
        ac += 1;

        if (h3 === 64) {
          arr[ac] = String.fromCharCode(o1);
        } else if (h4 === 64) {
          arr[ac] = String.fromCharCode(o1, o2);
        } else {
          arr[ac] = String.fromCharCode(o1, o2, o3);
        }
      } while (i < input.length);

      dec = arr.join('');
      dec = (utf8) ? utf8Decode(dec) : dec;

      return dec;
    };

    // set custom pad string
    this.setPad = function (str) {
        pad = str || pad;
        return this;
    };
    // set custom tab string characters
    this.setTab = function (str) {
        tab = str || tab;
        return this;
    };
    this.setUTF8 = function (bool) {
        if (typeof bool === 'boolean') {
          utf8 = bool;
        }
        return this;
    };
  },

  /**
   * CRC-32 calculation
   * @member Hashes
   * @method CRC32
   * @static
   * @param {String} str Input String
   * @return {String}
   */
  CRC32 : function (str) {
    var crc = 0, x = 0, y = 0, table, i, iTop;
    str = utf8Encode(str);
        
    table = [ 
        '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 ',
        '79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 ',
        '84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F ',
        '63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD ',
        'A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC ',
        '51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 ',
        'B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 ',
        '06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 ',
        'E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 ',
        '12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 ',
        'D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 ',
        '33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 ',
        'CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 ',
        '9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E ',
        '7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D ',
        '806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 ',
        '60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA ',
        'AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 ', 
        '5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 ',
        'B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 ',
        '05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 ',
        'F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA ',
        '11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 ',
        'D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F ',
        '30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E ',
        'C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D'
    ].join('');

    crc = crc ^ (-1);
    for (i = 0, iTop = str.length; i < iTop; i+=1 ) {
        y = ( crc ^ str.charCodeAt( i ) ) & 0xFF;
        x = '0x' + table.substr( y * 9, 8 );
        crc = ( crc >>> 8 ) ^ x;
    }
    // always return a positive number (that's what >>> 0 does)
    return (crc ^ (-1)) >>> 0;
  },
  /**
   * @member Hashes
   * @class MD5
   * @constructor
   * @param {Object} [config]
   * 
   * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
   * Digest Algorithm, as defined in RFC 1321.
   * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * See <http://pajhome.org.uk/crypt/md5> for more infHashes.
   */
  MD5 : function (options) {  
    /**
     * Private config properties. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     * See {@link Hashes.MD5#method-setUpperCase} and {@link Hashes.SHA1#method-setUpperCase}
     */
    var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false, // hexadecimal output case format. false - lowercase; true - uppercase
        b64pad = (options && typeof options.pad === 'string') ? options.pda : '=', // base-64 pad character. Defaults to '=' for strict RFC compliance
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true; // enable/disable utf8 encoding

    // privileged (public) methods 
    this.hex = function (s) { 
      return rstr2hex(rstr(s, utf8), hexcase);
    };
    this.b64 = function (s) { 
      return rstr2b64(rstr(s), b64pad);
    };
    this.any = function(s, e) { 
      return rstr2any(rstr(s, utf8), e); 
    };
    this.hex_hmac = function (k, d) { 
      return rstr2hex(rstr_hmac(k, d), hexcase); 
    };
    this.b64_hmac = function (k, d) { 
      return rstr2b64(rstr_hmac(k,d), b64pad); 
    };
    this.any_hmac = function (k, d, e) { 
      return rstr2any(rstr_hmac(k, d), e); 
    };
    /**
     * Perform a simple self-test to see if the VM is working
     * @return {String} Hexadecimal hash sample
     */
    this.vm_test = function () {
      return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
    };
    /** 
     * Enable/disable uppercase hexadecimal returned string 
     * @param {Boolean} 
     * @return {Object} this
     */ 
    this.setUpperCase = function (a) {
      if (typeof a === 'boolean' ) {
        hexcase = a;
      }
      return this;
    };
    /** 
     * Defines a base64 pad string 
     * @param {String} Pad
     * @return {Object} this
     */ 
    this.setPad = function (a) {
      b64pad = a || b64pad;
      return this;
    };
    /** 
     * Defines a base64 pad string 
     * @param {Boolean} 
     * @return {Object} [this]
     */ 
    this.setUTF8 = function (a) {
      if (typeof a === 'boolean') { 
        utf8 = a;
      }
      return this;
    };

    // private methods

    /**
     * Calculate the MD5 of a raw string
     */
    function rstr(s) {
      s = (utf8) ? utf8Encode(s): s;
      return binl2rstr(binl(rstr2binl(s), s.length * 8));
    }
    
    /**
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstr_hmac(key, data) {
      var bkey, ipad, opad, hash, i;

      key = (utf8) ? utf8Encode(key) : key;
      data = (utf8) ? utf8Encode(data) : data;
      bkey = rstr2binl(key);
      if (bkey.length > 16) { 
        bkey = binl(bkey, key.length * 8); 
      }

      ipad = Array(16), opad = Array(16); 
      for (i = 0; i < 16; i+=1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }
      hash = binl(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
      return binl2rstr(binl(opad.concat(hash), 512 + 128));
    }

    /**
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binl(x, len) {
      var i, olda, oldb, oldc, oldd,
          a =  1732584193,
          b = -271733879,
          c = -1732584194,
          d =  271733878;
        
      /* append padding */
      x[len >> 5] |= 0x80 << ((len) % 32);
      x[(((len + 64) >>> 9) << 4) + 14] = len;

      for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;

        a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
        b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
        c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
        d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
        d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

        a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
        b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
        c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
        d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
        a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
        b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

        a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
        b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
        c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
        d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
        a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
        b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

        a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
        c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
        d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
        d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
        a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
        b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
      }
      return Array(a, b, c, d);
    }

    /**
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
      return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
      return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
      return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
      return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
      return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
  },
  /**
   * @member Hashes
   * @class Hashes.SHA1
   * @param {Object} [config]
   * @constructor
   * 
   * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined in FIPS 180-1
   * Version 2.2 Copyright Paul Johnston 2000 - 2009.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * See http://pajhome.org.uk/crypt/md5 for details.
   */
  SHA1 : function (options) {
   /**
     * Private config properties. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     * See {@link Hashes.MD5#method-setUpperCase} and {@link Hashes.SHA1#method-setUpperCase}
     */
    var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false, // hexadecimal output case format. false - lowercase; true - uppercase
        b64pad = (options && typeof options.pad === 'string') ? options.pda : '=', // base-64 pad character. Defaults to '=' for strict RFC compliance
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true; // enable/disable utf8 encoding

    // public methods
    this.hex = function (s) { 
    	return rstr2hex(rstr(s, utf8), hexcase); 
    };
    this.b64 = function (s) { 
    	return rstr2b64(rstr(s, utf8), b64pad);
    };
    this.any = function (s, e) { 
    	return rstr2any(rstr(s, utf8), e);
    };
    this.hex_hmac = function (k, d) {
    	return rstr2hex(rstr_hmac(k, d));
    };
    this.b64_hmac = function (k, d) { 
    	return rstr2b64(rstr_hmac(k, d), b64pad); 
    };
    this.any_hmac = function (k, d, e) { 
    	return rstr2any(rstr_hmac(k, d), e);
    };
    /**
     * Perform a simple self-test to see if the VM is working
     * @return {String} Hexadecimal hash sample
     * @public
     */
    this.vm_test = function () {
      return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
    };
    /** 
     * @description Enable/disable uppercase hexadecimal returned string 
     * @param {boolean} 
     * @return {Object} this
     * @public
     */ 
    this.setUpperCase = function (a) {
    	if (typeof a === 'boolean') {
        hexcase = a;
      }
    	return this;
    };
    /** 
     * @description Defines a base64 pad string 
     * @param {string} Pad
     * @return {Object} this
     * @public
     */ 
    this.setPad = function (a) {
      b64pad = a || b64pad;
    	return this;
    };
    /** 
     * @description Defines a base64 pad string 
     * @param {boolean} 
     * @return {Object} this
     * @public
     */ 
    this.setUTF8 = function (a) {
    	if (typeof a === 'boolean') {
        utf8 = a;
      }
    	return this;
    };

    // private methods

    /**
  	 * Calculate the SHA-512 of a raw string
  	 */
  	function rstr(s) {
      s = (utf8) ? utf8Encode(s) : s;
      return binb2rstr(binb(rstr2binb(s), s.length * 8));
  	}

    /**
     * Calculate the HMAC-SHA1 of a key and some data (raw strings)
     */
    function rstr_hmac(key, data) {
    	var bkey, ipad, opad, i, hash;
    	key = (utf8) ? utf8Encode(key) : key;
    	data = (utf8) ? utf8Encode(data) : data;
    	bkey = rstr2binb(key);

    	if (bkey.length > 16) {
        bkey = binb(bkey, key.length * 8);
      }
    	ipad = Array(16), opad = Array(16);
    	for (i = 0; i < 16; i+=1) {
    		ipad[i] = bkey[i] ^ 0x36363636;
    		opad[i] = bkey[i] ^ 0x5C5C5C5C;
    	}
    	hash = binb(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
    	return binb2rstr(binb(opad.concat(hash), 512 + 160));
    }

    /**
     * Calculate the SHA-1 of an array of big-endian words, and a bit length
     */
    function binb(x, len) {
      var i, j, t, olda, oldb, oldc, oldd, olde,
          w = Array(80),
          a =  1732584193,
          b = -271733879,
          c = -1732584194,
          d =  271733878,
          e = -1009589776;

      /* append padding */
      x[len >> 5] |= 0x80 << (24 - len % 32);
      x[((len + 64 >> 9) << 4) + 15] = len;

      for (i = 0; i < x.length; i += 16) {
        olda = a,
        oldb = b;
        oldc = c;
        oldd = d;
        olde = e;
      
      	for (j = 0; j < 80; j+=1)	{
      	  if (j < 16) { 
            w[j] = x[i + j]; 
          } else { 
            w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1); 
          }
      	  t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
      					   safe_add(safe_add(e, w[j]), sha1_kt(j)));
      	  e = d;
      	  d = c;
      	  c = bit_rol(b, 30);
      	  b = a;
      	  a = t;
      	}

      	a = safe_add(a, olda);
      	b = safe_add(b, oldb);
      	c = safe_add(c, oldc);
      	d = safe_add(d, oldd);
      	e = safe_add(e, olde);
      }
      return Array(a, b, c, d, e);
    }

    /**
     * Perform the appropriate triplet combination function for the current
     * iteration
     */
    function sha1_ft(t, b, c, d) {
      if (t < 20) { return (b & c) | ((~b) & d); }
      if (t < 40) { return b ^ c ^ d; }
      if (t < 60) { return (b & c) | (b & d) | (c & d); }
      return b ^ c ^ d;
    }

    /**
     * Determine the appropriate additive constant for the current iteration
     */
    function sha1_kt(t) {
      return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
    		 (t < 60) ? -1894007588 : -899497514;
    }
  },
  /**
   * @class Hashes.SHA256
   * @param {config}
   * 
   * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined in FIPS 180-2
   * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * See http://pajhome.org.uk/crypt/md5 for details.
   * Also http://anmar.eu.org/projects/jssha2/
   */
  SHA256 : function (options) {
    /**
     * Private properties configuration variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     * @see this.setUpperCase() method
     * @see this.setPad() method
     */
    var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false, // hexadecimal output case format. false - lowercase; true - uppercase  */
              b64pad = (options && typeof options.pad === 'string') ? options.pda : '=', /* base-64 pad character. Default '=' for strict RFC compliance   */
              utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true, /* enable/disable utf8 encoding */
              sha256_K;

    /* privileged (public) methods */
    this.hex = function (s) { 
      return rstr2hex(rstr(s, utf8)); 
    };
    this.b64 = function (s) { 
      return rstr2b64(rstr(s, utf8), b64pad);
    };
    this.any = function (s, e) { 
      return rstr2any(rstr(s, utf8), e); 
    };
    this.hex_hmac = function (k, d) { 
      return rstr2hex(rstr_hmac(k, d)); 
    };
    this.b64_hmac = function (k, d) { 
      return rstr2b64(rstr_hmac(k, d), b64pad);
    };
    this.any_hmac = function (k, d, e) { 
      return rstr2any(rstr_hmac(k, d), e); 
    };
    /**
     * Perform a simple self-test to see if the VM is working
     * @return {String} Hexadecimal hash sample
     * @public
     */
    this.vm_test = function () {
      return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
    };
    /** 
     * Enable/disable uppercase hexadecimal returned string 
     * @param {boolean} 
     * @return {Object} this
     * @public
     */ 
    this.setUpperCase = function (a) {
      if (typeof a === 'boolean') { 
        hexcase = a;
      }
      return this;
    };
    /** 
     * @description Defines a base64 pad string 
     * @param {string} Pad
     * @return {Object} this
     * @public
     */ 
    this.setPad = function (a) {
      b64pad = a || b64pad;
      return this;
    };
    /** 
     * Defines a base64 pad string 
     * @param {boolean} 
     * @return {Object} this
     * @public
     */ 
    this.setUTF8 = function (a) {
      if (typeof a === 'boolean') {
        utf8 = a;
      }
      return this;
    };
    
    // private methods

    /**
     * Calculate the SHA-512 of a raw string
     */
    function rstr(s, utf8) {
      s = (utf8) ? utf8Encode(s) : s;
      return binb2rstr(binb(rstr2binb(s), s.length * 8));
    }

    /**
     * Calculate the HMAC-sha256 of a key and some data (raw strings)
     */
    function rstr_hmac(key, data) {
      key = (utf8) ? utf8Encode(key) : key;
      data = (utf8) ? utf8Encode(data) : data;
      var hash, i = 0,
          bkey = rstr2binb(key), 
          ipad = Array(16), 
          opad = Array(16);

      if (bkey.length > 16) { bkey = binb(bkey, key.length * 8); }
      
      for (; i < 16; i+=1) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }
      
      hash = binb(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
      return binb2rstr(binb(opad.concat(hash), 512 + 256));
    }
    
    /*
     * Main sha256 function, with its support functions
     */
    function sha256_S (X, n) {return ( X >>> n ) | (X << (32 - n));}
    function sha256_R (X, n) {return ( X >>> n );}
    function sha256_Ch(x, y, z) {return ((x & y) ^ ((~x) & z));}
    function sha256_Maj(x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));}
    function sha256_Sigma0256(x) {return (sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22));}
    function sha256_Sigma1256(x) {return (sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25));}
    function sha256_Gamma0256(x) {return (sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3));}
    function sha256_Gamma1256(x) {return (sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10));}
    function sha256_Sigma0512(x) {return (sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39));}
    function sha256_Sigma1512(x) {return (sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41));}
    function sha256_Gamma0512(x) {return (sha256_S(x, 1)  ^ sha256_S(x, 8) ^ sha256_R(x, 7));}
    function sha256_Gamma1512(x) {return (sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6));}
    
    sha256_K = [
      1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
      -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
      1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
      264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
      -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
      113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
      1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885,
      -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
      430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
      1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
      -1866530822, -1538233109, -1090935817, -965641998
    ];
    
    function binb(m, l) {
      var HASH = [1779033703, -1150833019, 1013904242, -1521486534,
                 1359893119, -1694144372, 528734635, 1541459225];
      var W = new Array(64);
      var a, b, c, d, e, f, g, h;
      var i, j, T1, T2;
    
      /* append padding */
      m[l >> 5] |= 0x80 << (24 - l % 32);
      m[((l + 64 >> 9) << 4) + 15] = l;
    
      for (i = 0; i < m.length; i += 16)
      {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];
    
      for (j = 0; j < 64; j+=1)
      {
        if (j < 16) { 
          W[j] = m[j + i];
        } else { 
          W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]),
                          sha256_Gamma0256(W[j - 15])), W[j - 16]);
        }
    
        T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
                                  sha256_K[j]), W[j]);
        T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }
    
      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
      }
      return HASH;
    }

  },

  /**
   * @class Hashes.SHA512
   * @param {config}
   * 
   * A JavaScript implementation of the Secure Hash Algorithm, SHA-512, as defined in FIPS 180-2
   * Version 2.2 Copyright Anonymous Contributor, Paul Johnston 2000 - 2009.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * See http://pajhome.org.uk/crypt/md5 for details. 
   */
  SHA512 : function (options) {
    /**
     * Private properties configuration variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     * @see this.setUpperCase() method
     * @see this.setPad() method
     */
    var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false , /* hexadecimal output case format. false - lowercase; true - uppercase  */
        b64pad = (options && typeof options.pad === 'string') ? options.pda : '=',  /* base-64 pad character. Default '=' for strict RFC compliance   */
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true, /* enable/disable utf8 encoding */
        sha512_k;

    /* privileged (public) methods */
    this.hex = function (s) { 
      return rstr2hex(rstr(s)); 
    };
    this.b64 = function (s) { 
      return rstr2b64(rstr(s), b64pad);  
    };
    this.any = function (s, e) { 
      return rstr2any(rstr(s), e);
    };
    this.hex_hmac = function (k, d) {
      return rstr2hex(rstr_hmac(k, d));
    };
    this.b64_hmac = function (k, d) { 
      return rstr2b64(rstr_hmac(k, d), b64pad);
    };
    this.any_hmac = function (k, d, e) { 
      return rstr2any(rstr_hmac(k, d), e);
    };
    /**
     * Perform a simple self-test to see if the VM is working
     * @return {String} Hexadecimal hash sample
     * @public
     */
    this.vm_test = function () {
      return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
    };
    /** 
     * @description Enable/disable uppercase hexadecimal returned string 
     * @param {boolean} 
     * @return {Object} this
     * @public
     */ 
    this.setUpperCase = function (a) {
      if (typeof a === 'boolean') {
        hexcase = a;
      }
      return this;
    };
    /** 
     * @description Defines a base64 pad string 
     * @param {string} Pad
     * @return {Object} this
     * @public
     */ 
    this.setPad = function (a) {
      b64pad = a || b64pad;
      return this;
    };
    /** 
     * @description Defines a base64 pad string 
     * @param {boolean} 
     * @return {Object} this
     * @public
     */ 
    this.setUTF8 = function (a) {
      if (typeof a === 'boolean') {
        utf8 = a;
      }
      return this;
    };

    /* private methods */
    
    /**
     * Calculate the SHA-512 of a raw string
     */
    function rstr(s) {
      s = (utf8) ? utf8Encode(s) : s;
      return binb2rstr(binb(rstr2binb(s), s.length * 8));
    }
    /*
     * Calculate the HMAC-SHA-512 of a key and some data (raw strings)
     */
    function rstr_hmac(key, data) {
      key = (utf8) ? utf8Encode(key) : key;
      data = (utf8) ? utf8Encode(data) : data;
      
      var hash, i = 0, 
          bkey = rstr2binb(key),
          ipad = Array(32), opad = Array(32);

      if (bkey.length > 32) { bkey = binb(bkey, key.length * 8); }
      
      for (; i < 32; i+=1) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }
      
      hash = binb(ipad.concat(rstr2binb(data)), 1024 + data.length * 8);
      return binb2rstr(binb(opad.concat(hash), 1024 + 512));
    }
            
    /**
     * Calculate the SHA-512 of an array of big-endian dwords, and a bit length
     */
    function binb(x, len) {
      var j, i, l,
          W = new Array(80),
          hash = new Array(16),
          //Initial hash values
          H = [
            new int64(0x6a09e667, -205731576),
            new int64(-1150833019, -2067093701),
            new int64(0x3c6ef372, -23791573),
            new int64(-1521486534, 0x5f1d36f1),
            new int64(0x510e527f, -1377402159),
            new int64(-1694144372, 0x2b3e6c1f),
            new int64(0x1f83d9ab, -79577749),
            new int64(0x5be0cd19, 0x137e2179)
          ],
          T1 = new int64(0, 0),
          T2 = new int64(0, 0),
          a = new int64(0,0),
          b = new int64(0,0),
          c = new int64(0,0),
          d = new int64(0,0),
          e = new int64(0,0),
          f = new int64(0,0),
          g = new int64(0,0),
          h = new int64(0,0),
          //Temporary variables not specified by the document
          s0 = new int64(0, 0),
          s1 = new int64(0, 0),
          Ch = new int64(0, 0),
          Maj = new int64(0, 0),
          r1 = new int64(0, 0),
          r2 = new int64(0, 0),
          r3 = new int64(0, 0);

      if (sha512_k === undefined) {
          //SHA512 constants
          sha512_k = [
            new int64(0x428a2f98, -685199838), new int64(0x71374491, 0x23ef65cd),
            new int64(-1245643825, -330482897), new int64(-373957723, -2121671748),
            new int64(0x3956c25b, -213338824), new int64(0x59f111f1, -1241133031),
            new int64(-1841331548, -1357295717), new int64(-1424204075, -630357736),
            new int64(-670586216, -1560083902), new int64(0x12835b01, 0x45706fbe),
            new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, -704662302),
            new int64(0x72be5d74, -226784913), new int64(-2132889090, 0x3b1696b1),
            new int64(-1680079193, 0x25c71235), new int64(-1046744716, -815192428),
            new int64(-459576895, -1628353838), new int64(-272742522, 0x384f25e3),
            new int64(0xfc19dc6, -1953704523), new int64(0x240ca1cc, 0x77ac9c65),
            new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
            new int64(0x5cb0a9dc, -1119749164), new int64(0x76f988da, -2096016459),
            new int64(-1740746414, -295247957), new int64(-1473132947, 0x2db43210),
            new int64(-1341970488, -1728372417), new int64(-1084653625, -1091629340),
            new int64(-958395405, 0x3da88fc2), new int64(-710438585, -1828018395),
            new int64(0x6ca6351, -536640913), new int64(0x14292967, 0xa0e6e70),
            new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
            new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, -1651133473),
            new int64(0x650a7354, -1951439906), new int64(0x766a0abb, 0x3c77b2a8),
            new int64(-2117940946, 0x47edaee6), new int64(-1838011259, 0x1482353b),
            new int64(-1564481375, 0x4cf10364), new int64(-1474664885, -1136513023),
            new int64(-1035236496, -789014639), new int64(-949202525, 0x654be30),
            new int64(-778901479, -688958952), new int64(-694614492, 0x5565a910),
            new int64(-200395387, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
            new int64(0x19a4c116, -1194143544), new int64(0x1e376c08, 0x5141ab53),
            new int64(0x2748774c, -544281703), new int64(0x34b0bcb5, -509917016),
            new int64(0x391c0cb3, -976659869), new int64(0x4ed8aa4a, -482243893),
            new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, -692930397),
            new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
            new int64(-2067236844, -1578062990), new int64(-1933114872, 0x1a6439ec),
            new int64(-1866530822, 0x23631e28), new int64(-1538233109, -561857047),
            new int64(-1090935817, -1295615723), new int64(-965641998, -479046869),
            new int64(-903397682, -366583396), new int64(-779700025, 0x21c0c207),
            new int64(-354779690, -840897762), new int64(-176337025, -294727304),
            new int64(0x6f067aa, 0x72176fba), new int64(0xa637dc5, -1563912026),
            new int64(0x113f9804, -1090974290), new int64(0x1b710b35, 0x131c471b),
            new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
            new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, -1676669620),
            new int64(0x4cc5d4be, -885112138), new int64(0x597f299c, -60457430),
            new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)
          ];
      }
  
      for (i=0; i<80; i+=1) {
        W[i] = new int64(0, 0);
      }
    
      // append padding to the source string. The format is described in the FIPS.
      x[len >> 5] |= 0x80 << (24 - (len & 0x1f));
      x[((len + 128 >> 10)<< 5) + 31] = len;
      l = x.length;
      for (i = 0; i<l; i+=32) { //32 dwords is the block size
        int64copy(a, H[0]);
        int64copy(b, H[1]);
        int64copy(c, H[2]);
        int64copy(d, H[3]);
        int64copy(e, H[4]);
        int64copy(f, H[5]);
        int64copy(g, H[6]);
        int64copy(h, H[7]);
      
        for (j=0; j<16; j+=1) {
          W[j].h = x[i + 2*j];
          W[j].l = x[i + 2*j + 1];
        }
      
        for (j=16; j<80; j+=1) {
          //sigma1
          int64rrot(r1, W[j-2], 19);
          int64revrrot(r2, W[j-2], 29);
          int64shr(r3, W[j-2], 6);
          s1.l = r1.l ^ r2.l ^ r3.l;
          s1.h = r1.h ^ r2.h ^ r3.h;
          //sigma0
          int64rrot(r1, W[j-15], 1);
          int64rrot(r2, W[j-15], 8);
          int64shr(r3, W[j-15], 7);
          s0.l = r1.l ^ r2.l ^ r3.l;
          s0.h = r1.h ^ r2.h ^ r3.h;
      
          int64add4(W[j], s1, W[j-7], s0, W[j-16]);
        }
      
        for (j = 0; j < 80; j+=1) {
          //Ch
          Ch.l = (e.l & f.l) ^ (~e.l & g.l);
          Ch.h = (e.h & f.h) ^ (~e.h & g.h);
      
          //Sigma1
          int64rrot(r1, e, 14);
          int64rrot(r2, e, 18);
          int64revrrot(r3, e, 9);
          s1.l = r1.l ^ r2.l ^ r3.l;
          s1.h = r1.h ^ r2.h ^ r3.h;
      
          //Sigma0
          int64rrot(r1, a, 28);
          int64revrrot(r2, a, 2);
          int64revrrot(r3, a, 7);
          s0.l = r1.l ^ r2.l ^ r3.l;
          s0.h = r1.h ^ r2.h ^ r3.h;
      
          //Maj
          Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
          Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);
      
          int64add5(T1, h, s1, Ch, sha512_k[j], W[j]);
          int64add(T2, s0, Maj);
      
          int64copy(h, g);
          int64copy(g, f);
          int64copy(f, e);
          int64add(e, d, T1);
          int64copy(d, c);
          int64copy(c, b);
          int64copy(b, a);
          int64add(a, T1, T2);
        }
        int64add(H[0], H[0], a);
        int64add(H[1], H[1], b);
        int64add(H[2], H[2], c);
        int64add(H[3], H[3], d);
        int64add(H[4], H[4], e);
        int64add(H[5], H[5], f);
        int64add(H[6], H[6], g);
        int64add(H[7], H[7], h);
      }
    
      //represent the hash as an array of 32-bit dwords
      for (i=0; i<8; i+=1) {
        hash[2*i] = H[i].h;
        hash[2*i + 1] = H[i].l;
      }
      return hash;
    }
    
    //A constructor for 64-bit numbers
    function int64(h, l) {
      this.h = h;
      this.l = l;
      //this.toString = int64toString;
    }
    
    //Copies src into dst, assuming both are 64-bit numbers
    function int64copy(dst, src) {
      dst.h = src.h;
      dst.l = src.l;
    }
    
    //Right-rotates a 64-bit number by shift
    //Won't handle cases of shift>=32
    //The function revrrot() is for that
    function int64rrot(dst, x, shift) {
      dst.l = (x.l >>> shift) | (x.h << (32-shift));
      dst.h = (x.h >>> shift) | (x.l << (32-shift));
    }
    
    //Reverses the dwords of the source and then rotates right by shift.
    //This is equivalent to rotation by 32+shift
    function int64revrrot(dst, x, shift) {
      dst.l = (x.h >>> shift) | (x.l << (32-shift));
      dst.h = (x.l >>> shift) | (x.h << (32-shift));
    }
    
    //Bitwise-shifts right a 64-bit number by shift
    //Won't handle shift>=32, but it's never needed in SHA512
    function int64shr(dst, x, shift) {
      dst.l = (x.l >>> shift) | (x.h << (32-shift));
      dst.h = (x.h >>> shift);
    }
    
    //Adds two 64-bit numbers
    //Like the original implementation, does not rely on 32-bit operations
    function int64add(dst, x, y) {
       var w0 = (x.l & 0xffff) + (y.l & 0xffff);
       var w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16);
       var w2 = (x.h & 0xffff) + (y.h & 0xffff) + (w1 >>> 16);
       var w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
       dst.l = (w0 & 0xffff) | (w1 << 16);
       dst.h = (w2 & 0xffff) | (w3 << 16);
    }
    
    //Same, except with 4 addends. Works faster than adding them one by one.
    function int64add4(dst, a, b, c, d) {
       var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff);
       var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16);
       var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (w1 >>> 16);
       var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
       dst.l = (w0 & 0xffff) | (w1 << 16);
       dst.h = (w2 & 0xffff) | (w3 << 16);
    }
    
    //Same, except with 5 addends
    function int64add5(dst, a, b, c, d, e) {
      var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff) + (e.l & 0xffff),
          w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (w0 >>> 16),
          w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (e.h & 0xffff) + (w1 >>> 16),
          w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (w2 >>> 16);
       dst.l = (w0 & 0xffff) | (w1 << 16);
       dst.h = (w2 & 0xffff) | (w3 << 16);
    }
  },
  /**
   * @class Hashes.RMD160
   * @constructor
   * @param {Object} [config]
   * 
   * A JavaScript implementation of the RIPEMD-160 Algorithm
   * Version 2.2 Copyright Jeremy Lin, Paul Johnston 2000 - 2009.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * See http://pajhome.org.uk/crypt/md5 for details.
   * Also http://www.ocf.berkeley.edu/~jjlin/jsotp/
   */
  RMD160 : function (options) {
    /**
     * Private properties configuration variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     * @see this.setUpperCase() method
     * @see this.setPad() method
     */
    var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false,   /* hexadecimal output case format. false - lowercase; true - uppercase  */
        b64pad = (options && typeof options.pad === 'string') ? options.pda : '=',  /* base-64 pad character. Default '=' for strict RFC compliance   */
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true, /* enable/disable utf8 encoding */
        rmd160_r1 = [
           0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
           7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
           3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
           1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
           4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13
        ],
        rmd160_r2 = [
           5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
           6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
          15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
           8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
          12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11
        ],
        rmd160_s1 = [
          11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
           7,  6,  8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
          11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
           9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6
        ],
        rmd160_s2 = [
           8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
           9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
           9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
          15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
           8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11
        ];

    /* privileged (public) methods */
    this.hex = function (s) {
      return rstr2hex(rstr(s, utf8)); 
    };
    this.b64 = function (s) {
      return rstr2b64(rstr(s, utf8), b64pad);
    };
    this.any = function (s, e) { 
      return rstr2any(rstr(s, utf8), e);
    };
    this.hex_hmac = function (k, d) { 
      return rstr2hex(rstr_hmac(k, d));
    };
    this.b64_hmac = function (k, d) { 
      return rstr2b64(rstr_hmac(k, d), b64pad);
    };
    this.any_hmac = function (k, d, e) { 
      return rstr2any(rstr_hmac(k, d), e); 
    };
    /**
     * Perform a simple self-test to see if the VM is working
     * @return {String} Hexadecimal hash sample
     * @public
     */
    this.vm_test = function () {
      return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
    };
    /** 
     * @description Enable/disable uppercase hexadecimal returned string 
     * @param {boolean} 
     * @return {Object} this
     * @public
     */ 
    this.setUpperCase = function (a) {
      if (typeof a === 'boolean' ) { hexcase = a; }
      return this;
    };
    /** 
     * @description Defines a base64 pad string 
     * @param {string} Pad
     * @return {Object} this
     * @public
     */ 
    this.setPad = function (a) {
      if (typeof a !== 'undefined' ) { b64pad = a; }
      return this;
    };
    /** 
     * @description Defines a base64 pad string 
     * @param {boolean} 
     * @return {Object} this
     * @public
     */ 
    this.setUTF8 = function (a) {
      if (typeof a === 'boolean') { utf8 = a; }
      return this;
    };

    /* private methods */

    /**
     * Calculate the rmd160 of a raw string
     */
    function rstr(s) {
      s = (utf8) ? utf8Encode(s) : s;
      return binl2rstr(binl(rstr2binl(s), s.length * 8));
    }

    /**
     * Calculate the HMAC-rmd160 of a key and some data (raw strings)
     */
    function rstr_hmac(key, data) {
      key = (utf8) ? utf8Encode(key) : key;
      data = (utf8) ? utf8Encode(data) : data;
      var i, hash,
          bkey = rstr2binl(key),
          ipad = Array(16), opad = Array(16);

      if (bkey.length > 16) { 
        bkey = binl(bkey, key.length * 8); 
      }
      
      for (i = 0; i < 16; i+=1) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }
      hash = binl(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
      return binl2rstr(binl(opad.concat(hash), 512 + 160));
    }

    /**
     * Convert an array of little-endian words to a string
     */
    function binl2rstr(input) {
      var i, output = '', l = input.length * 32;
      for (i = 0; i < l; i += 8) {
        output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
      }
      return output;
    }

    /**
     * Calculate the RIPE-MD160 of an array of little-endian words, and a bit length.
     */
    function binl(x, len) {
      var T, j, i, l,
          h0 = 0x67452301,
          h1 = 0xefcdab89,
          h2 = 0x98badcfe,
          h3 = 0x10325476,
          h4 = 0xc3d2e1f0,
          A1, B1, C1, D1, E1,
          A2, B2, C2, D2, E2;

      /* append padding */
      x[len >> 5] |= 0x80 << (len % 32);
      x[(((len + 64) >>> 9) << 4) + 14] = len;
      l = x.length;
      
      for (i = 0; i < l; i+=16) {
        A1 = A2 = h0; B1 = B2 = h1; C1 = C2 = h2; D1 = D2 = h3; E1 = E2 = h4;
        for (j = 0; j <= 79; j+=1) {
          T = safe_add(A1, rmd160_f(j, B1, C1, D1));
          T = safe_add(T, x[i + rmd160_r1[j]]);
          T = safe_add(T, rmd160_K1(j));
          T = safe_add(bit_rol(T, rmd160_s1[j]), E1);
          A1 = E1; E1 = D1; D1 = bit_rol(C1, 10); C1 = B1; B1 = T;
          T = safe_add(A2, rmd160_f(79-j, B2, C2, D2));
          T = safe_add(T, x[i + rmd160_r2[j]]);
          T = safe_add(T, rmd160_K2(j));
          T = safe_add(bit_rol(T, rmd160_s2[j]), E2);
          A2 = E2; E2 = D2; D2 = bit_rol(C2, 10); C2 = B2; B2 = T;
        }

        T = safe_add(h1, safe_add(C1, D2));
        h1 = safe_add(h2, safe_add(D1, E2));
        h2 = safe_add(h3, safe_add(E1, A2));
        h3 = safe_add(h4, safe_add(A1, B2));
        h4 = safe_add(h0, safe_add(B1, C2));
        h0 = T;
      }
      return [h0, h1, h2, h3, h4];
    }

    // specific algorithm methods 
    function rmd160_f(j, x, y, z) {
      return ( 0 <= j && j <= 15) ? (x ^ y ^ z) :
         (16 <= j && j <= 31) ? (x & y) | (~x & z) :
         (32 <= j && j <= 47) ? (x | ~y) ^ z :
         (48 <= j && j <= 63) ? (x & z) | (y & ~z) :
         (64 <= j && j <= 79) ? x ^ (y | ~z) :
         'rmd160_f: j out of range';
    }

    function rmd160_K1(j) {
      return ( 0 <= j && j <= 15) ? 0x00000000 :
         (16 <= j && j <= 31) ? 0x5a827999 :
         (32 <= j && j <= 47) ? 0x6ed9eba1 :
         (48 <= j && j <= 63) ? 0x8f1bbcdc :
         (64 <= j && j <= 79) ? 0xa953fd4e :
         'rmd160_K1: j out of range';
    }

    function rmd160_K2(j){
      return ( 0 <= j && j <= 15) ? 0x50a28be6 :
         (16 <= j && j <= 31) ? 0x5c4dd124 :
         (32 <= j && j <= 47) ? 0x6d703ef3 :
         (48 <= j && j <= 63) ? 0x7a6d76e9 :
         (64 <= j && j <= 79) ? 0x00000000 :
         'rmd160_K2: j out of range';
    }
  }
};

  // exposes Hashes
  (function( window, undefined ) {
    var freeExports = false;
    if (typeof exports === 'object' ) {
      freeExports = exports;
      if (exports && typeof global === 'object' && global && global === global.global ) { window = global; }
    }

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
      // define as an anonymous module, so, through path mapping, it can be aliased
      define(function () { return Hashes; });
    }
    else if ( freeExports ) {
      // in Node.js or RingoJS v0.8.0+
      if ( typeof module === 'object' && module && module.exports === freeExports ) {
        module.exports = Hashes;
      }
      // in Narwhal or RingoJS v0.7.0-
      else {
        freeExports.Hashes = Hashes;
      }
    }
    else {
      // in a browser or Rhino
      window.Hashes = Hashes;
    }
  }( this ));
}()); // IIFE
})(window)
},{}]},{},[1])(1)
});
;