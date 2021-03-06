'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function (_think$base) {
  (0, _inherits3.default)(_class, _think$base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _think$base.apply(this, arguments));
  }

  /**
   * init
   * @return {} []
   */
  _class.prototype.init = function init() {
    this.comparison = {
      'EQ': '$eq',
      '=': '$eq',
      'NEQ': '$ne',
      '!=': '$ne',
      '<>': '$ne',
      'GT': '$gt',
      '>': '$gt',
      'EGT': '$gte',
      '>=': '$gte',
      'LT': '$lt',
      '<': '$lt',
      'ELT': '$lte',
      '<=': '$lte',
      'OR': '$or',
      'IN': '$in',
      'NOTIN': '$nin'
    };
  };
  /**
   * parse field
   * @param  {String} field   []
   * @param  {Boolean} reverse []
   * @return {Object}         []
   */


  _class.prototype.parseField = function parseField(field, reverse) {
    if (!field) {
      return {};
    }
    if (think.isString(field)) {
      field = field.split(/\s*,\s*/);
    }
    if (think.isArray(field)) {
      var result = {};
      field.forEach(function (item) {
        result[item] = reverse ? 0 : 1;
      });
      return result;
    }
    if (reverse) {
      for (var key in field) {
        field[key] = 0;
      }
    }
    return field;
  };
  /**
   * parse limit
   * @param  {Object} collection []
   * @param  {Array} limit      []
   * @return {Object}            []
   */


  _class.prototype.parseLimit = function parseLimit(limit) {
    if (!limit) {
      return [];
    }
    if (think.isNumber(limit)) {
      return [0, limit];
    }
    if (think.isString(limit)) {
      limit = limit.split(/\s*,\s*/);
    }
    var skip = limit[0] | 0;
    var limitNum = limit[1] | 0;
    if (limitNum) {
      return [skip, limitNum];
    }
    return [0, skip];
  };
  /**
   * parse order
   * @param  {String} order []
   * @return {Object}       []
   */


  _class.prototype.parseOrder = function parseOrder(order) {
    if (!order) {
      return {};
    }
    if (order === true || order === 'natural') {
      return {
        $natural: 1
      };
    }
    if (think.isString(order)) {
      order = order.split(/\s*,\s*/);
      var result = {};
      order.forEach(function (item) {
        item = item.split(' ');
        var type = (item[1] || '').toLowerCase();
        result[item[0].trim()] = type === 'desc' ? -1 : 1;
      });
      return result;
    }
    for (var key in order) {
      if (order[key] === false || order[key] === 0) {
        order[key] = -1;
      } else if (order[key] !== -1) {
        order[key] = 1;
      }
    }
    return order;
  };
  /**
   * parse group
   * @param  {String} group []
   * @return {Object}       []
   */


  _class.prototype.parseGroup = function parseGroup(group) {
    if (think.isEmpty(group)) {
      return '';
    }
    if (think.isString(group)) {
      group = group.split(/\s*,\s*/);
    }
    return group;
  };
  /**
   * parse where
   * http://docs.mongodb.org/manual/reference/operator/query/
   * @param  {Object} where []
   * @return {Object}       []
   */


  _class.prototype.parseWhere = function parseWhere(where) {
    var _this2 = this;

    if (think.isArray(where)) {
      return where.map(function (item) {
        return _this2.parseWhere(item);
      });
    }

    if (think.isObject(where)) {
      var result = {};
      for (var key in where) {
        var value = where[key];
        if (key === '_id' && think.isString(value)) {
          var validator = think.require('validator');
          if (validator.mongoId(value)) {
            var _think$require = think.require('mongodb'),
                ObjectID = _think$require.ObjectID;

            result[key] = ObjectID(value);
            continue;
          }
        }
        key = this.comparison[key] || key;
        if (think.isObject(value) || think.isArray(value)) {
          value = this.parseWhere(value);
        }
        result[key] = value;
      }
      return result;
    }
    return where || {};
  };
  /**
   * parse distinct
   * @param  {String} distinct []
   * @return {String}          []
   */


  _class.prototype.parseDistinct = function parseDistinct(distinct) {
    return distinct;
  };

  return _class;
}(think.base);

exports.default = _class;