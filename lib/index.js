'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _auto_reload = require('./util/auto_reload.js');

var _auto_reload2 = _interopRequireDefault(_auto_reload);

var _watch_compile = require('./util/watch_compile.js');

var _watch_compile2 = _interopRequireDefault(_watch_compile);

var _checker = require('./util/checker.js');

var _checker2 = _interopRequireDefault(_checker);

require('./core/think.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//rewrite promise, bluebird is much faster
require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

var _class = function () {
  /**
   * init
   * @param  {Object} options [project options]
   * @return {}         []
   */
  function _class() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, _class);

    //extend options to think
    think.extend(think, this.getPath(), options);

    //normalize path
    think.APP_PATH = _path2.default.normalize(think.APP_PATH);
    think.ROOT_PATH = _path2.default.normalize(think.ROOT_PATH);
    think.RESOURCE_PATH = _path2.default.normalize(think.RESOURCE_PATH);
    think.RUNTIME_PATH = _path2.default.normalize(think.RUNTIME_PATH);

    //parse data from process arguments
    var i = 2;
    var argv = process.argv[i];
    //get app mode from argv
    if (argv === 'production' || argv === 'development' || argv === 'testing') {
      think.env = argv;
      i++;
    }
    argv = process.argv[i];
    //get port or cli url from argv
    if (argv) {
      if (/^\d+$/.test(argv)) {
        think.port = argv;
      } else {
        think.cli = argv;
      }
    }
    //get app mode
    think.mode = this.getMode();
  }
  /**
   * get app mode
   * @return {Number} [app mode]
   */


  _class.prototype.getMode = function getMode() {
    var filepath = think.APP_PATH + '/' + think.dirname.controller;
    if (think.isDir(filepath)) {
      return think.mode_normal;
    }
    return think.mode_module;
  };
  /**
   * get app path
   * @return {Object} []
   */


  _class.prototype.getPath = function getPath() {
    var filepath = process.argv[1];
    var RESOURCE_PATH = _path2.default.dirname(filepath);
    var ROOT_PATH = _path2.default.dirname(RESOURCE_PATH);
    var APP_PATH = '' + ROOT_PATH + think.sep + 'app';
    var RUNTIME_PATH = ROOT_PATH + think.sep + think.dirname.runtime;
    return {
      APP_PATH: APP_PATH,
      RESOURCE_PATH: RESOURCE_PATH,
      ROOT_PATH: ROOT_PATH,
      RUNTIME_PATH: RUNTIME_PATH
    };
  };
  /**
   * check node env
   * @return {Boolean} []
   */


  _class.prototype.checkEnv = function checkEnv() {
    this.checkNodeVersion();
  };

  /**
   * get app module list
   * @return {} []
   */


  _class.prototype.getModule = function getModule() {
    //only have default module in mini mode
    if (think.mode === think.mode_normal) {
      think.module = [think.config('default_module')];
      return think.module;
    }
    var modulePath = think.APP_PATH;
    if (!think.isDir(modulePath)) {
      return [];
    }
    var modules = _fs2.default.readdirSync(modulePath);
    var denyModuleList = think.config('deny_module_list') || [];
    if (denyModuleList.length > 0) {
      modules = modules.filter(function (module) {
        if (module[0] === '.') {
          return;
        }
        if (denyModuleList.indexOf(module) === -1) {
          return module;
        }
      });
    }
    think.module = modules;
    return modules;
  };
  /**
   * load alias
   * @return {} []
   */


  _class.prototype.loadAlias = function loadAlias() {
    var aliasPath = think.THINK_LIB_PATH + '/config/sys/alias.js';
    thinkData.alias = think.safeRequire(aliasPath);
  };
  /**
   * load config
   * @return {} []
   */


  _class.prototype.loadConfig = function loadConfig() {
    think.getModuleConfig();
    //load modules config
    this.getModule().forEach(function (module) {
      think.getModuleConfig(module);
    });
  };

  /**
   * load route
   * @return {} []
   */


  _class.prototype.loadRoute = function loadRoute() {
    think.route();
  };
  /**
   * load adapter
   * @return {} []
   */


  _class.prototype.loadAdapter = function loadAdapter() {
    think.adapter.load();
  };
  /**
   * load middleware
   * @return {} []
   */


  _class.prototype.loadMiddleware = function loadMiddleware() {
    var paths = ['' + think.THINK_LIB_PATH + think.sep + 'middleware', '' + think.getPath(undefined, think.dirname.middleware)];
    think.alias('middleware', paths);
    //middleware base class
    think.middleware.base = think.require('middleware_base');
  };
  /**
   * load hook
   * @return {} []
   */


  _class.prototype.loadHook = function loadHook() {
    var hookPath = think.THINK_LIB_PATH + '/config/hook.js';
    thinkData.hook = think.extend({}, think.safeRequire(hookPath));

    var file = think.getPath(undefined, think.dirname.config) + '/hook.js';
    var data = think.extend({}, think.safeRequire(file));
    for (var key in data) {
      think.hook.set(key, data[key]);
    }
  };
  /**
   * load controller, model, logic, service files
   * @return {} []
   */


  _class.prototype.loadMVC = function loadMVC() {
    var types = {
      model: ['base', 'relation', 'mongo', 'adv'],
      controller: ['base', 'rest'],
      logic: ['base'],
      service: ['base']
    };

    var _loop = function _loop(itemType) {
      think.alias(itemType, '' + think.THINK_LIB_PATH + think.sep + itemType);
      types[itemType].forEach(function (item) {
        think[itemType][item] = think.require(itemType + '_' + item);
      });
      think.module.forEach(function (module) {
        var moduleType = module + '/' + itemType; //can not use think.sep
        var filepath = think.getPath(module, think.dirname[itemType]);
        think.alias(moduleType, filepath, true);
      });
    };

    for (var itemType in types) {
      _loop(itemType);
    }
  };
  /**
   * load sub controller
   * @return {} []
   */


  _class.prototype.loadSubController = function loadSubController() {
    think.module.forEach(function (module) {
      var filepath = think.getPath(module, think.dirname.controller);
      var subControllers = think.getFiles(filepath).filter(function (item) {
        if (item.indexOf(think.sep) === -1) {
          return;
        }
        if (_path2.default.extname(item) !== '.js') {
          return;
        }
        return true;
      }).map(function (item) {
        return item.slice(0, -3).replace(/\\/g, '/');
      }).sort(function (a, b) {
        var al = a.split('/').length;
        var bl = b.split('/').length;
        if (al === bl) {
          return a < b ? 1 : -1;
        }
        return al < bl ? 1 : -1;
      });
      if (subControllers.length) {
        thinkData.subController[module] = subControllers;
      }
    });
  };
  /**
   * load bootstrap
   * @return {} []
   */


  _class.prototype.loadBootstrap = function loadBootstrap() {
    var paths = ['' + think.THINK_LIB_PATH + think.sep + 'bootstrap', think.getPath(think.dirname.common, think.dirname.bootstrap)];
    paths.forEach(function (item) {
      if (!think.isDir(item)) {
        return;
      }
      var files = _fs2.default.readdirSync(item);

      //must reload all bootstrap files.
      if (think.config('auto_reload')) {
        _auto_reload2.default.rewriteSysModuleLoad();
        var instance = new _auto_reload2.default(item, function () {});
        instance.clearFilesCache(files.map(function (file) {
          return item + think.sep + file;
        }));
      }

      files.forEach(function (file) {
        var extname = _path2.default.extname(file);
        if (extname !== '.js') {
          return;
        }
        think.safeRequire('' + item + think.sep + file);
      });
    });
  };
  /**
   * load template file
   * add template files to cache
   * @return {} []
   */


  _class.prototype.loadTemplate = function loadTemplate() {
    var data = {};

    var add = function add(filepath) {
      if (!think.isDir(filepath)) {
        return;
      }
      var files = think.getFiles(filepath, true);
      files.forEach(function (file) {
        var key = '' + filepath + think.sep + file;
        data[key] = true;
      });
    };

    var _think$config = think.config('view'),
        root_path = _think$config.root_path;

    if (root_path) {
      add(_path2.default.normalize(root_path));
    } else {
      think.module.forEach(function (module) {
        add(think.getPath(module, think.dirname.view));
      });
    }
    thinkData.template = data;
  };
  /**
   * load system error message
   * @return {} []
   */


  _class.prototype.loadError = function loadError() {
    thinkData.error = think.safeRequire(think.THINK_LIB_PATH + '/config/sys/error.js');
  };
  /**
   * clear all cache for reload
   * @return {void} []
   */


  _class.prototype.clearData = function clearData() {
    thinkData.alias = {};
    thinkData.export = {};
    thinkData.config = {};
    thinkData.hook = {};
    thinkData.template = {};
    thinkData.middleware = {};
    thinkData.subController = {};
    thinkData.route = null;
  };
  /**
   * load all config or modules
   * @return {} []
   */


  _class.prototype.load = function load() {

    this.loadConfig();
    this.loadRoute();
    this.loadAlias();
    this.loadAdapter();
    this.loadMiddleware();
    this.loadMVC();
    this.loadSubController();
    this.loadHook();
    this.loadTemplate();
    this.loadError();
    this.loadBootstrap();

    _checker2.default.checkModuleConfig();

    think.toFastProperties(thinkData.alias);
    think.toFastProperties(thinkData.config);
    think.toFastProperties(thinkData.hook);
    think.toFastProperties(thinkData.middleware);
    think.toFastProperties(thinkData.error);
    think.toFastProperties(thinkData.template);
    think.toFastProperties(thinkData.subController);

    //console.log(thinkData.alias)
    //console.log(eval('%HasFastProperties(thinkData.template)'))
  };
  /**
   * capture error
   * @return {} []
   */


  _class.prototype.captureError = function captureError() {
    process.on('uncaughtException', function (err) {
      var msg = err.message;
      err = think.error(err, 'port:' + (think.port || think.config('port')));
      think.log(err);
      if (msg.indexOf(' EADDRINUSE ') > -1) {
        process.exit();
      }
    });
    process.removeAllListeners('unhandledRejection');
    process.on('unhandledRejection', function (err) {
      if (think.isPrevent(err)) {
        return;
      }
      if (think.config('log_unhandled_promise')) {
        think.log(err);
      }
    });
  };
  /**
   * start
   * @return {} []
   */


  _class.prototype.start = function start() {
    _checker2.default.checkNodeVersion();
    _checker2.default.checkFileName();
    _checker2.default.checkDependencies();

    this.load();
    this.captureError();
    if (think.config('auto_reload')) {
      this.autoReload();
    }
  };
  /**
   * auto reload user modified files
   * @return {} []
   */


  _class.prototype.autoReload = function autoReload() {
    //it auto reload by watch compile
    if (this.compileCallback) {
      return;
    }
    var instance = this.getReloadInstance();
    instance.run();
  };
  /**
   * get auto reload class instance
   * @param  {String} srcPath []
   * @return {Object}         []
   */


  _class.prototype.getReloadInstance = function getReloadInstance(srcPath) {
    var _this = this;

    srcPath = srcPath || think.APP_PATH;
    _auto_reload2.default.rewriteSysModuleLoad();
    var instance = new _auto_reload2.default(srcPath, function () {
      _this.clearData();
      _this.load();
    });
    return instance;
  };
  /**
   * use babel compile code
   * @return {} []
   */


  _class.prototype.compile = function compile(srcPath, outPath) {
    var _this2 = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (think.isObject(srcPath)) {
      options = srcPath;
      srcPath = '';
    } else if (srcPath === true) {
      options = { log: true };
      srcPath = '';
    }
    srcPath = srcPath || '' + think.ROOT_PATH + think.sep + 'src';
    outPath = outPath || think.APP_PATH;

    if (!think.isDir(srcPath)) {
      return;
    }
    var reloadInstance = this.getReloadInstance(outPath);
    var _getMode = false;
    this.compileCallback = function (changedFiles) {
      if (!_getMode) {
        _getMode = true;
        //get app mode
        think.mode = _this2.getMode();
      }

      reloadInstance.clearFilesCache(changedFiles);
    };

    var instance = new _watch_compile2.default(srcPath, outPath, options, this.compileCallback);
    instance.run();

    think.autoCompile = true;

    this.sourceMapSupport(true);
  };
  /**
   * source map support
   * @param  {} flag []
   * @return {}      []
   */


  _class.prototype.sourceMapSupport = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(flag) {
      var support, options;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return think.npm('source-map-support');

            case 2:
              support = _context.sent;
              options = {
                environment: 'node',
                emptyCacheBetweenOperations: flag
              };
              return _context.abrupt('return', support.install(options));

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function sourceMapSupport(_x3) {
      return _ref.apply(this, arguments);
    }

    return sourceMapSupport;
  }();
  /**
   * pre require
   * @return {} []
   */


  _class.prototype.preload = function preload() {
    var startTime = Date.now();
    for (var name in thinkData.alias) {
      think.require(thinkData.alias[name]);
    }
    //think.log('preload packages finished', 'PRELOAD', startTime);
  };
  /**
   * run
   * @return {} []
   */


  _class.prototype.run = function run(preload) {
    this.start();
    if (preload) {
      this.preload();
    }
    return think.require('app').run();
  };
  /**
   * load, convenient for plugins
   * @return {} []
   */


  _class.load = function load(options) {
    var instance = new this(options);
    instance.load();
  };

  return _class;
}();

exports.default = _class;


module.exports = exports.default;