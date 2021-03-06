'use strict';

exports.__esModule = true;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _base = require('./_base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = think.config('db');

/**
 * model base class
 * @type {Class}
 */
var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  /**
   * get table schema
   * @param  {String} table [table name]
   * @return {}       []
   */
  _class.prototype.getSchema = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(table) {
      var storeKey, schema, name;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              table = table || this.getTableName();
              storeKey = this.config.type + '_' + table + '_schema';
              schema = {};
              //force update table schema

              if (!this.config.schema_force_update) {
                _context.next = 9;
                break;
              }

              _context.next = 6;
              return this.db().getSchema(table);

            case 6:
              schema = _context.sent;
              _context.next = 15;
              break;

            case 9:
              schema = thinkCache(thinkCache.TABLE, storeKey);

              if (schema) {
                _context.next = 15;
                break;
              }

              _context.next = 13;
              return this.db().getSchema(table);

            case 13:
              schema = _context.sent;

              thinkCache(thinkCache.TABLE, storeKey, schema);

            case 15:
              if (!(table !== this.getTableName())) {
                _context.next = 17;
                break;
              }

              return _context.abrupt('return', schema);

            case 17:
              _context.t0 = _regenerator2.default.keys(schema);

            case 18:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 25;
                break;
              }

              name = _context.t1.value;

              if (!schema[name].primary) {
                _context.next = 23;
                break;
              }

              this.pk = name;
              return _context.abrupt('break', 25);

            case 23:
              _context.next = 18;
              break;

            case 25:
              //merge user set schema config
              this.schema = think.extend({}, schema, this.schema);
              return _context.abrupt('return', this.schema);

            case 27:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getSchema(_x) {
      return _ref.apply(this, arguments);
    }

    return getSchema;
  }();
  /**
   * get table fields
   * @param  {String} table []
   * @return {Promise}       []
   */


  _class.prototype.getTableFields = function getTableFields(table) {
    think.log('model.getTableFields is deprecated, use model.getSchema instead.', 'WARNING');
    return this.getSchema(table);
  };
  /**
   * get unique field
   * @param  {Object} data []
   * @return {Promise}      []
   */


  _class.prototype.getUniqueField = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(data) {
      var schema, name;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.getSchema();

            case 2:
              schema = _context2.sent;
              _context2.t0 = _regenerator2.default.keys(schema);

            case 4:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 10;
                break;
              }

              name = _context2.t1.value;

              if (!(schema[name].unique && (!data || data[name]))) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt('return', name);

            case 8:
              _context2.next = 4;
              break;

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getUniqueField(_x2) {
      return _ref2.apply(this, arguments);
    }

    return getUniqueField;
  }();
  /**
   * get last sql
   * @return {Promise} []
   */


  _class.prototype.getLastSql = function getLastSql() {
    return this.db().getLastSql();
  };
  /**
   * get primary key
   * @return {Promise} []
   */


  _class.prototype.getPk = function getPk() {
    var _this2 = this;

    if (this.pk !== 'id') {
      return _promise2.default.resolve(this.pk);
    }
    return this.getSchema().then(function () {
      return _this2.pk;
    });
  };
  /**
   * build sql
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */


  _class.prototype.buildSql = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(options, noParentheses) {
      var sql;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.parseOptions(options);

            case 2:
              options = _context3.sent;
              sql = this.db().buildSelectSql(options).trim();

              if (!noParentheses) {
                _context3.next = 6;
                break;
              }

              return _context3.abrupt('return', sql);

            case 6:
              return _context3.abrupt('return', '( ' + sql + ' )');

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function buildSql(_x3, _x4) {
      return _ref3.apply(this, arguments);
    }

    return buildSql;
  }();
  /**
   * parse options
   * @param oriOpts options
   * @param extraOptions
   * @param flag
   */


  _class.prototype.parseOptions = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(oriOpts, extraOptions) {
      var flag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var options, schema, keyReg, key, msg, optionsField, camelCase, keyArray, _iterator, _isArray, _i, _ref5, _key, fields, _iterator2, _isArray2, _i2, _ref6, field, where, _keyArray, _iterator3, _isArray3, _i3, _ref7, _key2;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              options = think.extend({}, this._options);

              if (think.isObject(oriOpts)) {
                options = think.extend(options, oriOpts);
              }
              if (extraOptions) {
                options = think.extend(options, extraOptions);
              }
              //clear options
              this._options = {};
              //get table name
              options.table = options.table || this.getTableName();

              options.tablePrefix = this.getTablePrefix();
              options.model = this.getModelName();

              //get table schema can not use table alias
              _context4.next = 9;
              return this.getSchema(options.table);

            case 9:
              schema = _context4.sent;


              //table alias
              if (options.alias) {
                options.table += ' AS ' + options.alias;
              }

              if (oriOpts !== undefined && !think.isObject(oriOpts)) {
                options = think.extend(options, this.parseWhereOptions(oriOpts));
              }
              //check where key

              if (!(options.where && !think.isEmpty(schema))) {
                _context4.next = 22;
                break;
              }

              keyReg = /^[\w\.\|\&]+$/;
              _context4.t0 = _regenerator2.default.keys(options.where);

            case 15:
              if ((_context4.t1 = _context4.t0()).done) {
                _context4.next = 22;
                break;
              }

              key = _context4.t1.value;

              if (keyReg.test(key)) {
                _context4.next = 20;
                break;
              }

              msg = new Error(think.locale('FIELD_KEY_NOT_VALID', key));
              return _context4.abrupt('return', think.reject(msg));

            case 20:
              _context4.next = 15;
              break;

            case 22:

              //field reverse
              if (options.field && options.fieldReverse) {
                //reset fieldReverse value
                options.fieldReverse = false;
                optionsField = options.field;

                options.field = (0, _keys2.default)(schema).filter(function (item) {
                  if (optionsField.indexOf(item) === -1) {
                    return item;
                  }
                });
              }

              if (!flag) {
                _context4.next = 82;
                break;
              }

              camelCase = config.camel_case || false;

              if (!camelCase) {
                _context4.next = 82;
                break;
              }

              if (!think.isEmpty(options.field)) {
                _context4.next = 46;
                break;
              }

              options.field = [];
              keyArray = (0, _keys2.default)(schema);
              _iterator = keyArray, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);

            case 30:
              if (!_isArray) {
                _context4.next = 36;
                break;
              }

              if (!(_i >= _iterator.length)) {
                _context4.next = 33;
                break;
              }

              return _context4.abrupt('break', 44);

            case 33:
              _ref5 = _iterator[_i++];
              _context4.next = 40;
              break;

            case 36:
              _i = _iterator.next();

              if (!_i.done) {
                _context4.next = 39;
                break;
              }

              return _context4.abrupt('break', 44);

            case 39:
              _ref5 = _i.value;

            case 40:
              _key = _ref5;

              options.field.push(_util2.default.format('`%s` AS `%s`', _key, think.camelCase(_key)));

            case 42:
              _context4.next = 30;
              break;

            case 44:
              _context4.next = 63;
              break;

            case 46:
              // make field camelCase
              fields = options.field;

              options.field = [];
              _iterator2 = fields, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);

            case 49:
              if (!_isArray2) {
                _context4.next = 55;
                break;
              }

              if (!(_i2 >= _iterator2.length)) {
                _context4.next = 52;
                break;
              }

              return _context4.abrupt('break', 63);

            case 52:
              _ref6 = _iterator2[_i2++];
              _context4.next = 59;
              break;

            case 55:
              _i2 = _iterator2.next();

              if (!_i2.done) {
                _context4.next = 58;
                break;
              }

              return _context4.abrupt('break', 63);

            case 58:
              _ref6 = _i2.value;

            case 59:
              field = _ref6;

              options.field.push(_util2.default.format('`%s` AS `%s`', field, think.camelCase(field)));

            case 61:
              _context4.next = 49;
              break;

            case 63:

              // make field camelCase in where condition
              where = options.where;

              options.where = {};

              if (think.isEmpty(where)) {
                _context4.next = 82;
                break;
              }

              _keyArray = (0, _keys2.default)(where);
              _iterator3 = _keyArray, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);

            case 68:
              if (!_isArray3) {
                _context4.next = 74;
                break;
              }

              if (!(_i3 >= _iterator3.length)) {
                _context4.next = 71;
                break;
              }

              return _context4.abrupt('break', 82);

            case 71:
              _ref7 = _iterator3[_i3++];
              _context4.next = 78;
              break;

            case 74:
              _i3 = _iterator3.next();

              if (!_i3.done) {
                _context4.next = 77;
                break;
              }

              return _context4.abrupt('break', 82);

            case 77:
              _ref7 = _i3.value;

            case 78:
              _key2 = _ref7;

              options.where[think.snakeCase(_key2)] = where[_key2];

            case 80:
              _context4.next = 68;
              break;

            case 82:
              return _context4.abrupt('return', this.optionsFilter(options, schema));

            case 83:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function parseOptions(_x5, _x6) {
      return _ref4.apply(this, arguments);
    }

    return parseOptions;
  }();
  /**
   * parse where options
   * @return {Object}
   */


  _class.prototype.parseWhereOptions = function parseWhereOptions(options) {
    if (think.isNumber(options) || think.isString(options)) {
      var _where;

      options += '';
      var where = (_where = {}, _where[this.pk] = options.indexOf(',') > -1 ? { IN: options } : options, _where);
      return { where: where };
    }
    return options;
  };
  /**
   * parse type
   * @param  {Object} data []
   * @param  {} key  []
   * @return {}      []
   */


  _class.prototype.parseType = function parseType(key, value) {
    var fieldType = (this.schema[key].type || '').toLowerCase();
    if (fieldType.indexOf('enum') > -1 || fieldType.indexOf('set') > -1) {
      return value;
    }
    if (fieldType.indexOf('bigint') === -1 && fieldType.indexOf('int') > -1) {
      return parseInt(value, 10) || 0;
    } else if (fieldType.indexOf('double') > -1 || fieldType.indexOf('float') > -1 || fieldType.indexOf('decimal') > -1) {
      return parseFloat(value) || 0.0;
    } else if (fieldType.indexOf('bool') > -1) {
      return !!value;
    }
    return value;
  };
  /**
   * parse data, after fields getted
   * @param  {} data []
   * @return {}      []
   */


  _class.prototype.parseData = function parseData(data) {
    var camelCase = config.camel_case;
    if (camelCase) {
      var tmpData = think.extend({}, data);
      data = {};
      var keyArray = (0, _keys2.default)(tmpData);
      for (var _iterator4 = keyArray, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator3.default)(_iterator4);;) {
        var _ref8;

        if (_isArray4) {
          if (_i4 >= _iterator4.length) break;
          _ref8 = _iterator4[_i4++];
        } else {
          _i4 = _iterator4.next();
          if (_i4.done) break;
          _ref8 = _i4.value;
        }

        var key = _ref8;

        data[think.snakeCase(key)] = tmpData[key];
      }
    }
    //deep clone data
    data = think.extend({}, data);
    for (var _key3 in data) {
      var val = data[_key3];
      //remove data not in fields
      if (!this.schema[_key3]) {
        delete data[_key3];
      } else if (think.isNumber(val) || think.isString(val) || think.isBoolean(val)) {
        data[_key3] = this.parseType(_key3, val);
      }
    }
    return this.dataFilter(data);
  };
  /**
   * add data
   * @param {Object} data    []
   * @param {Object} options []
   * @param {} replace []
   */


  _class.prototype.add = function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(data, options, replace) {
      var _think$extend;

      var parsedData, msg, db, insertId, copyData;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (options === true) {
                replace = true;
                options = {};
              }
              //copy data
              data = think.extend({}, this._data, data);
              //clear data
              this._data = {};

              _context5.next = 5;
              return this.parseOptions(options, {}, true);

            case 5:
              options = _context5.sent;
              parsedData = this.parseData(data);
              _context5.next = 9;
              return this.beforeAdd(parsedData, options);

            case 9:
              parsedData = _context5.sent;

              if (!think.isEmpty(parsedData)) {
                _context5.next = 13;
                break;
              }

              msg = new Error(think.locale('DATA_EMPTY'));
              return _context5.abrupt('return', think.reject(msg));

            case 13:
              db = this.db();
              _context5.next = 16;
              return db.add(parsedData, options, replace);

            case 16:
              insertId = parsedData[this.pk] = db.getLastInsertId();
              copyData = think.extend({}, data, parsedData, (_think$extend = {}, _think$extend[this.pk] = insertId, _think$extend));
              _context5.next = 20;
              return this.afterAdd(copyData, options);

            case 20:
              return _context5.abrupt('return', insertId);

            case 21:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function add(_x8, _x9, _x10) {
      return _ref9.apply(this, arguments);
    }

    return add;
  }();
  /**
   * add data when not exist
   * @param  {Object} data       []
   * @param  {Object} where      []
   * @return {}            []
   */


  _class.prototype.thenAdd = function () {
    var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(data, where) {
      var _ref12;

      var findData, _ref11, insertId;

      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this.where(where).find();

            case 2:
              findData = _context6.sent;

              if (think.isEmpty(findData)) {
                _context6.next = 5;
                break;
              }

              return _context6.abrupt('return', (_ref11 = {}, _ref11[this.pk] = findData[this.pk], _ref11.type = 'exist', _ref11));

            case 5:
              _context6.next = 7;
              return this.add(data);

            case 7:
              insertId = _context6.sent;
              return _context6.abrupt('return', (_ref12 = {}, _ref12[this.pk] = insertId, _ref12.type = 'add', _ref12));

            case 9:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function thenAdd(_x11, _x12) {
      return _ref10.apply(this, arguments);
    }

    return thenAdd;
  }();
  /**
   * update data when exist, otherwise add data
   * @return {id}
   */


  _class.prototype.thenUpdate = function () {
    var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(data, where) {
      var findData;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.where(where).find();

            case 2:
              findData = _context7.sent;

              if (!think.isEmpty(findData)) {
                _context7.next = 5;
                break;
              }

              return _context7.abrupt('return', this.add(data));

            case 5:
              _context7.next = 7;
              return this.where(where).update(data);

            case 7:
              return _context7.abrupt('return', findData[this.pk]);

            case 8:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function thenUpdate(_x13, _x14) {
      return _ref13.apply(this, arguments);
    }

    return thenUpdate;
  }();
  /**
   * add multi data
   * @param {Object} data    []
   * @param {} options []
   * @param {} replace []
   */


  _class.prototype.addMany = function () {
    var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(data, options, replace) {
      var _this3 = this;

      var promises, db, insertId, insertIds;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!(!think.isArray(data) || !think.isObject(data[0]))) {
                _context8.next = 2;
                break;
              }

              return _context8.abrupt('return', think.reject(new Error(think.locale('DATA_MUST_BE_ARRAY'))));

            case 2:
              if (options === true) {
                replace = true;
                options = {};
              }
              _context8.next = 5;
              return this.parseOptions(options, {}, true);

            case 5:
              options = _context8.sent;
              promises = data.map(function (item) {
                item = _this3.parseData(item);
                return _this3.beforeAdd(item, options);
              });
              _context8.next = 9;
              return _promise2.default.all(promises);

            case 9:
              data = _context8.sent;
              db = this.db();
              _context8.next = 13;
              return db.addMany(data, options, replace);

            case 13:
              insertId = db.getLastInsertId();
              insertIds = [];

              promises = data.map(function (item, i) {
                var id = insertId + i;
                if (_this3.config.type === 'sqlite') {
                  id = insertId - data.length + i + 1;
                }
                item[_this3.pk] = id;
                insertIds.push(id);
                return _this3.afterAdd(item, options);
              });
              _context8.next = 18;
              return _promise2.default.all(promises);

            case 18:
              data = _context8.sent;
              return _context8.abrupt('return', insertIds);

            case 20:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function addMany(_x15, _x16, _x17) {
      return _ref14.apply(this, arguments);
    }

    return addMany;
  }();
  /**
   * delete data
   * @param  {Object} options []
   * @return {Promise}         []
   */


  _class.prototype.delete = function () {
    var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(options) {
      var rows;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this.parseOptions(options, {}, true);

            case 2:
              options = _context9.sent;
              _context9.next = 5;
              return this.beforeDelete(options);

            case 5:
              options = _context9.sent;
              _context9.next = 8;
              return this.db().delete(options);

            case 8:
              rows = _context9.sent;
              _context9.next = 11;
              return this.afterDelete(options);

            case 11:
              return _context9.abrupt('return', rows);

            case 12:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function _delete(_x18) {
      return _ref15.apply(this, arguments);
    }

    return _delete;
  }();
  /**
   * update data
   * @param  {Object} data      []
   * @param  {Object} options   []
   * @param  {Boolean} ignoreWhere []
   * @return {Promise}          []
   */


  _class.prototype.update = function () {
    var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(data, options) {
      var parsedData, pk, _options$where, rows, copyData;

      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:

              data = think.extend({}, this._data, data);
              //clear data
              this._data = {};

              _context10.next = 4;
              return this.parseOptions(options, {}, true);

            case 4:
              options = _context10.sent;
              parsedData = this.parseData(data);

              //check where condition

              if (!think.isEmpty(options.where)) {
                _context10.next = 16;
                break;
              }

              _context10.next = 9;
              return this.getPk();

            case 9:
              pk = _context10.sent;

              if (!parsedData[pk]) {
                _context10.next = 15;
                break;
              }

              options.where = (_options$where = {}, _options$where[pk] = parsedData[pk], _options$where);
              delete parsedData[pk];
              _context10.next = 16;
              break;

            case 15:
              return _context10.abrupt('return', think.reject(new Error(think.locale('MISS_WHERE_CONDITION'))));

            case 16:
              _context10.next = 18;
              return this.beforeUpdate(parsedData, options);

            case 18:
              parsedData = _context10.sent;

              if (!think.isEmpty(parsedData)) {
                _context10.next = 21;
                break;
              }

              return _context10.abrupt('return', think.reject(new Error(think.locale('DATA_EMPTY'))));

            case 21:
              _context10.next = 23;
              return this.db().update(parsedData, options);

            case 23:
              rows = _context10.sent;
              copyData = think.extend({}, data, parsedData, options.where);
              _context10.next = 27;
              return this.afterUpdate(copyData, options);

            case 27:
              return _context10.abrupt('return', rows);

            case 28:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    function update(_x19, _x20) {
      return _ref16.apply(this, arguments);
    }

    return update;
  }();
  /**
   * update all data
   * @param  {Array} dataList []
   * @return {Promise}          []
   */


  _class.prototype.updateMany = function updateMany(dataList, options) {
    var _this4 = this;

    if (!think.isArray(dataList)) {
      //empty data and options
      this._options = {};
      this._data = {};

      return think.reject(new Error(think.locale('DATA_MUST_BE_ARRAY')));
    }
    var promises = dataList.map(function (data) {
      return _this4.update(data, options);
    });
    return _promise2.default.all(promises).then(function (data) {
      return data.reduce(function (a, b) {
        return a + b;
      });
    });
  };
  /**
   * increment field data
   * @return {Promise} []
   */


  _class.prototype.increment = function increment(field) {
    var _data;

    var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var data = (_data = {}, _data[field] = ['exp', '`' + field + '`+' + step], _data);
    return this.update(data);
  };
  /**
   * decrement field data
   * @return {} []
   */


  _class.prototype.decrement = function decrement(field) {
    var _data2;

    var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var data = (_data2 = {}, _data2[field] = ['exp', '`' + field + '`-' + step], _data2);
    return this.update(data);
  };
  /**
   * find data
   * @return Promise
   */


  _class.prototype.find = function () {
    var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(options) {
      var data;
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return this.parseOptions(options, { limit: 1 }, true);

            case 2:
              options = _context11.sent;
              _context11.next = 5;
              return this.beforeFind(options);

            case 5:
              options = _context11.sent;
              _context11.next = 8;
              return this.db().select(options);

            case 8:
              data = _context11.sent;
              return _context11.abrupt('return', this.afterFind(data[0] || {}, options));

            case 10:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, this);
    }));

    function find(_x23) {
      return _ref17.apply(this, arguments);
    }

    return find;
  }();
  /**
   * select
   * @return Promise
   */


  _class.prototype.select = function () {
    var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(options) {
      var data;
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return this.parseOptions(options, {}, true);

            case 2:
              options = _context12.sent;
              _context12.next = 5;
              return this.beforeSelect(options);

            case 5:
              options = _context12.sent;
              _context12.next = 8;
              return this.db().select(options);

            case 8:
              data = _context12.sent;
              return _context12.abrupt('return', this.afterSelect(data, options));

            case 10:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, this);
    }));

    function select(_x24) {
      return _ref18.apply(this, arguments);
    }

    return select;
  }();
  /**
   * select add
   * @param  {} options []
   * @return {Promise}         []
   */


  _class.prototype.selectAdd = function () {
    var _ref19 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(options) {
      var promise, Class, data, fields;
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              promise = _promise2.default.resolve(options);
              Class = module.exports.default || module.exports;

              if (options instanceof Class) {
                promise = options.parseOptions();
              }
              _context13.next = 5;
              return _promise2.default.all([this.parseOptions(), promise]);

            case 5:
              data = _context13.sent;
              fields = data[0].field || (0, _keys2.default)(this.schema);
              return _context13.abrupt('return', this.db().selectAdd(fields, data[0].table, data[1]));

            case 8:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, this);
    }));

    function selectAdd(_x25) {
      return _ref19.apply(this, arguments);
    }

    return selectAdd;
  }();
  /**
   * count select
   * @param  options
   * @param  pageFlag
   * @return promise
   */


  _class.prototype.countSelect = function () {
    var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(options, pageFlag) {
      var count, pk, table, order, numsPerPage, data, totalPage, result;
      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              count = void 0;

              if (think.isBoolean(options)) {
                pageFlag = options;
                options = {};
              } else if (think.isNumber(options)) {
                count = options;
                options = {};
              }

              _context14.next = 4;
              return this.parseOptions(options);

            case 4:
              options = _context14.sent;
              pk = this.pk;
              table = options.alias || this.getTableName();

              //delete table options avoid error when has alias

              delete options.table;
              //reserve and delete the possible order option
              order = options.order;

              delete options.order;

              if (count) {
                _context14.next = 14;
                break;
              }

              _context14.next = 13;
              return this.options(options).count(table + '.' + pk);

            case 13:
              count = _context14.sent;

            case 14:

              options.limit = options.limit || [0, this.config.nums_per_page];
              //recover the deleted possible order
              options.order = order;
              numsPerPage = options.limit[1];
              //get page options

              data = { numsPerPage: numsPerPage };
              totalPage = Math.ceil(count / data.numsPerPage);


              data.currentPage = parseInt(options.limit[0] / options.limit[1] + 1);

              if (think.isBoolean(pageFlag) && data.currentPage > totalPage) {
                if (pageFlag) {
                  data.currentPage = 1;
                  options.limit = [0, numsPerPage];
                } else {
                  data.currentPage = totalPage;
                  options.limit = [(totalPage - 1) * numsPerPage, numsPerPage];
                }
              }
              result = think.extend({ count: count, totalPages: totalPage }, data);


              if (options.cache && options.cache.key) {
                options.cache.key += '_count';
              }

              if (!count) {
                _context14.next = 29;
                break;
              }

              _context14.next = 26;
              return this.select(options);

            case 26:
              _context14.t0 = _context14.sent;
              _context14.next = 30;
              break;

            case 29:
              _context14.t0 = [];

            case 30:
              result.data = _context14.t0;
              return _context14.abrupt('return', result);

            case 32:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee14, this);
    }));

    function countSelect(_x26, _x27) {
      return _ref20.apply(this, arguments);
    }

    return countSelect;
  }();
  /**
   * get field data
   * @return {[type]} [description]
   */


  _class.prototype.getField = function () {
    var _ref21 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(field, one) {
      var options, data, multi, fields, result;
      return _regenerator2.default.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return this.parseOptions({ 'field': field });

            case 2:
              options = _context15.sent;

              if (think.isNumber(one)) {
                options.limit = one;
              } else if (one === true) {
                options.limit = 1;
              }
              _context15.next = 6;
              return this.db().select(options);

            case 6:
              data = _context15.sent;
              multi = field.indexOf(',') > -1 && field.indexOf('(') === -1;

              if (!multi) {
                _context15.next = 16;
                break;
              }

              fields = field.split(/\s*,\s*/);
              result = {};

              fields.forEach(function (item) {
                return result[item] = [];
              });
              data.every(function (item) {
                fields.forEach(function (fItem) {
                  if (one === true) {
                    result[fItem] = item[fItem];
                  } else {
                    result[fItem].push(item[fItem]);
                  }
                });
                return one !== true;
              });
              return _context15.abrupt('return', result);

            case 16:
              data = data.map(function (item) {
                for (var key in item) {
                  return item[key];
                }
              });
              return _context15.abrupt('return', one === true ? data[0] : data);

            case 18:
            case 'end':
              return _context15.stop();
          }
        }
      }, _callee15, this);
    }));

    function getField(_x28, _x29) {
      return _ref21.apply(this, arguments);
    }

    return getField;
  }();
  /**
   * get quote field
   * @param  {String} field []
   * @return {String}       []
   */


  _class.prototype._getQuoteField = function () {
    var _ref22 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(field) {
      return _regenerator2.default.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              if (!field) {
                _context16.next = 2;
                break;
              }

              return _context16.abrupt('return', /^\w+$/.test(field) ? '`' + field + '`' : field);

            case 2:
              _context16.next = 4;
              return this.getPk();

            case 4:
              _context16.t0 = _context16.sent;

              if (_context16.t0) {
                _context16.next = 7;
                break;
              }

              _context16.t0 = '*';

            case 7:
              return _context16.abrupt('return', _context16.t0);

            case 8:
            case 'end':
              return _context16.stop();
          }
        }
      }, _callee16, this);
    }));

    function _getQuoteField(_x30) {
      return _ref22.apply(this, arguments);
    }

    return _getQuoteField;
  }();
  /**
   * get count
   * @param  {String} field []
   * @return {Promise}       []
   */


  _class.prototype.count = function () {
    var _ref23 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17(field) {
      return _regenerator2.default.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return this._getQuoteField(field);

            case 2:
              field = _context17.sent;
              return _context17.abrupt('return', this.getField('COUNT(' + field + ') AS think_count', true));

            case 4:
            case 'end':
              return _context17.stop();
          }
        }
      }, _callee17, this);
    }));

    function count(_x31) {
      return _ref23.apply(this, arguments);
    }

    return count;
  }();
  /**
   * get sum
   * @param  {String} field []
   * @return {Promise}       []
   */


  _class.prototype.sum = function () {
    var _ref24 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee18(field) {
      return _regenerator2.default.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return this._getQuoteField(field);

            case 2:
              field = _context18.sent;
              return _context18.abrupt('return', this.getField('SUM(' + field + ') AS think_sum', true));

            case 4:
            case 'end':
              return _context18.stop();
          }
        }
      }, _callee18, this);
    }));

    function sum(_x32) {
      return _ref24.apply(this, arguments);
    }

    return sum;
  }();
  /**
   * get min value
   * @param  {String} field []
   * @return {Promise}       []
   */


  _class.prototype.min = function () {
    var _ref25 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee19(field) {
      return _regenerator2.default.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return this._getQuoteField(field);

            case 2:
              field = _context19.sent;
              return _context19.abrupt('return', this.getField('MIN(' + field + ') AS think_min', true));

            case 4:
            case 'end':
              return _context19.stop();
          }
        }
      }, _callee19, this);
    }));

    function min(_x33) {
      return _ref25.apply(this, arguments);
    }

    return min;
  }();
  /**
   * get max valud
   * @param  {String} field []
   * @return {Promise}       []
   */


  _class.prototype.max = function () {
    var _ref26 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee20(field) {
      return _regenerator2.default.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return this._getQuoteField(field);

            case 2:
              field = _context20.sent;
              return _context20.abrupt('return', this.getField('MAX(' + field + ') AS think_max', true));

            case 4:
            case 'end':
              return _context20.stop();
          }
        }
      }, _callee20, this);
    }));

    function max(_x34) {
      return _ref26.apply(this, arguments);
    }

    return max;
  }();
  /**
   * get value average
   * @param  {String} field []
   * @return {Promise}       []
   */


  _class.prototype.avg = function () {
    var _ref27 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee21(field) {
      return _regenerator2.default.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return this._getQuoteField(field);

            case 2:
              field = _context21.sent;
              return _context21.abrupt('return', this.getField('AVG(' + field + ') AS think_avg', true));

            case 4:
            case 'end':
              return _context21.stop();
          }
        }
      }, _callee21, this);
    }));

    function avg(_x35) {
      return _ref27.apply(this, arguments);
    }

    return avg;
  }();
  /**
   * query
   * @return {Promise} []
   */


  _class.prototype.query = function query() {
    var sql = this.parseSql.apply(this, arguments);
    return this.db().select(sql, this._options.cache);
  };
  /**
   * execute sql
   * @param  {[type]} sql   [description]
   * @param  {[type]} parse [description]
   * @return {[type]}       [description]
   */


  _class.prototype.execute = function execute() {
    var sql = this.parseSql.apply(this, arguments);
    return this.db().execute(sql);
  };
  /**
   * parse sql
   * @return promise [description]
   */


  _class.prototype.parseSql = function parseSql() {
    var _this5 = this;

    var sql = _util2.default.format.apply(_util2.default, arguments);
    //replace table name
    return sql.replace(/\s__([A-Z]+)__\s/g, function (a, b) {
      if (b === 'TABLE') {
        return ' `' + _this5.getTableName() + '` ';
      }
      return ' `' + _this5.getTablePrefix() + b.toLowerCase() + '` ';
    });
  };
  /**
   * start transaction
   * @return {Promise} []
   */


  _class.prototype.startTrans = function startTrans() {
    return this.db(true).startTrans();
  };
  /**
   * commit transcation
   * @return {Promise} []
   */


  _class.prototype.commit = function () {
    var _ref28 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee22() {
      var data;
      return _regenerator2.default.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return this.db().commit();

            case 2:
              data = _context22.sent;

              this.close();
              this._db = null;
              return _context22.abrupt('return', data);

            case 6:
            case 'end':
              return _context22.stop();
          }
        }
      }, _callee22, this);
    }));

    function commit() {
      return _ref28.apply(this, arguments);
    }

    return commit;
  }();
  /**
   * rollback transaction
   * @return {Promise} []
   */


  _class.prototype.rollback = function () {
    var _ref29 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee23() {
      var data;
      return _regenerator2.default.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return this.db().rollback();

            case 2:
              data = _context23.sent;

              this.close();
              this._db = null;
              return _context23.abrupt('return', data);

            case 6:
            case 'end':
              return _context23.stop();
          }
        }
      }, _callee23, this);
    }));

    function rollback() {
      return _ref29.apply(this, arguments);
    }

    return rollback;
  }();
  /**
   * transaction exec functions
   * @param  {Function} fn [exec function]
   * @return {Promise}      []
   */


  _class.prototype.transaction = function () {
    var _ref30 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee24(fn) {
      var result;
      return _regenerator2.default.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              result = void 0;
              _context24.next = 3;
              return this.startTrans();

            case 3:
              _context24.prev = 3;
              _context24.next = 6;
              return think.co(fn());

            case 6:
              result = _context24.sent;
              _context24.next = 9;
              return this.commit();

            case 9:
              _context24.next = 15;
              break;

            case 11:
              _context24.prev = 11;
              _context24.t0 = _context24['catch'](3);
              _context24.next = 15;
              return this.rollback();

            case 15:
              return _context24.abrupt('return', result);

            case 16:
            case 'end':
              return _context24.stop();
          }
        }
      }, _callee24, this, [[3, 11]]);
    }));

    function transaction(_x36) {
      return _ref30.apply(this, arguments);
    }

    return transaction;
  }();

  return _class;
}(_base2.default);

exports.default = _class;