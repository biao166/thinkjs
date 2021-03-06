'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _thinkit = require('thinkit');

var _thinkit2 = _interopRequireDefault(_thinkit);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _base2 = require('./base.js');

var _base3 = _interopRequireDefault(_base2);

var _http_base = require('./http_base.js');

var _http_base2 = _interopRequireDefault(_http_base);

var _cookie = require('../util/cookie.js');

var _cookie2 = _interopRequireDefault(_cookie);

var _http = require('./http.js');

var _http2 = _interopRequireDefault(_http);

var _await = require('../util/await.js');

var _await2 = _interopRequireDefault(_await);

var _think_validate = require('./think_validate.js');

var _think_validate2 = _interopRequireDefault(_think_validate);

var _think_middleware = require('./think_middleware.js');

var _think_middleware2 = _interopRequireDefault(_think_middleware);

var _think_hook = require('./think_hook.js');

var _think_hook2 = _interopRequireDefault(_think_hook);

var _think_route = require('./think_route.js');

var _think_route2 = _interopRequireDefault(_think_route);

var _think_config = require('./think_config.js');

var _think_config2 = _interopRequireDefault(_think_config);

var _think_adapter = require('./think_adapter.js');

var _think_adapter2 = _interopRequireDefault(_think_adapter);

require('./think_cache.js');

require('./think_data.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_safe2.default.enabled = true;

/**
 * global think variable
 * @type {Object}
 */
global.think = (0, _create2.default)(_thinkit2.default);
/**
 * path seperator
 * @type {String}
 */
think.sep = _path2.default.sep;
/**
 * server start time
 * @type {Number}
 */
think.startTime = Date.now();
/**
 * app dir name, can be set in init
 * @type {Object}
 */
think.dirname = {
  config: 'config',
  controller: 'controller',
  model: 'model',
  adapter: 'adapter',
  logic: 'logic',
  service: 'service',
  view: 'view',
  middleware: 'middleware',
  runtime: 'runtime',
  common: 'common',
  bootstrap: 'bootstrap',
  locale: 'locale'
};
/**
 * env
 * development | testing | production
 * @type {String}
 */
think.env = 'development';
/**
 * server port
 * @type {Number}
 */
think.port = 0;
/**
 * is command line
 * @type {String}
 */
think.cli = '';
/**
 * get locale
 * @type {String}
 */
think.lang = (process.env.LANG || '').split('.')[0].replace('_', '-').toLowerCase();
/**
 * is master
 * @type {Boolean}
 */
think.isMaster = _cluster2.default.isMaster;
/**
 * app mode
 * 0x0001: mini
 * 0x0002: normal
 * 0x0004: module
 * @type {Boolean}
 */
think.mode = 0x0001;
//normal mode
think.mode_normal = 0x0002;
//module mode
think.mode_module = 0x0004;
/**
 * thinkjs module lib path
 * @type {String}
 */
think.THINK_LIB_PATH = _path2.default.normalize(__dirname + '/..');
/**
 * thinkjs module root path
 * @type {String}
 */
think.THINK_PATH = _path2.default.dirname(think.THINK_LIB_PATH);
/**
 * thinkjs version
 * @param  {) []
 * @return {}         []
 */
think.version = function () {
  var packageFile = think.THINK_PATH + '/package.json';

  var _JSON$parse = JSON.parse(_fs2.default.readFileSync(packageFile, 'utf-8')),
      version = _JSON$parse.version;

  return version;
}();
/**
 * module list
 * @type {Array}
 */
think.module = [];
/**
 * base class
 * @type {Class}
 */
think.base = _base3.default;
/**
 * snakeCase string
 * @param str
 */
think.snakeCase = function (str) {
  return str.replace(/([^A-Z])([A-Z])/g, function ($0, $1, $2) {
    return $1 + '_' + $2.toLowerCase();
  });
};
/**
 * reject promise
 * @param  {[type]} err []
 * @return {[type]}     []
 */
think.reject = function (err) {
  //delay to show error
  setTimeout(function () {
    think.log(err);
  }, 500);
  return _promise2.default.reject(err);
};

/**
 * check object is http object
 * @param  {Mixed}  obj []
 * @return {Boolean}      []
 */
think.isHttp = function (obj) {
  return !!(obj && think.isObject(obj.req) && think.isObject(obj.res));
};

/**
 * validate 
 * @type {Function}
 */
think.validate = _think_validate2.default;

/**
 * middleware
 * @type {Function}
 */
think.middleware = _think_middleware2.default;

/**
 * hook
 * @type {Function}
 */
think.hook = _think_hook2.default;

/**
 * route
 * @type {Function}
 */
think.route = _think_route2.default;

/**
 * config
 * @type {Function}
 */
think.config = _think_config2.default;
/**
 * get module config
 * @param  {String} module []
 * @return {Object}        []
 */
think.getModuleConfig = function (module) {
  return think.config(undefined, undefined, module);
};
/**
 * adapter
 * @type {Function}
 */
think.adapter = _think_adapter2.default;

/**
 * alias co module to think.co
 * @type {Object}
 */
think.co = function (obj) {
  //optimize invoke co package
  if (obj && typeof obj.next === 'function') {
    return (0, _co2.default)(obj);
  }
  return _promise2.default.resolve(obj);
};
think.co.wrap = _co2.default.wrap;

/**
 * create class
 * @param {Object} methods [methods and props]
 */
var Class = think.Class;
think.Class = function (type, clean) {
  // create class
  // think.Class({})
  // think.Class({}, true)
  if (think.isObject(type)) {
    return clean === true ? Class(type) : Class(think.base, type);
  }
  // create class with superClass
  // think.Class(function(){}, {})
  else if (think.isFunction(type)) {
      return Class(type, clean);
    }

  //create type class
  return function (superClass, methods) {
    // think.controller();
    // think.controller({})
    if (think.isObject(superClass) || !superClass) {
      methods = superClass;
      superClass = type + '_base';
    }
    // think.controller('superClass', {})
    else if (think.isString(superClass)) {
        superClass = think.lookClass(superClass, type);
      }
    if (think.isString(superClass)) {
      superClass = think.require(superClass, true);
      // get class
      // think.controller('rest')
      if (!methods) {
        return superClass;
      }
    }
    return Class(superClass, methods);
  };
};

/**
 * look up class
 * @param  {String} type   [class type, model, controller, service]
 * @param  {String} module [module name]
 * @return {String}        []
 */
var _getClass = function _getClass(name, type, module, base) {
  var clsPath = void 0,
      cls = void 0;
  // find from current module
  if (module) {
    clsPath = module + '/' + type + '/' + name;
    cls = think.require(clsPath, true);
    if (cls) {
      return cls;
    }
  }
  // find from common module
  module = think.mode !== think.mode_module ? think.config('default_module') : think.dirname.common;
  var list = [module + '/' + type + '/' + name, type + '_' + name, base || type + '_base'];
  for (var i = 0, length = list.length; i < length; i++) {
    cls = think.require(list[i], true);
    if (cls) {
      return cls;
    }
  }
};

think.lookClass = function (name, type, module, base) {
  var names = name.split('/');
  var length = names.length;
  if (length === 1) {
    return _getClass(name, type, module, base);
  }
  if (length === 2 && (think.module.indexOf(names[0]) > -1 || !module)) {
    return think.require(names[0] + '/' + type + '/' + names[1]);
  }
  if (length === 3 && (name.indexOf('/' + type + '/') > -1 || !type || !module)) {
    return think.require(name);
  }
  return think.require(module + '/' + type + '/' + name);
};
/**
 * get common module path
 * think.getPath(undefined, think.dirname.controller)
 * think.getPath(home, think.dirname.model)
 * @return {String} []
 */
think.getPath = function (module) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : think.dirname.controller;
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  var mod = '';
  if (think.mode === think.mode_module) {
    mod = (module || think.dirname.common) + think.sep;
  }
  return '' + think.APP_PATH + prefix + think.sep + mod + type;
};

/**
 * require module
 * @param  {String} name []
 * @return {mixed}      []
 */
var _loadRequire = function _loadRequire(name, filepath) {
  var obj = think.safeRequire(filepath);
  if (think.isFunction(obj)) {
    obj.prototype.__filename = filepath;
  }
  if (obj) {
    thinkData.export[name] = obj;
  }
  return obj;
};
think.require = function (name, flag) {
  if (!think.isString(name)) {
    return name;
  }
  // adapter or middle by register
  var Cls = thinkData.export[name];
  if (Cls) {
    return Cls;
  }

  var filepath = thinkData.alias[name];
  if (filepath) {
    return _loadRequire(name, _path2.default.normalize(filepath));
  }
  // only check in alias
  if (flag) {
    return null;
  }
  filepath = require.resolve(name);
  return _loadRequire(name, filepath);
};

/**
 * safe require
 * @param  {String} file []
 * @return {mixed}      []
 */
var _interopSafeRequire = function _interopSafeRequire(file) {
  var obj = require(file);
  if (obj && obj.__esModule && obj.default) {
    return obj.default;
  }
  return obj;
};

think.safeRequire = function (file) {
  // absolute file path is not exist
  if (_path2.default.isAbsolute(file)) {
    //no need optimize, only invoked before service start
    if (!think.isFile(file)) {
      return null;
    }
    //when file is exist, require direct
    return _interopSafeRequire(file);
  }
  try {
    return _interopSafeRequire(file);
  } catch (err) {
    think.log(err);
  }
  return null;
};

/**
 * merge & parse config, support adapter & parser
 * @param  {} configs []
 * @return {}            []
 */
think.parseConfig = function () {
  var _think;

  for (var _len = arguments.length, configs = Array(_len), _key = 0; _key < _len; _key++) {
    configs[_key] = arguments[_key];
  }

  var onlyMerge = false;
  if (configs[0] === true) {
    onlyMerge = true;
    configs = configs.slice(1);
  }
  configs = configs.map(function (config) {
    config = think.extend({}, config);
    //check adapter config exist
    if (config.type && config.adapter) {
      var adapterConfig = config.adapter[config.type];
      config = think.extend(config, adapterConfig);
      delete config.adapter;
    }
    return config;
  });

  var config = (_think = think).extend.apply(_think, [{}].concat(configs));

  //check parser method
  if (!think.isFunction(config.parser) || onlyMerge) {
    return config;
  }

  var ret = config.parser(config, this !== think ? this : {});
  delete config.parser;
  return think.extend(config, ret);
};

/**
 * prevent next process
 * @return {Promise} []
 */
var preventMessage = 'PREVENT_NEXT_PROCESS';
think.prevent = function () {
  var err = new Error(preventMessage);
  return _promise2.default.reject(err);
};
/**
 * check is prevent error
 * @param  {Error}  err [error message]
 * @return {Boolean}     []
 */
think.isPrevent = function (err) {
  return think.isError(err) && err.message === preventMessage;
};
/**
 * log
 * @TODO
 * @return {} []
 */
think.log = function (msg, type, showTime) {

  //when type or showTime is boolean
  //only show log when value is true
  if (type === false || showTime === false) {
    return;
  } else if (type === true) {
    type = '';
  } else if (showTime === true) {
    showTime = '';
  }

  var dateTime = _safe2.default.gray('[' + think.datetime() + '] ');
  if (showTime === null) {
    dateTime = '';
  }

  var preError = thinkCache(thinkCache.COLLECTION, 'prev_error');
  if (think.isError(msg)) {
    if (think.isPrevent(msg) || msg === preError) {
      return;
    }
    thinkCache(thinkCache.COLLECTION, 'prev_error', msg);
    console.error(dateTime + _safe2.default.red('[Error] ') + msg.stack);
    return;
  } else if (think.isFunction(msg)) {
    msg = msg(_safe2.default);
  } else if (think.isObject(msg) || think.isArray(msg)) {
    msg = (0, _stringify2.default)(msg);
  }
  // if(msg.length > 300){
  //   msg = msg.substr(0, 300) + '...';
  // }
  if (think.isNumber(showTime)) {
    var time = Date.now() - showTime;
    msg += ' ' + _safe2.default.green(time + 'ms');
  }
  if (type) {
    if (type === 'WARNING') {
      console.warn(dateTime + _safe2.default.yellow('[Warning] ') + msg);
    } else if (type === 'EXIT') {
      console.error(_safe2.default.red('[Error] ' + msg));
      console.log();
      process.exit();
    } else {
      console.log(dateTime + _safe2.default.cyan('[' + type + '] ') + msg);
    }
  } else {
    console.log(dateTime + msg);
  }
};

/**
 * load alias
 * @param  {String} type  []
 * @param  {Array} paths []
 * @return {Object}       []
 */
think.alias = function (type, paths, slash) {
  if (!type) {
    return thinkData.alias;
  }
  //regist alias
  if (!think.isArray(paths)) {
    paths = [paths];
  }
  paths.forEach(function (path) {
    var files = think.getFiles(path);
    files.forEach(function (file) {
      if (file.slice(-3) !== '.js' || file[0] === '_') {
        return;
      }
      var name = file.slice(0, -3).replace(/\\/g, '/'); //replace \\ to / on windows
      name = type + (slash ? '/' : '_') + name;
      thinkData.alias[name] = '' + path + think.sep + file;
    });
  });
};

/**
 * regist gc
 * @param  {Object} instance [class instance]
 * @return {}          []
 */
think.gc = function (instance) {
  var type = instance.gcType;
  var timers = thinkCache(thinkCache.TIMER);
  var gc = think.config('gc');
  if (!gc.on || type in timers) {
    return;
  }
  var timer = setInterval(function () {
    if (gc.filter()) {
      return instance.gc && instance.gc(Date.now());
    }
  }, gc.interval * 1000);
  thinkCache(thinkCache.TIMER, type, timer);
};

/**
 * get http object
 * @param  {Object} req [http request]
 * @param  {Object} res [http response]
 * @return {Object}     [http object]
 */
think._http = function () {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (think.isString(data)) {
    if (data[0] === '{') {
      data = JSON.parse(data);
    } else if (/^\w+\=/.test(data)) {
      data = _querystring2.default.parse(data);
    } else {
      data = { url: data };
    }
  }
  var url = data.url || '';
  if (url.indexOf('/') !== 0) {
    url = '/' + url;
  }
  var req = {
    httpVersion: '1.1',
    method: (data.method || 'GET').toUpperCase(),
    url: url,
    headers: think.extend({
      host: data.host || '127.0.0.1'
    }, data.headers),
    connection: {
      remoteAddress: data.ip || '127.0.0.1'
    }
  };
  var empty = function empty() {};
  var res = {
    statusCode: 200,
    setTimeout: empty,
    end: data.end || data.close || empty,
    write: data.write || data.send || empty,
    setHeader: empty
  };
  return {
    req: req,
    res: res
  };
};
/**
 * get http object
 * @param  {Object} req []
 * @param  {Object} res []
 * @return {Promise}     []
 */
think.http = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
    var execFlag, _think$_http, instance, http, App, appInstance;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            execFlag = res === true;
            //for cli request

            if (res === undefined || res === true) {
              _think$_http = think._http(req);
              req = _think$_http.req;
              res = _think$_http.res;
            }
            instance = new _http2.default(req, res);
            _context.next = 5;
            return instance.run();

          case 5:
            http = _context.sent;

            if (execFlag) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', http);

          case 8:
            //flag to cli request, make isCli detect true
            http._cli = true;
            App = think.require('app');
            appInstance = new App(http);
            return _context.abrupt('return', appInstance.run());

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * base class for has http property
 * @type {Class}
 */
think.http.base = _http_base2.default;

/**
 * get uuid
 * @param  {Number} length [uid length]
 * @return {String}        []
 */
think.uuid = function () {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;

  // length = length || 32;
  var str = _crypto2.default.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length);
  return str.replace(/[\+\/]/g, '_');
};

/**
 * start session
 * @param  {Object} http []
 * @return {}      []
 */
think.session = function (http) {
  //if session is init, return
  if (http._session) {
    return http._session;
  }

  var sessionOptions = think.config('session');
  var name = sessionOptions.name,
      secret = sessionOptions.secret;

  var cookie = http.cookie(name);

  //validate cookie sign
  if (cookie && secret) {
    cookie = _cookie2.default.unsign(cookie, secret);
    //set cookie to http._cookie
    if (cookie) {
      http._cookie[name] = cookie;
    }
  }

  var sessionCookie = cookie;
  var newCookie = false;
  //generate session cookie when cookie is not set
  if (!cookie) {
    var options = sessionOptions.cookie || {};
    cookie = think.uuid(options.length || 32);
    sessionCookie = cookie;
    //sign cookie
    if (secret) {
      cookie = _cookie2.default.sign(cookie, secret);
    }
    http._cookie[name] = sessionCookie;
    http.cookie(name, cookie, options);
    newCookie = true;
  }

  var type = sessionOptions.type || 'memory';
  if (type === 'memory') {
    if (think.config('cluster_on')) {
      type = 'file';
      think.log('in cluster mode, session can\'t use memory for storage, convert to File');
    }
  }

  var conf = think.parseConfig(sessionOptions, {
    cookie: sessionCookie,
    newCookie: newCookie
  });
  var cls = think.adapter('session', type);
  var session = new cls(conf);
  http._session = session;

  //save session data after request end
  //http.once('afterEnd', () => session.flush && session.flush());
  return session;
};

/**
 * create controller sub class
 * @type {Function}
 */
think.controller = function (superClass, methods, module) {
  var isConfig = think.isHttp(methods) || module;
  // get controller instance
  if (think.isString(superClass) && isConfig) {
    var Cls = think.lookClass(superClass, 'controller', module);
    return new Cls(methods);
  }
  var controller = thinkCache(thinkCache.COLLECTION, 'controller');
  if (!controller) {
    controller = think.Class('controller');
    thinkCache(thinkCache.COLLECTION, 'controller', controller);
  }
  //create sub controller class
  return controller(superClass, methods);
};

/**
 * create logic class
 * @type {Function}
 */
think.logic = function (superClass, methods, module) {
  var isConfig = think.isHttp(methods) || module;
  //get logic instance
  if (think.isString(superClass) && isConfig) {
    var Cls = think.lookClass(superClass, 'logic', module);
    return new Cls(methods);
  }
  var logic = thinkCache(thinkCache.COLLECTION, 'logic');
  if (!logic) {
    logic = think.Class('logic');
    thinkCache(thinkCache.COLLECTION, 'logic', logic);
  }
  //create sub logic class
  return logic(superClass, methods);
};

/**
 * create model sub class
 * @type {Function}
 */
think.model = function (superClass, methods, module) {
  var isConfig = !!module;
  if (!isConfig && methods) {
    //check is db configs
    if ('type' in methods) {
      isConfig = true;
    }
  }
  //get model instance
  if (think.isString(superClass) && isConfig) {
    methods = think.extend({}, think.config('db'), methods);
    var _base = methods.type === 'mongo' ? 'model_mongo' : '';
    var cls = think.lookClass(superClass, 'model', module, _base);
    var names = superClass.split('/');
    return new cls(names[names.length - 1], methods);
  }
  var model = thinkCache(thinkCache.COLLECTION, 'model');
  if (!model) {
    model = think.Class('model');
    thinkCache(thinkCache.COLLECTION, 'model', model);
  }
  //create model
  return model(superClass, methods);
};

/**
 * create service sub class
 * @type {Function}
 */
think.service = function (superClass, methods, module) {
  //get service instance
  if (think.isString(superClass)) {
    return think.lookClass(superClass, 'service', module || methods);
  }
  var service = thinkCache(thinkCache.COLLECTION, 'service');
  if (!service) {
    service = think.Class('service');
    thinkCache(thinkCache.COLLECTION, 'service', service);
  }
  //create sub service class
  return service(superClass, methods);
};
/**
 * get or set cache
 * @param  {String} type  [cache type]
 * @param  {String} name  [cache name]
 * @param  {Mixed} value [cache value]
 * @return {}       []
 */
think.cache = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(name, value, options) {
    var Cls, instance, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = think.extend({}, think.config('cache'), options);
            Cls = think.adapter('cache', options.type || 'memory');
            instance = new Cls(options);
            // get cache

            if (!(value === undefined)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', instance.get(name));

          case 7:
            if (!(value === null)) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt('return', instance.delete(name));

          case 11:
            if (!think.isFunction(value)) {
              _context2.next = 23;
              break;
            }

            _context2.next = 14;
            return instance.get(name);

          case 14:
            data = _context2.sent;

            if (!(data !== undefined)) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt('return', data);

          case 17:
            _context2.next = 19;
            return think.co(value(name));

          case 19:
            data = _context2.sent;
            _context2.next = 22;
            return instance.set(name, data);

          case 22:
            return _context2.abrupt('return', data);

          case 23:
            return _context2.abrupt('return', instance.set(name, value, options.timeout));

          case 24:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x7, _x8, _x9) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * get locale message
 * can not use arrow function!
 * @param  {String} key  []
 * @param  {String} lang []
 * @return {String}      []
 */
think.locale = function (key) {
  var lang = void 0,
      locales = void 0,
      defaultLang = void 0;
  if (this === think) {
    defaultLang = think.config('locale.default');
    lang = think.lang || defaultLang;
    locales = think.config('locale');
  } else {
    defaultLang = this.config('locale.default');
    lang = this.lang();
    locales = this.config(think.dirname.locale);
  }
  var langLocale = locales[lang] || {};
  var defaultLangLocale = locales[defaultLang] || {};
  if (!key) {
    return think.isEmpty(langLocale) ? defaultLangLocale : langLocale;
  }
  var enLocale = locales.en || {};
  var value = langLocale[key] || defaultLangLocale[key] || enLocale[key] || key;
  if (!think.isString(value)) {
    return value;
  }

  for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    data[_key2 - 1] = arguments[_key2];
  }

  return _util2.default.format.apply(_util2.default, [value].concat(data));
};

/**
 * await 
 * @param  {String}   key      []
 * @param  {Function} callback []
 * @return {Promise}            []
 */
var _awaitInstance = new _await2.default();
think.await = function (key, callback) {
  return _awaitInstance.run(key, callback);
};

/**
 * install node package
 * @param  {String} pkg [package name]
 * @return {Promise}     []
 */
var _dynamicInstall = function _dynamicInstall(pkg) {
  var pkgWithVersion = pkg;
  //get package version
  if (pkgWithVersion.indexOf('@') === -1) {
    var version = think.config('package')[pkg];
    if (version) {
      pkgWithVersion += '@' + version;
    }
  } else {
    pkg = pkgWithVersion.split('@')[0];
  }
  var cmd = 'npm install ' + pkgWithVersion + ' --save';
  return think.await(cmd, function () {
    var deferred = think.defer();
    think.log('install package ' + pkgWithVersion + ' start', 'NPM');
    _child_process2.default.exec(cmd, {
      cwd: think.ROOT_PATH
    }, function (err) {
      if (err) {
        think.log(new Error('install package ' + pkgWithVersion + ' error'));
        deferred.reject(err);
      } else {
        think.log('install package ' + pkgWithVersion + ' finish', 'NPM');
        deferred.resolve(think.require(pkg));
      }
    });
    return deferred.promise;
  });
};

think.npm = function (pkg) {
  try {
    return _promise2.default.resolve(_interopSafeRequire(pkg));
  } catch (e) {
    return _dynamicInstall(pkg);
  }
};
/**
 * get error
 * @param  {Error} err   []
 * @param  {String} addon []
 * @return {Error}       []
 */
think.error = function (err) {
  var addon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (think.isPromise(err)) {
    return err.catch(function (err) {
      return think.reject(think.error(err, addon));
    });
  }
  if (think.isError(err)) {
    var message = err.message;
    var errors = thinkData.error;
    var key = void 0,
        value = void 0,
        reg = /^[A-Z\_]$/;
    for (key in errors) {
      var pos = message.indexOf(key);
      if (pos > -1) {
        var prev = pos === 0 ? '' : message[pos - 1];
        var next = message[pos + key.length];
        if (!reg.test(prev) && !reg.test(next)) {
          value = errors[key];
          break;
        }
      }
    }
    if (value) {
      var siteMessage = 'http://www.thinkjs.org/doc/error_message.html#' + key.toLowerCase();
      if (think.isError(addon)) {
        addon.message = value + ', ' + addon.message + '. ' + siteMessage;
        return addon;
      } else {
        addon = addon ? ', ' + addon : '';
        var msg = '' + value + addon + '. ' + siteMessage;
        err.message = msg;
        return err;
      }
    }
    return err;
  }
  return new Error(err);
};
/**
 * exec status action
 * @param  {Number} status []
 * @param  {Object} http   []
 * @return {}        []
 */
think.statusAction = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(status, http, log) {
    var name, cls, instance;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            status = status || 500;

            if (!think.isPrevent(http.error)) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt('return');

          case 3:
            if (!http._error) {
              _context3.next = 8;
              break;
            }

            think.log(http.error);
            _context3.next = 7;
            return http.status(status).end();

          case 7:
            return _context3.abrupt('return', think.prevent());

          case 8:
            http._error = true;

            //@TODO move log error to error controller
            if (log && think.config('log_error') !== false) {
              think.log(http.error);
            }

            name = think.config('default_module') + '/' + think.dirname.controller + '/error';

            if (think.mode === think.mode_module) {
              name = think.dirname.common + '/' + think.dirname.controller + '/error';
            }

            cls = think.require(name, true);

            //error controller not found

            if (cls) {
              _context3.next = 16;
              break;
            }

            http.error = new Error(think.locale('CONTROLLER_NOT_FOUND', name, http.url));
            return _context3.abrupt('return', think.statusAction(status, http, log));

          case 16:

            //set http status
            //http.status(status);

            instance = new cls(http);
            _context3.next = 19;
            return instance.invoke('_' + status + 'Action', instance);

          case 19:
            return _context3.abrupt('return', think.prevent());

          case 20:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x11, _x12, _x13) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * waterfall
 * @param  {Array}   dataList []
 * @param  {Function} callback []
 * @return {Promise}            []
 */
think.waterfall = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(dataList, callback) {
    var itemFn, data, i, length, ret;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            itemFn = think.isFunction(dataList[0]);
            data = void 0;
            i = 0, length = dataList.length;

          case 3:
            if (!(i < length)) {
              _context4.next = 13;
              break;
            }

            ret = itemFn ? dataList[i](callback, data) : callback(dataList[i], data);
            _context4.next = 7;
            return think.co(ret);

          case 7:
            data = _context4.sent;

            if (!(data === null)) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt('return', data);

          case 10:
            i++;
            _context4.next = 3;
            break;

          case 13:
            return _context4.abrupt('return', data);

          case 14:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x14, _x15) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * parallel limit exec
 * @param  {String}   key      []
 * @param  {Mixed}   data     []
 * @param  {Function} callback []
 * @return {}            []
 */
think.parallelLimit = function (key, data, callback) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


  if (!think.isString(key) || think.isFunction(data)) {
    options = callback || {};
    callback = data;
    if (think.isString(key)) {
      data = undefined;
    } else {
      data = key;
      key = '';
    }
  }
  if (!think.isFunction(callback)) {
    options = callback || {};
    callback = undefined;
  }
  if (think.isNumber(options)) {
    options = { limit: options };
  }

  var flag = !think.isArray(data) || options.array;

  //get parallel limit class
  var Limit = thinkCache(thinkCache.COLLECTION, 'limit');
  if (!Limit) {
    Limit = think.require('parallel_limit');
    thinkCache(thinkCache.COLLECTION, 'limit', Limit);
  }

  var instance = void 0;
  if (think.isFunction(data)) {
    key = '__parallelLimit';
  }
  if (key) {
    instance = thinkCache(thinkCache.LIMIT, key);
    if (!instance) {
      instance = new Limit(options.limit);
      thinkCache(thinkCache.LIMIT, key, instance);
    }
  } else {
    instance = new Limit(options.limit, callback);
  }

  if (flag) {
    return instance.add(data, key && callback);
  }
  return instance.addMany(data, key && callback, options.ignoreError);
};