'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _base = require('./_base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * mongodb model
 */
var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  /**
   * get primary key
   * @return {Promise} []
   */
  _class.prototype.getPk = function getPk() {
    this.pk = '_id';
    return _promise2.default.resolve(this.pk);
  };
  /**
   * create index from this.indexes
   * http://docs.mongodb.org/manual/core/indexes-introduction/
   * @return {Promise} []
   */


  _class.prototype._createIndexes = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var _this2 = this;

      var storeKey, isSet, indexes;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              storeKey = 'mongo_' + this.getTableName() + '_indexes';
              isSet = thinkCache(thinkCache.TABLE, storeKey);

              if (!isSet) {
                _context.next = 4;
                break;
              }

              return _context.abrupt('return');

            case 4:
              indexes = this.indexes;

              if (!think.isEmpty(indexes)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt('return');

            case 7:
              return _context.abrupt('return', think.await(storeKey, function () {
                var promises = [];
                for (var key in indexes) {
                  var value = indexes[key];
                  if (think.isObject(value)) {
                    var options = {};
                    var val = {};
                    for (var k in value) {
                      //key start with $ is options
                      if (k[0] === '$') {
                        options[k.slice(1)] = value[k];
                      } else {
                        val[k] = value[k];
                      }
                    }
                    //if value is empty, auto add key itself
                    if (think.isEmpty(val)) {
                      val[key] = 1;
                    }
                    promises.push(_this2.createIndex(val, options));
                  } else {
                    var _value;

                    value = (_value = {}, _value[key] = value, _value);
                    promises.push(_this2.createIndex(value));
                  }
                }
                return _promise2.default.all(promises).then(function () {
                  thinkCache(thinkCache.TABLE, storeKey, 1);
                });
              }));

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function _createIndexes() {
      return _ref.apply(this, arguments);
    }

    return _createIndexes;
  }();
  /**
   * parse options
   * @param  {Object} options []
   * @return {Promise}         []
   */


  _class.prototype.parseOptions = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(oriOpts, extraOptions) {
      var options;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = think.extend({}, this._options);

              if (think.isObject(oriOpts)) {
                options = think.extend(options, oriOpts, extraOptions);
              }
              //clear options
              this._options = {};
              //get table name
              options.table = options.table || this.getTableName();

              options.tablePrefix = this.tablePrefix;
              options.model = this.getModelName();

              if (!think.isObject(oriOpts)) {
                options = think.extend(options, oriOpts, extraOptions);
              }

              _context2.next = 9;
              return this._createIndexes();

            case 9:
              return _context2.abrupt('return', this.optionsFilter(options));

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function parseOptions(_x, _x2) {
      return _ref2.apply(this, arguments);
    }

    return parseOptions;
  }();
  /**
   * parse data
   * @param  {Object} data []
   * @return {Object}      []
   */


  _class.prototype.parseData = function parseData(data) {
    return data;
  };
  /**
   * get table connection
   * @return {Promise} []
   */


  _class.prototype.collection = function collection(table) {
    table = table || this.getTableName();
    return this.db().collection(table);
  };
  /**
   * add data
   * @param {Object} data    []
   * @param {Object} options []
   */


  _class.prototype.add = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(data, options) {
      var msg;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              //copy data
              data = think.extend({}, this._data, data);
              //clear data
              this._data = {};

              if (!think.isEmpty(data)) {
                _context3.next = 5;
                break;
              }

              msg = new Error(think.locale('DATA_EMPTY'));
              return _context3.abrupt('return', think.reject(msg));

            case 5:
              _context3.next = 7;
              return this.parseOptions(options);

            case 7:
              options = _context3.sent;
              _context3.next = 10;
              return this.beforeAdd(data, options);

            case 10:
              data = _context3.sent;

              data = this.parseData(data);
              _context3.next = 14;
              return this.db().add(data, options);

            case 14:
              _context3.next = 16;
              return this.afterAdd(data, options);

            case 16:
              return _context3.abrupt('return', this.db().getLastInsertId());

            case 17:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function add(_x3, _x4) {
      return _ref3.apply(this, arguments);
    }

    return add;
  }();
  /**
  * then add
  * @param  {Object} data       []
  * @param  {Object} where      []
  * @return {}            []
  */


  _class.prototype.thenAdd = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(data, where) {
      var _ref6;

      var findData, _ref5, insertId;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.where(where).find();

            case 2:
              findData = _context4.sent;

              if (think.isEmpty(findData)) {
                _context4.next = 5;
                break;
              }

              return _context4.abrupt('return', (_ref5 = {}, _ref5[this.pk] = findData[this.pk], _ref5.type = 'exist', _ref5));

            case 5:
              _context4.next = 7;
              return this.add(data);

            case 7:
              insertId = _context4.sent;
              return _context4.abrupt('return', (_ref6 = {}, _ref6[this.pk] = insertId, _ref6.type = 'add', _ref6));

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function thenAdd(_x5, _x6) {
      return _ref4.apply(this, arguments);
    }

    return thenAdd;
  }();
  /**
   * update data when exist, otherwise add data
   * @return {id}
   */


  _class.prototype.thenUpdate = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(data, where) {
      var findData;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.where(where).find();

            case 2:
              findData = _context5.sent;

              if (!think.isEmpty(findData)) {
                _context5.next = 5;
                break;
              }

              return _context5.abrupt('return', this.add(data));

            case 5:
              _context5.next = 7;
              return this.where(where).update(data);

            case 7:
              return _context5.abrupt('return', findData[this.pk]);

            case 8:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function thenUpdate(_x7, _x8) {
      return _ref7.apply(this, arguments);
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
    var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(data, options) {
      var err;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(!think.isArray(data) || !think.isObject(data[0]))) {
                _context6.next = 3;
                break;
              }

              err = new Error(think.locale('DATA_MUST_BE_ARRAY'));
              return _context6.abrupt('return', think.reject(err));

            case 3:
              _context6.next = 5;
              return this.parseOptions(options);

            case 5:
              options = _context6.sent;
              _context6.next = 8;
              return this.beforeAdd(data, options);

            case 8:
              data = _context6.sent;
              _context6.next = 11;
              return this.db().addMany(data, options);

            case 11:
              _context6.next = 13;
              return this.afterAdd(data, options);

            case 13:
              return _context6.abrupt('return', this.db().getLastInsertId());

            case 14:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function addMany(_x9, _x10) {
      return _ref8.apply(this, arguments);
    }

    return addMany;
  }();
  /**
   * delete data
   * @return {} []
   */


  _class.prototype.delete = function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(options) {
      var data;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.parseOptions(options);

            case 2:
              options = _context7.sent;
              _context7.next = 5;
              return this.beforeDelete(options);

            case 5:
              options = _context7.sent;
              _context7.next = 8;
              return this.db().delete(options);

            case 8:
              data = _context7.sent;
              _context7.next = 11;
              return this.afterDelete(options);

            case 11:
              return _context7.abrupt('return', data.result.n || 0);

            case 12:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function _delete(_x11) {
      return _ref9.apply(this, arguments);
    }

    return _delete;
  }();
  /**
   * update data
   * @return {Promise} []
   */


  _class.prototype.update = function () {
    var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(data, options, ignoreDefault) {
      var pk, _where, result;

      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (think.isBoolean(options)) {
                ignoreDefault = options;
                options = {};
              }
              _context8.next = 3;
              return this.parseOptions(options);

            case 3:
              options = _context8.sent;
              _context8.next = 6;
              return this.getPk();

            case 6:
              pk = _context8.sent;

              if (data[pk]) {
                this.where((_where = {}, _where[pk] = data[pk], _where));
                delete data[pk];
              }

              if (!(ignoreDefault !== true)) {
                _context8.next = 12;
                break;
              }

              _context8.next = 11;
              return this.beforeUpdate(data, options);

            case 11:
              data = _context8.sent;

            case 12:
              _context8.next = 14;
              return this.db().update(data, options);

            case 14:
              result = _context8.sent;
              _context8.next = 17;
              return this.afterUpdate(data, options);

            case 17:
              return _context8.abrupt('return', result.result.nModified || 0);

            case 18:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function update(_x12, _x13, _x14) {
      return _ref10.apply(this, arguments);
    }

    return update;
  }();
  /**
   * update many data
   * @param  {Promise} dataList []
   * @return {Promise}          []
   */


  _class.prototype.updateMany = function () {
    var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(dataList, options) {
      var _this3 = this;

      var promises;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              if (think.isArray(dataList)) {
                _context9.next = 2;
                break;
              }

              return _context9.abrupt('return', think.reject(new Error(think.locale('DATA_MUST_BE_ARRAY'))));

            case 2:
              promises = dataList.map(function (data) {
                return _this3.update(data, options);
              });
              return _context9.abrupt('return', _promise2.default.all(promises).then(function (data) {
                return data.reduce(function (a, b) {
                  return a + b;
                });
              }));

            case 4:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function updateMany(_x15, _x16) {
      return _ref11.apply(this, arguments);
    }

    return updateMany;
  }();
  /**
   * select data
   * @return {Promise} []
   */


  _class.prototype.select = function () {
    var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(options) {
      var data;
      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return this.parseOptions(options);

            case 2:
              options = _context10.sent;
              _context10.next = 5;
              return this.beforeSelect(options);

            case 5:
              options = _context10.sent;
              _context10.next = 8;
              return this.db().select(options);

            case 8:
              data = _context10.sent;
              return _context10.abrupt('return', this.afterSelect(data, options));

            case 10:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    function select(_x17) {
      return _ref12.apply(this, arguments);
    }

    return select;
  }();
  /**
   * count select
   * @param  {Object} options  []
   * @param  {Boolean} pageFlag []
   * @return {Promise}          []
   */


  _class.prototype.countSelect = function () {
    var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(options, pageFlag) {
      var count, numsPerPage, data, totalPage, result;
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              count = void 0;

              if (think.isBoolean(options)) {
                pageFlag = options;
                options = {};
              } else if (think.isNumber(options)) {
                count = options;
                options = {};
              }

              _context11.next = 4;
              return this.parseOptions(options);

            case 4:
              options = _context11.sent;

              if (count) {
                _context11.next = 9;
                break;
              }

              _context11.next = 8;
              return this.options(options).count();

            case 8:
              count = _context11.sent;

            case 9:

              options.limit = options.limit || [0, this.config.nums_per_page];

              numsPerPage = options.limit[1];
              //get page options

              data = { numsPerPage: numsPerPage };

              data.currentPage = parseInt(options.limit[0] / options.limit[1] + 1);
              totalPage = Math.ceil(count / data.numsPerPage);

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

              if (!count) {
                _context11.next = 22;
                break;
              }

              _context11.next = 19;
              return this.select(options);

            case 19:
              _context11.t0 = _context11.sent;
              _context11.next = 23;
              break;

            case 22:
              _context11.t0 = [];

            case 23:
              result.data = _context11.t0;
              return _context11.abrupt('return', result);

            case 25:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, this);
    }));

    function countSelect(_x18, _x19) {
      return _ref13.apply(this, arguments);
    }

    return countSelect;
  }();
  /**
   * select one row data
   * @param  {Object} options []
   * @return {Promise}         []
   */


  _class.prototype.find = function () {
    var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(options) {
      var data;
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return this.parseOptions(options, { limit: 1 });

            case 2:
              options = _context12.sent;
              _context12.next = 5;
              return this.beforeFind(options);

            case 5:
              options = _context12.sent;
              _context12.next = 8;
              return this.db().select(options);

            case 8:
              data = _context12.sent;
              return _context12.abrupt('return', this.afterFind(data[0] || {}, options));

            case 10:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, this);
    }));

    function find(_x20) {
      return _ref14.apply(this, arguments);
    }

    return find;
  }();
  /**
   * increment field data
   * @param  {String} field []
   * @param  {Number} step  []
   * @return {Promise}       []
   */


  _class.prototype.increment = function () {
    var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(field) {
      var _$inc;

      var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var options;
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return this.parseOptions();

            case 2:
              options = _context13.sent;
              return _context13.abrupt('return', this.db().update({
                $inc: (_$inc = {}, _$inc[field] = step, _$inc)
              }, options).then(function (data) {
                return data.result.n;
              }));

            case 4:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, this);
    }));

    function increment(_x21) {
      return _ref15.apply(this, arguments);
    }

    return increment;
  }();
  /**
   * decrement field data
   * @param  {String} field []
   * @param  {Number} step  []
   * @return {Promise}       []
   */


  _class.prototype.decrement = function () {
    var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(field) {
      var _$inc2;

      var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var options;
      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return this.parseOptions();

            case 2:
              options = _context14.sent;
              return _context14.abrupt('return', this.db().update({
                $inc: (_$inc2 = {}, _$inc2[field] = 0 - step, _$inc2)
              }, options).then(function (data) {
                return data.result.n;
              }));

            case 4:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee14, this);
    }));

    function decrement(_x23) {
      return _ref16.apply(this, arguments);
    }

    return decrement;
  }();
  /**
   * get count 
   * @param  {String} field []
   * @return {Promise}       []
   */


  _class.prototype.count = function () {
    var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(field) {
      var options;
      return _regenerator2.default.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              this.field(field);
              _context15.next = 3;
              return this.parseOptions();

            case 3:
              options = _context15.sent;
              return _context15.abrupt('return', this.db().count(options));

            case 5:
            case 'end':
              return _context15.stop();
          }
        }
      }, _callee15, this);
    }));

    function count(_x25) {
      return _ref17.apply(this, arguments);
    }

    return count;
  }();
  /**
   * get sum
   * @param  {String} field []
   * @return {Promise}       []
   */


  _class.prototype.sum = function () {
    var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(field) {
      var options;
      return _regenerator2.default.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              this.field(field);
              _context16.next = 3;
              return this.parseOptions();

            case 3:
              options = _context16.sent;
              return _context16.abrupt('return', this.db().sum(options));

            case 5:
            case 'end':
              return _context16.stop();
          }
        }
      }, _callee16, this);
    }));

    function sum(_x26) {
      return _ref18.apply(this, arguments);
    }

    return sum;
  }();
  /**
   * aggregate
   * http://docs.mongodb.org/manual/reference/sql-aggregation-comparison/
   * @param  {} options []
   * @return {}         []
   */


  _class.prototype.aggregate = function aggregate(options) {
    return this.db().aggregate(this.getTableName(), options);
  };
  /**
   * map reduce
   * Examples: http://docs.mongodb.org/manual/tutorial/map-reduce-examples/
   * @param  {Function} map    []
   * @param  {Function} reduce []
   * @param  {Object} out    []
   * @return {Promise}        []
   */


  _class.prototype.mapReduce = function mapReduce(map, reduce, out) {
    return this.collection().then(function (collection) {
      return collection.mapReduce(map, reduce, out);
    });
  };
  /**
   * create indexes
   * @param  {Object} indexes []
   * @return {Promise}         []
   */


  _class.prototype.createIndex = function createIndex(indexes, options) {
    return this.db().ensureIndex(this.getTableName(), indexes, options);
  };
  /**
   * get collection indexes
   * @return {Promise} []
   */


  _class.prototype.getIndexes = function getIndexes() {
    return this.collection().then(function (collection) {
      return collection.indexes();
    });
  };

  return _class;
}(_base2.default);

exports.default = _class;