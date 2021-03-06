'use strict';

exports.__esModule = true;

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Validator
 * @type {Object}
 */
var Validator = {};
/**
 * check value is set
 * @param  {String} value []
 * @return {Boolean}       []
 */


//https://github.com/chriso/validator.js
Validator.required = function (value) {
  return !think.isEmpty(value);
};
/**
 * The field under validation must be present if the anotherfield field is equal to any value.
 * @param  {String}    value        []
 * @param  {Stromg}    anotherfield []
 * @param  {Array} values       []
 * @return {Boolean}                 []
 */
Validator.requiredIf = function (value, anotherField) {
  for (var _len = arguments.length, values = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    values[_key - 2] = arguments[_key];
  }

  if (values.indexOf(anotherField) > -1) {
    return Validator.required(value);
  }
  return true;
};
/**
 * parse requiredIf args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._requiredIf = function (args, data) {
  var arg0 = args[0];
  args[0] = data[arg0] ? data[arg0].value : '';
  return args;
};
/**
 * The field under validation must be present not if the anotherfield field is equal to any value.
 * @param  {String}    value        []
 * @param  {Stromg}    anotherfield []
 * @param  {Array} values       []
 * @return {Boolean}                 []
 */
Validator.requiredNotIf = function (value, anotherField) {
  for (var _len2 = arguments.length, values = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    values[_key2 - 2] = arguments[_key2];
  }

  if (values.indexOf(anotherField) === -1) {
    return Validator.required(value);
  }
  return true;
};
/**
 * parse requiredNotIf args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._requiredNotIf = function (args, data) {
  return Validator._requiredIf(args, data);
};
/**
 * The field under validation must be present only if any of the other specified fields are present.
 * @param  {String}    value         []
 * @param  {Array} anotherFields []
 * @return {Boolean}                  []
 */
Validator.requiredWith = function (value) {
  for (var _len3 = arguments.length, anotherFields = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    anotherFields[_key3 - 1] = arguments[_key3];
  }

  var flag = anotherFields.some(function (item) {
    return Validator.required(item);
  });
  if (flag) {
    return Validator.required(value);
  }
  return true;
};
/**
 * parse required with args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._requiredWith = function (args, data) {
  return args.map(function (item) {
    return data[item] ? data[item].value : '';
  });
};
/**
 * The field under validation must be present only if all of the other specified fields are present.
 * @param  {String}    value         []
 * @param  {Array} anotherFields []
 * @return {Boolean}                  []
 */
Validator.requiredWithAll = function (value) {
  for (var _len4 = arguments.length, anotherFields = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    anotherFields[_key4 - 1] = arguments[_key4];
  }

  var flag = anotherFields.every(function (item) {
    return Validator.required(item);
  });
  if (flag) {
    return Validator.required(value);
  }
  return true;
};
/**
 * parse required with all args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._requiredWithAll = function (args, data) {
  return Validator._requiredWith(args, data);
};
/**
 * The field under validation must be present only when any of the other specified fields are not present.
 * @param  {String}    value         []
 * @param  {Array} anotherFields []
 * @return {Boolean}                  []
 */
Validator.requiredWithout = function (value) {
  for (var _len5 = arguments.length, anotherFields = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    anotherFields[_key5 - 1] = arguments[_key5];
  }

  var flag = anotherFields.some(function (item) {
    return !Validator.required(item);
  });
  if (flag) {
    return Validator.required(value);
  }
  return true;
};
/**
 * parse required without args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._requiredWithout = function (args, data) {
  return Validator._requiredWith(args, data);
};
/**
 * The field under validation must be present only when all of the other specified fields are not present.
 * @param  {String}    value         []
 * @param  {Array} anotherFields []
 * @return {Boolean}                  []
 */
Validator.requiredWithoutAll = function (value) {
  for (var _len6 = arguments.length, anotherFields = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    anotherFields[_key6 - 1] = arguments[_key6];
  }

  var flag = anotherFields.every(function (item) {
    return !Validator.required(item);
  });
  if (flag) {
    return Validator.required(value);
  }
  return true;
};
/**
 * parse required without all args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._requiredWithoutAll = function (args, data) {
  return Validator._requiredWith(args, data);
};
/**
 * check if the string contains the seed.
 * @param  {String} value []
 * @param  {String} str   []
 * @return {Boolean}       []
 */
Validator.contains = function (value, str) {
  return !value || _validator2.default.contains(value, str);
};
/**
 * check if the string matches the comparison.
 * @param  {String} value      []
 * @param  {String} comparison []
 * @return {Boolean}            []
 */
Validator.equals = function (value, comparison) {
  return !value || _validator2.default.equals(value, comparison);
};
/**
 * parse equal args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._equals = function (args, data) {
  var item = data[args[0]];
  return [item ? item.value : ''];
};
/**
 * check if the string matches the comparison.
 * @param  {String} value      []
 * @param  {String} comparison []
 * @return {Boolean}            []
 */
Validator.equalsValue = function (value, comparison) {
  return !value || _validator2.default.equals(value, comparison);
};
/**
 * check if the string not matches the comparison.
 * @type {Boolean}
 */
Validator.different = function (value, comparison) {
  return !value || value !== comparison;
};
/**
 * parse different args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._different = function (args, data) {
  return Validator._equals(args, data);
};
/**
 * check if the string is a date that's after the specified date (defaults to now).
 * @param  {String} value []
 * @param  {String} date  []
 * @return {Boolean}       []
 */
Validator.after = function (value, date) {
  return !value || _validator2.default.isAfter(value, date);
};
/**
 * parse after args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._after = function (args, data) {
  var arg = args[0];
  if (arg in data) {
    return [data[arg].value];
  }
  return args;
};
/**
 * check if the string contains only letters (a-zA-Z).
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.alpha = function (value) {
  return !value || _validator2.default.isAlpha(value);
};
/**
 * check if the string contains only letters and dashes(a-zA-Z_).
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.alphaDash = function (value) {
  return !value || /^[A-Z_]+$/i.test(value);
};
/**
 * check if the string contains only letters and numbers.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.alphaNumeric = function (value) {
  return !value || _validator2.default.isAlphanumeric(value);
};
/**
 * check if the string contains only letters or numbers or dash.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.alphaNumericDash = function (value) {
  return !value || /^\w+$/i.test(value);
};
/**
 * check if the string contains ASCII chars only.
 * @param  {String} value []
 * @return {Boolean}      []
 */
Validator.ascii = function (value) {
  return !value || _validator2.default.isAscii(value);
};
/**
 * check if a string is base64 encoded.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.base64 = function (value) {
  return !value || _validator2.default.isBase64(value);
};
/**
 * check if the string is a date that's before the specified date.
 * @param  {String} value []
 * @param  {String} date  []
 * @return {Boolean}       []
 */
Validator.before = function (value, date) {
  return !value || _validator2.default.isBefore(value, date);
};
/**
 * parse before args
 * @param  {Array} args []
 * @param  {Object} data []
 * @return {Array}      []
 */
Validator._before = function (args, data) {
  return Validator._after(args, data);
};
/**
 * check if the string's length (in bytes) falls in a range.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.byteLength = function (value, min, max) {
  return !value || _validator2.default.isByteLength(value, min, max);
};
/**
 *  check if the string is a credit card.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.creditcard = function (value) {
  return !value || _validator2.default.isCreditCard(value);
};
/**
 * check if the string is a valid currency amount. options is an object which defaults to
 * @param  {String} value   []
 * @param  {Object} options []
 * @return {Boolean}         []
 */
Validator.currency = function (value, options) {
  return !value || _validator2.default.isCurrency(value, options);
};
/**
 * check if the string is a date.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.date = function (value) {
  return !value || _validator2.default.isDate(value);
};
/**
 * check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.decimal = function (value) {
  return !value || _validator2.default.isDecimal(value);
};
/**
 * check if the string is a number that's divisible by another.
 * @param  {Number} value  []
 * @param  {Number} number []
 * @return {Boolean}        []
 */
Validator.divisibleBy = function (value, number) {
  return !value || _validator2.default.isDivisibleBy(value, number);
};
/**
 * check if the string is an email. 
 * options is an object which defaults to { 
 *   allow_display_name: false, 
 *   allow_utf8_locale_part: true, 
 *   require_tld: true 
 *  }. 
 *  If allow_display_name is set to true, the validator will also match Display Name <email-address>. 
 *  If allow_utf8_locale_part is set to false, the validator will not allow any non-English UTF8 character in email address' locale part. 
 *  If require_tld is set to false, e-mail addresses without having TLD in their domain will also be matched.
 * @param  {String} value   []
 * @param  {Object} options []
 * @return {Boolean}         []
 */
Validator.email = function (value, options) {
  return !value || _validator2.default.isEmail(value, options);
};
/**
 * check if the string is a fully qualified domain name (e.g. domain.com). 
 * options is an object which defaults to { 
 *   require_tld: true, 
 *   allow_underscores: false, 
 *   allow_trailing_dot: false 
 * }.
 * @param  {String} value   []
 * @param  {Object} options []
 * @return {Boolean}         []
 */
Validator.fqdn = function (value, options) {
  return !value || _validator2.default.isFQDN(value, options);
};
/**
 *  check if the string is a float. 
 *  options is an object which can contain the keys min and/or max to validate the float is within boundaries 
 *  (e.g. { min: 7.22, max: 9.55 }).
 * @param  {String} value   []
 * @param  {Object} options []
 * @return {Boolean}         []
 */
Validator.float = function (value, min, max) {
  if (!value) {
    return true;
  }
  var options = {};
  if (min) {
    options.min = min;
  }
  if (max) {
    options.max = max;
  }
  return _validator2.default.isFloat(value, options);
};
/**
 * check if the string contains any full-width chars.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.fullWidth = function (value) {
  return !value || _validator2.default.isFullWidth(value);
};
/**
 * check if the string contains any half-width chars.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.halfWidth = function (value) {
  return !value || _validator2.default.isHalfWidth(value);
};
/**
 * check if the string is a hexadecimal color.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.hexColor = function (value) {
  return !value || _validator2.default.isHexColor(value);
};
/**
 * check if the string is a hexadecimal number.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.hex = function (value) {
  return !value || _validator2.default.isHexadecimal(value);
};
/**
 * check if the string is an IP (version 4 or 6).
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.ip = function (value) {
  return !value || !!_net2.default.isIP(value);
};
/**
 * check if the string is an IP v4
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.ip4 = function (value) {
  return !value || _net2.default.isIPv4(value);
};
/**
 * check if the string is an IP v6
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.ip6 = function (value) {
  return !value || _net2.default.isIPv6(value);
};
/**
 * check if the string is an ISBN (version 10 or 13).
 * @param  {String} value   []
 * @param  {Number} version []
 * @return {Boolean}         []
 */
Validator.isbn = function (value, version) {
  return !value || _validator2.default.isISBN(value, version);
};
/**
 * check if the string is an ISIN (stock/security identifier).
 * https://en.wikipedia.org/wiki/International_Securities_Identification_Number
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.isin = function (value) {
  return !value || _validator2.default.isISIN(value);
};
/**
 * check if the string is a valid ISO 8601 date.
 * https://en.wikipedia.org/wiki/ISO_8601
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.iso8601 = function (value) {
  return !value || _validator2.default.isISO8601(value);
};
/**
 * check if the string is in a array of allowed values.
 * @type {Boolean}
 */
Validator.in = function (value) {
  for (var _len7 = arguments.length, values = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    values[_key7 - 1] = arguments[_key7];
  }

  return !value || _validator2.default.isIn(value, values);
};
/**
 * check if the string is not in a array of allowed values.
 * @type {Boolean}
 */
Validator.notIn = function (value) {
  for (var _len8 = arguments.length, values = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
    values[_key8 - 1] = arguments[_key8];
  }

  return !value || !_validator2.default.isIn(value, values);
};
/**
 * check if the string is an integer. 
 * options is an object which can contain the keys min and/or max to check the integer is within boundaries (e.g. { min: 10, max: 99 }).
 * @type {Boolean}
 */
Validator.int = function (value, min, max) {
  if (!value) {
    return true;
  }
  var options = {};
  if (min) {
    options.min = min | 0;
  }
  if (max) {
    options.max = max | 0;
  }
  return !isNaN(value) && _validator2.default.isInt(value, options);
};
/**
 * check if the string greater than min value
 * @param  {String} value []
 * @param  {Number} min   []
 * @return {Boolean}       []
 */
Validator.min = function (value, min) {
  return !value || _validator2.default.isInt(value, {
    min: min | 0
  });
};
/**
 * check if the string less than max value
 * @param  {String} value []
 * @param  {Number} max   []
 * @return {Boolean}       []
 */
Validator.max = function (value, max) {
  return !value || _validator2.default.isInt(value, {
    min: 0,
    max: max | 0
  });
};
/**
 * check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
 * @param  {String} value []
 * @param  {Number} min   []
 * @param  {Number} max   []
 * @return {Boolean}       []
 */
Validator.length = function (value, min, max) {
  if (!value) {
    return true;
  }
  if (min) {
    min = min | 0;
  } else {
    min = 1;
  }
  if (max) {
    max = max | 0;
  }
  return _validator2.default.isLength(value, min, max);
};
/**
 * check if the string's length is max than min
 * @param  {String} value []
 * @param  {Number} min   []
 * @return {Boolean}       []
 */
Validator.minLength = function (value, min) {
  return !value || _validator2.default.isLength(value, min | 0);
};
/**
 * check is the string's length is min than max
 * @param  {String} value []
 * @param  {Number} max   []
 * @return {Boolean}       []
 */
Validator.maxLength = function (value, max) {
  return !value || _validator2.default.isLength(value, 0, max | 0);
};
/**
 * check if the string is lowercase.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.lowercase = function (value) {
  return !value || _validator2.default.isLowercase(value);
};
/**
 * check if the string is a mobile phone number, 
 * (locale is one of ['zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU']).
 * @param  {String} value []
 * @param  {[type]} locale []
 * @return {Boolean}       []
 */
Validator.mobile = function (value) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'zh-CN';

  return !value || _validator2.default.isMobilePhone(value, locale);
};
/**
 *  check if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.mongoId = function (value) {
  return !value || _validator2.default.isMongoId(value);
};
/**
 * check if the string contains one or more multibyte chars.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.multibyte = function (value) {
  return !value || _validator2.default.isMultibyte(value);
};
/**
 * check if the string contains only numbers.
 * @param  {String} value []
 * @return {Boolean}       []
 */
// Validator.number = value => {
//   return validator.isNumeric(value);
// };
/**
 * check if the string is an URL. 
 * options is an object which defaults to { 
 *   protocols: ['http','https','ftp'], 
 *   require_tld: true, 
 *   require_protocol: false, 
 *   require_valid_protocol: true, 
 *   allow_underscores: false, 
 *   host_whitelist: false, 
 *   host_blacklist: false, 
 *   allow_trailing_dot: false, 
 *   allow_protocol_relative_urls: false 
 * }.
 * @type {Boolean}
 */
Validator.url = function (value, options) {
  if (!value) {
    return true;
  }
  options = think.extend({
    require_protocol: true,
    protocols: ['http', 'https']
  }, options);
  return _validator2.default.isURL(value, options);
};
/**
 * check if the string is uppercase.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.uppercase = function (value) {
  return !value || _validator2.default.isUppercase(value);
};
/**
 * check if the string contains a mixture of full and half-width chars.
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.variableWidth = function (value) {
  return !value || _validator2.default.isVariableWidth(value);
};
/**
 * check is sql order string
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.order = function (value) {
  if (!value) {
    return true;
  }
  return value.split(/\s*,\s*/).every(function (item) {
    return (/^\w+\s+(?:ASC|DESC)$/i.test(item)
    );
  });
};
/**
 * check is sql field string
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.field = function (value) {
  if (!value) {
    return true;
  }
  return value.split(/\s*,\s*/).every(function (item) {
    return item === '*' || /^\w+$/.test(item);
  });
};
/**
 * check is image file
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.image = function (value) {
  if (!value) {
    return true;
  }
  if (think.isObject(value)) {
    value = value.originalFilename;
  }
  return (/\.(?:jpeg|jpg|png|bmp|gif|svg)$/i.test(value)
  );
};
/**
 * check is string start with str
 * @param  {String} value []
 * @param  {String} str   []
 * @return {Boolean}       []
 */
Validator.startWith = function (value, str) {
  return !value || value.indexOf(str) === 0;
};
/**
 * check is string end with str
 * @param  {String} value []
 * @param  {String} str   []
 * @return {Boolean}       []
 */
Validator.endWith = function (value, str) {
  return !value || value.lastIndexOf(str) === value.length - str.length;
};
/**
 * check value is string value
 * @param  {String} value []
 * @return {Boolean}       []
 */
Validator.string = function (value) {
  return think.isString(value);
};
/**
 * check value is array value
 * @param  {Array} value []
 * @return {Boolean}       []
 */
Validator.array = function (value) {
  return think.isArray(value);
};
/**
 * check value is true
 * @param  {Boolean} value []
 * @return {Boolean}       []
 */
Validator.boolean = function (value) {
  return think.isBoolean(value);
};
/**
 * check value is object
 * @param  {Object} value []
 * @return {Boolean}       []
 */
Validator.object = function (value) {
  return think.isObject(value);
};

/**
 * check value with regexp
 * @param  {Mixed} value []
 * @param  {RegExp} reg   []
 * @return {Boolean}       []
 */
Validator.regexp = function (value, reg) {
  if (!value) {
    return true;
  }
  return reg.test(value);
};
/**
 * check type
 * @param  {Mixed} value []
 * @param  {String} type  []
 * @return {Boolean}       []
 */
Validator.type = function (value, type) {
  if (!value) {
    return true;
  }
  switch (type) {
    case 'int':
      return Validator.int(value);
    case 'float':
      return Validator.float(value);
    case 'boolean':
      return Validator.boolean(value);
    case 'array':
      return Validator.array(value);
    case 'object':
      return Validator.object(value);
  }
  return Validator.string(value);
};

exports.default = Validator;