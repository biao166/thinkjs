'use strict';

//model relation type

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

think.model.HAS_ONE = 1;
think.model.BELONG_TO = 2;
think.model.HAS_MANY = 3;
think.model.MANY_TO_MANY = 4;
/**
 * relation model
 * @type {Class}
 */

var _class = function (_think$model$base) {
  (0, _inherits3.default)(_class, _think$model$base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _think$model$base.apply(this, arguments));
  }

  /**
   * init
   * @param  {String} name   []
   * @param  {Object} config []
   * @return {}        []
   */
  _class.prototype.init = function init() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _think$model$base.prototype.init.call(this, name, config);
    /**
     * @example
     'profile': {
        type: think.model.HAS_ONE, //relation type
        model: 'profile', //model name
        name: 'profile', //data name
        key: 'id',
        fKey: 'user_id', //forign key
        field: 'id,name',
        where: 'name=xx',
        order: '',
        limit: ''
      }
     */
    if (this.relation === undefined) {
      this.relation = {};
    }
    this._relationName = true;
  };
  /**
   * set relation
   * @param {String} name []
   */


  _class.prototype.setRelation = function setRelation(name, value) {
    //ignore undefined name
    if (name === undefined) {
      return this;
    }

    //config relation data
    if (think.isObject(name) || !think.isEmpty(value)) {
      var _ref;

      var obj = think.isObject(name) ? name : (_ref = {}, _ref[name] = value, _ref);
      think.extend(this.relation, obj);
      return this;
    }

    if (think.isBoolean(name)) {
      this._relationName = name;
      return this;
    }

    //enable relation
    if (think.isString(name)) {
      name = name.split(/\s*,\s*/);
    }

    name = name || [];
    //filter relation name
    if (value === false) {
      var filterRelations = (0, _keys2.default)(this.relation).filter(function (item) {
        return name.indexOf(item) === -1;
      });
      name = filterRelations;
    }

    this._relationName = name;
    return this;
  };
  /**
   * after find
   * @param  {Object} data []
   * @return {Promise}      []
   */


  _class.prototype.afterFind = function afterFind(data, options) {
    return this.getRelation(data, options);
  };
  /**
   * after select
   * @param  {Object} data []
   * @return {}      []
   */


  _class.prototype.afterSelect = function afterSelect(data, options) {
    return this.getRelation(data, options);
  };
  /**
   * get relation data
   * @param  {}  data       []
   * @param  Boolean isDataList
   * @return {}
   */


  _class.prototype.getRelation = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var pk, promises;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(think.isEmpty(data) || think.isEmpty(this.relation) || think.isEmpty(this._relationName))) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', data);

            case 2:
              _context.next = 4;
              return this.getPk();

            case 4:
              pk = _context.sent;
              promises = (0, _keys2.default)(this.relation).map(function (key) {
                //relation is disabled
                if (_this2._relationName !== true && _this2._relationName.indexOf(key) === -1) {
                  return;
                }
                var item = _this2.relation[key];
                if (!think.isObject(item)) {
                  item = { type: item };
                }
                //get relation model options
                var opts = think.extend({
                  name: key,
                  type: think.model.HAS_ONE,
                  key: pk,
                  fKey: _this2.name + '_id',
                  relation: true
                }, item);

                //relation data is exist
                var itemData = think.isArray(data) ? data[0] : data;
                var relData = itemData[opts.name];
                if (think.isArray(relData) || think.isObject(relData)) {
                  return;
                }

                var modelOpts = think.extend({}, {
                  cache: options.cache
                });
                //remove cache key
                if (modelOpts.cache && modelOpts.cache.key) {
                  delete modelOpts.cache.key;
                }

                ['where', 'field', 'order', 'limit', 'page'].forEach(function (optItem) {
                  if (think.isFunction(item[optItem])) {
                    modelOpts[optItem] = item[optItem](_this2);
                  } else {
                    modelOpts[optItem] = item[optItem];
                  }
                });
                //get relation model instance
                var model = _this2.model(item.model || key).options(modelOpts);

                //set relation to relate model
                if (model.setRelation) {
                  model.setRelation(opts.relation, false);
                }

                opts.model = model;

                switch (item.type) {
                  case think.model.BELONG_TO:
                    // if(item.model) {
                    //   delete item.model;
                    // }
                    opts = think.extend(opts, {
                      key: opts.model.getModelName() + '_id',
                      fKey: 'id'
                    }, item);
                    opts.model = model; //get ref back
                    return _this2._getBelongsToRelation(data, opts, options);
                  case think.model.HAS_MANY:
                    return _this2._getHasManyRelation(data, opts, options);
                  case think.model.MANY_TO_MANY:
                    return _this2._getManyToManyRelation(data, opts, options);
                  default:
                    return _this2._getHasOneRelation(data, opts, options);
                }
              });
              _context.next = 8;
              return _promise2.default.all(promises);

            case 8:
              return _context.abrupt('return', data);

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getRelation(_x3) {
      return _ref2.apply(this, arguments);
    }

    return getRelation;
  }();
  /**
   * has one
   * @param  {Object} data    []
   * @param  {Object} mapOpts []
   * @return {Promise}         []
   */


  _class.prototype._getHasOneRelation = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(data, mapOpts /*, options*/) {
      var where, mapData;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              where = this.parseRelationWhere(data, mapOpts);
              // if (where === false) {
              //   return {};
              // }

              _context2.next = 3;
              return mapOpts.model.where(where).select();

            case 3:
              mapData = _context2.sent;
              return _context2.abrupt('return', this.parseRelationData(data, mapData, mapOpts));

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function _getHasOneRelation(_x5, _x6) {
      return _ref3.apply(this, arguments);
    }

    return _getHasOneRelation;
  }();
  /**
   * belongs to
   * @param  {Object} data    []
   * @param  {Object} mapOpts []
   * @return {Promise}         []
   */


  _class.prototype._getBelongsToRelation = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(data, mapOpts /*, options*/) {
      var where, mapData;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              where = this.parseRelationWhere(data, mapOpts);
              _context3.next = 3;
              return mapOpts.model.where(where).select();

            case 3:
              mapData = _context3.sent;
              return _context3.abrupt('return', this.parseRelationData(data, mapData, mapOpts));

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function _getBelongsToRelation(_x7, _x8) {
      return _ref4.apply(this, arguments);
    }

    return _getBelongsToRelation;
  }();
  /**
   * has many
   * @param  {Object} data    []
   * @param  {Object} mapOpts []
   * @return {Promise}         []
   */


  _class.prototype._getHasManyRelation = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(data, mapOpts /*, options*/) {
      var where, mapData;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              where = this.parseRelationWhere(data, mapOpts);
              // if (where === false) {
              //   return [];
              // }

              _context4.next = 3;
              return mapOpts.model.where(where).select();

            case 3:
              mapData = _context4.sent;
              return _context4.abrupt('return', this.parseRelationData(data, mapData, mapOpts, true));

            case 5:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function _getHasManyRelation(_x9, _x10) {
      return _ref5.apply(this, arguments);
    }

    return _getHasManyRelation;
  }();
  /**
   * many to many
   * @param  {Object} data    []
   * @param  {Object} mapOpts []
   * @param  {Object} options []
   * @return {Promise}         []
   */


  _class.prototype._getManyToManyRelation = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(data, mapOpts, options) {
      var where, sql, field, pk, table, table1, where1, rkey, where2, mapData;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              where = this.parseRelationWhere(data, mapOpts);
              sql = 'SELECT %s, a.%s FROM %s as a, %s as b %s AND a.%s=b.%s %s';
              field = this.db().parseField(mapOpts.field).split(',').map(function (item) {
                return 'b.' + item;
              }).join(',');
              _context5.next = 5;
              return mapOpts.model.getPk();

            case 5:
              pk = _context5.sent;
              table = mapOpts.rModel;

              if (table) {
                if (this.tablePrefix && table.indexOf(this.tablePrefix) !== 0) {
                  table = this.tablePrefix + table;
                }
              } else {
                table = this.getRelationTableName(mapOpts.model);
              }

              table1 = mapOpts.model.getTableName();
              where1 = this.db().parseWhere(where);
              rkey = mapOpts.rfKey || mapOpts.model.getModelName() + '_id';
              where2 = mapOpts.where ? ' AND ' + this.db().parseWhere(mapOpts.where).trim().slice(6) : '';

              sql = this.parseSql(sql, field, mapOpts.fKey, table, table1, where1, rkey, pk, where2);
              _context5.next = 15;
              return this.db().select(sql, options.cache);

            case 15:
              mapData = _context5.sent;
              return _context5.abrupt('return', this.parseRelationData(data, mapData, mapOpts, true));

            case 17:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function _getManyToManyRelation(_x11, _x12, _x13) {
      return _ref6.apply(this, arguments);
    }

    return _getManyToManyRelation;
  }();
  /**
   * get relation table name
   * @param  {Object} model []
   * @return {}       []
   */


  _class.prototype.getRelationTableName = function getRelationTableName(model) {
    var table = [this.tablePrefix, this.tableName || this.name, '_', model.getModelName()].join('');
    return table.toLowerCase();
  };
  /**
   * get relation model
   * @param  {} model []
   * @return {}       []
   */


  _class.prototype.getRelationModel = function getRelationModel(model) {
    var name = (this.tableName || this.name) + '_' + model.getModelName();
    return this.model(name);
  };
  /**
   * parese relation where
   * @param  {Object} data    []
   * @param  {Object} mapOpts []
   * @return {}         []
   */


  _class.prototype.parseRelationWhere = function parseRelationWhere(data, mapOpts) {
    var _ref8;

    if (think.isArray(data)) {
      var _ref7;

      var keys = {};
      data.forEach(function (item) {
        keys[item[mapOpts.key]] = 1;
      });
      var value = (0, _keys2.default)(keys);
      return _ref7 = {}, _ref7[mapOpts.fKey] = ['IN', value], _ref7;
    }
    return _ref8 = {}, _ref8[mapOpts.fKey] = data[mapOpts.key], _ref8;
  };
  /**
   * parse relation data
   * @param  {Object}  data     []
   * @param  {}  mapData  []
   * @param  {}  mapOpts  []
   * @param  {Boolean} isArrMap []
   * @return {}           []
   */


  _class.prototype.parseRelationData = function parseRelationData(data, mapData, mapOpts, isArrMap) {
    if (think.isArray(data)) {
      if (isArrMap) {
        data.forEach(function (item, i) {
          data[i][mapOpts.name] = [];
        });
      }
      mapData.forEach(function (mapItem) {
        data.forEach(function (item, i) {
          if (mapItem[mapOpts.fKey] !== item[mapOpts.key]) {
            return;
          }
          if (isArrMap) {
            data[i][mapOpts.name].push(mapItem);
          } else {
            data[i][mapOpts.name] = mapItem;
          }
        });
      });
    } else {
      data[mapOpts.name] = isArrMap ? mapData : mapData[0] || {};
    }
    return data;
  };
  /**
   * after add
   * @param  {} data          []
   * @param  {} parsedOptions []
   * @return {}               []
   */


  _class.prototype.afterAdd = function afterAdd(data, options) {
    return this.postRelation('ADD', data, options);
  };
  /**
   * after delete
   * @param  {} data          []
   * @param  {} parsedOptions []
   * @return {}               []
   */


  _class.prototype.afterDelete = function afterDelete() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return this.postRelation('DELETE', options.where, options);
  };
  /**
   * after update
   * @param  {} data          []
   * @param  {} parsedOptions []
   * @return {}               []
   */


  _class.prototype.afterUpdate = function afterUpdate(data, options) {
    return this.postRelation('UPDATE', data, options);
  };
  /**
   * post relation
   * @param  {} postType      []
   * @param  {} data          []
   * @param  {} parsedOptions []
   * @return {}               []
   */


  _class.prototype.postRelation = function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(postType, data /*, parsedOptions*/) {
      var _this3 = this;

      var pk, promises;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(think.isEmpty(data) || think.isEmpty(this.relation) || think.isEmpty(this._relationName))) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt('return', data);

            case 2:
              _context6.next = 4;
              return this.getPk();

            case 4:
              pk = _context6.sent;
              promises = (0, _keys2.default)(this.relation).map(function (key) {
                var item = _this3.relation[key];
                if (!think.isObject(item)) {
                  item = { type: item };
                }
                var opts = think.extend({
                  type: think.model.HAS_ONE,
                  postType: postType,
                  name: key,
                  key: pk,
                  fKey: _this3.name + '_id'
                }, item);
                if (_this3._relationName !== true && _this3._relationName.indexOf(opts.name) === -1) {
                  return;
                }
                if (postType === 'DELETE') {
                  opts.data = data;
                } else {
                  var mapData = data[opts.name];
                  if (think.isEmpty(mapData)) {
                    return;
                  }
                  opts.data = mapData;
                }
                opts.model = _this3.model(item.model || key).where(item.where);
                switch (item.type) {
                  case think.model.BELONG_TO:
                    return _this3._postBelongsToRelation(data, opts);
                  case think.model.HAS_MANY:
                    return _this3._postHasManyRelation(data, opts);
                  case think.model.MANY_TO_MANY:
                    return _this3._postManyToManyRelation(data, opts);
                  default:
                    return _this3._postHasOneRelation(data, opts);
                }
              });
              _context6.next = 8;
              return _promise2.default.all(promises);

            case 8:
              return _context6.abrupt('return', data);

            case 9:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function postRelation(_x15, _x16) {
      return _ref9.apply(this, arguments);
    }

    return postRelation;
  }();
  /**
   * has one post
   * @param  {} data          []
   * @param  {} value         []
   * @param  {} mapOptions    []
   * @param  {} parsedOptions []
   * @return {}               []
   */


  _class.prototype._postHasOneRelation = function _postHasOneRelation(data, mapOpts) {
    var _where, _where2;

    var where = void 0;
    switch (mapOpts.postType) {
      case 'ADD':
        mapOpts.data[mapOpts.fKey] = data[mapOpts.key];
        return mapOpts.model.add(mapOpts.data);
      case 'DELETE':
        where = (_where = {}, _where[mapOpts.fKey] = data[mapOpts.key], _where);
        return mapOpts.model.where(where).delete();
      case 'UPDATE':
        where = (_where2 = {}, _where2[mapOpts.fKey] = data[mapOpts.key], _where2);
        return mapOpts.model.where(where).update(mapOpts.data);
    }
  };
  /**
   * belongs to
   * @param  {} data []
   * @return {}      []
   */


  _class.prototype._postBelongsToRelation = function _postBelongsToRelation(data) {
    return data;
  };
  /**
   * has many
   * @param  {} data          []
   * @param  {} value         []
   * @param  {} mapOptions    []
   * @param  {} parsedOptions []
   * @return {}               []
   */


  _class.prototype._postHasManyRelation = function () {
    var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(data, mapOpts) {
      var _model$where, _where3;

      var mapData, model, where;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              mapData = mapOpts.data;
              model = mapOpts.model;

              if (!think.isArray(mapData)) {
                mapData = [mapData];
              }
              _context7.t0 = mapOpts.postType;
              _context7.next = _context7.t0 === 'ADD' ? 6 : _context7.t0 === 'UPDATE' ? 8 : _context7.t0 === 'DELETE' ? 11 : 13;
              break;

            case 6:
              mapData = mapData.map(function (item) {
                item[mapOpts.fKey] = data[mapOpts.key];
                return item;
              });
              return _context7.abrupt('return', model.addMany(mapData));

            case 8:
              _context7.next = 10;
              return model.where((_model$where = {}, _model$where[mapOpts.fKey] = data[mapOpts.key], _model$where)).delete();

            case 10:
              return _context7.abrupt('return', model.getSchema().then(function () {
                var promises = mapData.map(function (item) {
                  item[mapOpts.fKey] = data[mapOpts.key];
                  //ignore error when add data
                  return model.add(item).catch(function () {});
                });

                return _promise2.default.all(promises);
              }));

            case 11:
              where = (_where3 = {}, _where3[mapOpts.fKey] = data[mapOpts.key], _where3);
              return _context7.abrupt('return', data[mapOpts.key] && model.where(where).delete());

            case 13:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function _postHasManyRelation(_x17, _x18) {
      return _ref10.apply(this, arguments);
    }

    return _postHasManyRelation;
  }();
  /**
   * many to many post
   * @param  Object data          []
   * @param  object value         []
   * @param  {} mapOptions    []
   * @param  {} parsedOptions []
   * @return {}               []
   */


  _class.prototype._postManyToManyRelation = function () {
    var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(data, mapOpts) {
      var model, rfKey, relationModel, type, _where4, where, mapData, firstItem, postData, unqiueField, ids, _postData;

      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              model = mapOpts.model;
              _context8.next = 3;
              return model.getSchema();

            case 3:
              rfKey = mapOpts.rfKey || model.getModelName().toLowerCase() + '_id';
              relationModel = mapOpts.rModel ? this.model(mapOpts.rModel) : this.getRelationModel(model);
              type = mapOpts.postType;

              if (!(type === 'DELETE' || type === 'UPDATE')) {
                _context8.next = 10;
                break;
              }

              where = (_where4 = {}, _where4[mapOpts.fKey] = data[mapOpts.key], _where4);
              _context8.next = 10;
              return relationModel.where(where).delete();

            case 10:
              if (!(type === 'ADD' || type === 'UPDATE')) {
                _context8.next = 31;
                break;
              }

              mapData = mapOpts.data;

              if (!think.isArray(mapData)) {
                mapData = think.isString(mapData) ? mapData.split(',') : [mapData];
              }
              firstItem = mapData[0];

              if (!(think.isNumberString(firstItem) || think.isObject(firstItem) && rfKey in firstItem)) {
                _context8.next = 20;
                break;
              }

              postData = mapData.map(function (item) {
                var _ref12;

                return _ref12 = {}, _ref12[mapOpts.fKey] = data[mapOpts.key], _ref12[rfKey] = item[rfKey] || item, _ref12;
              });
              _context8.next = 18;
              return relationModel.addMany(postData);

            case 18:
              _context8.next = 31;
              break;

            case 20:
              _context8.next = 22;
              return model.getUniqueField();

            case 22:
              unqiueField = _context8.sent;

              if (unqiueField) {
                _context8.next = 25;
                break;
              }

              return _context8.abrupt('return', think.reject(new Error('table `' + model.getTableName() + '` has no unqiue field')));

            case 25:
              _context8.next = 27;
              return this._getRalationAddIds(mapData, model, unqiueField);

            case 27:
              ids = _context8.sent;
              _postData = ids.map(function (id) {
                var _ref13;

                return _ref13 = {}, _ref13[mapOpts.fKey] = data[mapOpts.key], _ref13[rfKey] = id, _ref13;
              });
              _context8.next = 31;
              return relationModel.addMany(_postData);

            case 31:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function _postManyToManyRelation(_x19, _x20) {
      return _ref11.apply(this, arguments);
    }

    return _postManyToManyRelation;
  }();
  /**
   * insert data, add ids
   * @param  {Array} dataList    []
   * @param  {Object} model       []
   * @param  {String} unqiueField []
   * @return {Promise}             []
   */


  _class.prototype._getRalationAddIds = function () {
    var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(dataList, model, unqiueField) {
      var ids, pk, promises;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              ids = [];
              _context9.next = 3;
              return model.getPk();

            case 3:
              pk = _context9.sent;
              promises = dataList.map(function (item) {
                var _where5;

                if (!think.isObject(item)) {
                  var _item;

                  item = (_item = {}, _item[unqiueField] = item, _item);
                }
                var value = item[unqiueField];
                var where = (_where5 = {}, _where5[unqiueField] = value, _where5);
                return model.where(where).field(pk).find().then(function (data) {
                  if (think.isEmpty(data)) {
                    return model.add(item).then(function (insertId) {
                      ids.push(insertId);
                    });
                  } else {
                    ids.push(data[pk]);
                  }
                });
              });
              _context9.next = 7;
              return _promise2.default.all(promises);

            case 7:
              return _context9.abrupt('return', ids);

            case 8:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function _getRalationAddIds(_x21, _x22, _x23) {
      return _ref14.apply(this, arguments);
    }

    return _getRalationAddIds;
  }();

  return _class;
}(think.model.base);

exports.default = _class;