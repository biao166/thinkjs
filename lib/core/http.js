'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mime = require('mime');

var _mime2 = _interopRequireDefault(_mime);

var _cookie2 = require('../util/cookie.js');

var _cookie3 = _interopRequireDefault(_cookie2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PAYLOAD_METHODS = ['POST', 'PUT', 'PATCH'];

/**
 * wrap for request & response
 * @type {Object}
 */

var _class = function () {
  /**
   * constructor
   * @return {} []
   */
  function _class(req, res) {
    (0, _classCallCheck3.default)(this, _class);

    this.init(req, res);
  }
  /**
   * init method
   * @param  {Object} req [request]
   * @param  {Object} res [response]
   * @return {}     []
   */


  _class.prototype.init = function init(req, res) {
    var _this = this;

    //request object
    this.req = req;
    //response object
    this.res = res;

    //set http start time
    this.startTime = Date.now();

    this.parseRequest();

    //set request timeout
    var timeout = think.config('timeout');
    this.timeoutTimer = 0;
    if (timeout) {
      this.timeoutTimer = res.setTimeout(timeout * 1000, function () {
        var err = new Error('request timeout');
        err.code = 'REQUEST_TIMEOUT';
        _this.error = err;
        return think.statusAction(500, _this).catch(function () {});
      });
    }
  };
  /**
   * parse properties
   * @return {} []
   */


  _class.prototype.parseRequest = function parseRequest() {
    this.url = this.req.url;
    this.version = this.req.httpVersion;
    this.method = this.req.method;
    this.headers = this.req.headers;
    this.host = this.headers.host || '';
    this.hostname = '';
    this.pathname = '';

    this.query = {};
    this._file = {};
    this._post = {};
    this._cookie = {};
    this._sendCookie = {};
    this._get = {};

    //store all other properties
    this._prop = {};

    this._contentTypeIsSend = false; //aleady send content-type header
    this._isResource = false; //is resource request
    this._isEnd = false; //request is end

    this._outputContentPromise = [];
    this._view = null; //view instance
    this._session = null; //session instance
    this._lang = ''; //language
    this._langAsViewPath = false; //language as view path
    this._config = null; // config
    this._error = undefined; //error message
    this._theme = undefined; //theme
    this.error = null; //error object
    this._cli = !!think.cli; //cli request

    this.module = '';
    this.controller = '';
    this.action = '';

    this.payload = null; //request payload, Buffer
    this.tpl_file = ''; //template file path

    //optimize for homepage request
    if (this.req.url === '/') {
      this.pathname = '/';
      var pos = this.host.indexOf(':');
      this.hostname = pos === -1 ? this.host : this.host.slice(0, pos);
    } else {
      var urlInfo = _url2.default.parse('//' + this.host + this.req.url, true, true);
      //can not use decodeURIComponent, pathname may be has encode / chars
      //decodeURIComponent value after parse route
      //remove unsafe chars in pathname
      this.pathname = this.normalizePathname(urlInfo.pathname);
      this.hostname = urlInfo.hostname;
      var query = urlInfo.query;
      if (!think.isEmpty(query)) {
        this.query = query;
        this._get = think.extend({}, query);
      }
    }
  };
  /**
   * get or set property
   */


  _class.prototype.prop = function prop(name, value) {
    if (value === undefined) {
      return this._prop[name];
    }
    this._prop[name] = value;
    return this;
  };
  /**
   * exec
   * @return Promise            []
   */


  _class.prototype.run = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return think.hook.exec('request_begin', this);

            case 2:
              if (!(PAYLOAD_METHODS.indexOf(this.req.method) > -1)) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return this.parsePayload();

            case 5:
              return _context.abrupt('return', this);

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function run() {
      return _ref.apply(this, arguments);
    }

    return run;
  }();
  /**
   * check request has post data
   * @return {Boolean} []
   */


  _class.prototype.hasPayload = function hasPayload() {
    if ('transfer-encoding' in this.req.headers) {
      return true;
    }
    return (this.req.headers['content-length'] | 0) > 0;
  };
  /**
   * get payload data
   * @param  {String} encoding [payload data encoding]
   * @return {}          []
   */


  _class.prototype.getPayload = function getPayload() {
    var _this2 = this;

    var encoding = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'utf8';


    var _getPayload = function _getPayload() {
      if (_this2.payload) {
        return _promise2.default.resolve(_this2.payload);
      }
      if (!_this2.req.readable) {
        return _promise2.default.resolve(new Buffer(0));
      }
      var buffers = [];
      var deferred = think.defer();
      _this2.req.on('data', function (chunk) {
        buffers.push(chunk);
      });
      _this2.req.on('end', function () {
        _this2.payload = Buffer.concat(buffers);
        deferred.resolve(_this2.payload);
      });
      _this2.req.on('error', function () {
        _this2.res.statusCode = 400;
        _this2.end();
      });
      return deferred.promise;
    };

    return _getPayload().then(function (buffer) {
      return encoding === true ? buffer : buffer.toString(encoding);
    });
  };
  /**
   * parse payload from request
   * @return {Promise} []
   */


  _class.prototype.parsePayload = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.hasPayload()) {
                _context2.next = 5;
                break;
              }

              _context2.next = 3;
              return think.hook('payload_parse', this);

            case 3:
              _context2.next = 5;
              return think.hook('payload_validate', this);

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function parsePayload() {
      return _ref2.apply(this, arguments);
    }

    return parsePayload;
  }();

  /**
   * normalize pathname, remove hack chars
   * @param  {String} pathname []
   * @return {String}          []
   */


  _class.prototype.normalizePathname = function normalizePathname(pathname) {
    var length = pathname.length;
    var i = 0,
        chr = void 0,
        result = [],
        value = '';
    while (i < length) {
      chr = pathname[i++];
      if (chr === '/' || chr === '\\') {
        if (value && decodeURIComponent(value)[0] !== '.') {
          result.push(value);
        }
        value = '';
      } else {
        value += chr;
      }
    }
    if (value && decodeURIComponent(value) !== '.') {
      result.push(value);
    }
    return result.join('/');
  };
  /*
   * get or set config
   * @param  {string} name  [config name]
   * @param  {mixed} value [config value]
   * @return {mixed}       []
   */


  _class.prototype.config = function config(name, value) {
    return think.config(name, value, this._config);
  };
  /**
   * get or set content type
   * @param  {String} ext [file ext]
   * @return {}     []
   */


  _class.prototype.type = function type(contentType, encoding) {
    if (!contentType) {
      return (this.headers['content-type'] || '').split(';')[0].trim();
    }
    if (this._contentTypeIsSend) {
      return;
    }
    if (contentType.indexOf('/') === -1) {
      contentType = _mime2.default.lookup(contentType);
    }
    if (encoding !== false && contentType.toLowerCase().indexOf('charset=') === -1) {
      contentType += '; charset=' + (encoding || this.config('encoding'));
    }
    this.header('Content-Type', contentType);
  };
  /**
   * get user agent
   * @return {String} []
   */


  _class.prototype.userAgent = function userAgent() {
    return this.headers['user-agent'] || '';
  };
  /**
   * get page request referrer
   * @param  {String} host [only get referrer host]
   * @return {String}      []
   */


  _class.prototype.referrer = function referrer(host) {
    var referer = this.headers.referer || this.headers.referrer || '';
    if (!referer || !host) {
      return referer;
    }
    var info = _url2.default.parse(referer);
    return info.hostname;
  };
  /**
   * check http method is get
   * @return {Boolean} []
   */


  _class.prototype.isGet = function isGet() {
    return this.method === 'GET';
  };
  /**
   * check http method is post
   * @return {Boolean} []
   */


  _class.prototype.isPost = function isPost() {
    return this.method === 'POST';
  };
  /**
   * is cli request
   * @return {Boolean} []
   */


  _class.prototype.isCli = function isCli() {
    return this._cli;
  };
  /**
   * is ajax request
   * @param  {String}  method []
   * @return {Boolean}        []
   */


  _class.prototype.isAjax = function isAjax(method) {
    if (method && this.method !== method.toUpperCase()) {
      return false;
    }
    return this.headers['x-requested-with'] === 'XMLHttpRequest';
  };
  /**
   * is jsonp request
   * @param  {String}  name [callback name]
   * @return {Boolean}      []
   */


  _class.prototype.isJsonp = function isJsonp(name) {
    name = name || this.config('callback_name');
    return !!this.get(name);
  };
  /**
   * get or set get params
   * @param  {String} name []
   * @return {Object | String}      []
   */


  _class.prototype.get = function get(name, value) {
    if (value === undefined) {
      if (name === undefined) {
        return this._get;
      } else if (think.isString(name)) {
        //may be value is false or 0
        value = this._get[name];
        if (value === undefined) {
          value = '';
        }
        return value;
      }
      this._get = name;
    } else {
      this._get[name] = value;
    }
  };
  /**
   * get or set post params
   * @param  {String} name []
   * @return {Object | String}      []
   */


  _class.prototype.post = function post(name, value) {
    if (value === undefined) {
      if (name === undefined) {
        return this._post;
      } else if (think.isString(name)) {
        //may be value is false or 0
        value = this._post[name];
        if (value === undefined) {
          value = '';
        }
        return value;
      }
      this._post = name;
    } else {
      this._post[name] = value;
    }
  };
  /**
   * get post or get params
   * @param  {String} name []
   * @return {Object | String}      []
   */


  _class.prototype.param = function param(name) {
    if (name === undefined) {
      return think.extend({}, this._get, this._post);
    }
    return this._post[name] || this._get[name] || '';
  };
  /**
   * get or set file data
   * @param  {String} name []
   * @return {Object}      []
   */


  _class.prototype.file = function file(name, value) {
    if (value === undefined) {
      if (name === undefined) {
        return think.extend({}, this._file);
      }
      return think.extend({}, this._file[name]);
    }
    this._file[name] = value;
  };
  /**
   * get or set header
   * @param  {String} name  [header name]
   * @param  {String} value [header value]
   * @return {}       []
   */


  _class.prototype.header = function header(name, value) {
    if (name === undefined) {
      return this.headers;
    } else if (value === undefined) {
      return this.headers[name.toLowerCase()] || '';
    }
    //check content type is send
    if (name.toLowerCase() === 'content-type') {
      if (this._contentTypeIsSend) {
        return;
      }
      this._contentTypeIsSend = true;
    }
    //set header
    if (!this.res.headersSent) {
      this.res.setHeader(name, value);
    }
  };
  /**
   * set http status
   * @param  {Number} status []
   * @return {}        []
   */


  _class.prototype.status = function status() {
    var _status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;

    var res = this.res;
    if (!res.headersSent) {
      res.statusCode = _status;
    }
    return this;
  };
  /**
   * get uesr ip
   * @return {String} [ip4 or ip6]
   */


  _class.prototype.ip = function ip(forward) {
    var proxy = think.config('proxy_on') || this.host === this.hostname;
    var userIP = void 0;
    var localIP = '127.0.0.1';
    if (proxy) {
      if (forward) {
        return (this.headers['x-forwarded-for'] || '').split(/\s*,\s*/).filter(function (item) {
          item = item.trim();
          if (think.isIP(item)) {
            return item;
          }
        });
      }
      userIP = this.headers['x-real-ip'];
    } else {
      var connection = this.req.connection;
      var socket = this.req.socket;
      if (connection && connection.remoteAddress !== localIP) {
        userIP = connection.remoteAddress;
      } else if (socket && socket.remoteAddress !== localIP) {
        userIP = socket.remoteAddress;
      }
    }
    if (!userIP) {
      return localIP;
    }
    if (userIP.indexOf(':') > -1) {
      userIP = userIP.split(':').slice(-1)[0];
    }
    if (!think.isIP(userIP)) {
      return localIP;
    }
    return userIP;
  };
  /**
   * get or set language
   * @return {String}           []
   */


  _class.prototype.lang = function lang(_lang, asViewPath) {
    if (_lang) {
      this._lang = _lang;
      this._langAsViewPath = asViewPath;
      return;
    }
    //get from property
    if (this._lang) {
      return this._lang;
    }
    //get from cookie
    var key = this.config('locale').cookie_name;
    var value = this.cookie(key);
    if (value) {
      this._lang = value;
      return value;
    }
    //get from header
    _lang = this.header('accept-language');
    //language to lowercase
    this._lang = (_lang.split(',')[0] || '').toLowerCase();
    return this._lang;
  };
  /**
   * get or set theme
   * @param  {String} theme []
   * @return {String}       []
   */


  _class.prototype.theme = function theme(_theme) {
    if (_theme) {
      this._theme = _theme;
      return;
    }
    return this._theme;
  };
  /**
   * get or set cookie
   * @param  {} name    []
   * @param  {} value   []
   * @param  {} options []
   * @return {}         []
   */


  _class.prototype.cookie = function cookie(name, value, options) {
    //send cookies
    if (name === true) {
      if (think.isEmpty(this._sendCookie)) {
        return;
      }
      var cookies = (0, _values2.default)(this._sendCookie).map(function (item) {
        return _cookie3.default.stringify(item.name, item.value, item);
      });
      this.header('Set-Cookie', cookies);
      this._sendCookie = {};
      return;
    }
    //parse cookie
    if (think.isEmpty(this._cookie) && this.headers.cookie) {
      this._cookie = _cookie3.default.parse(this.headers.cookie);
    }
    if (name === undefined) {
      return this._cookie;
    } else if (value === undefined) {
      return this._cookie[name] || this._sendCookie[name] && this._sendCookie[name].value || '';
    }
    //set cookie
    if (typeof options === 'number') {
      options = { timeout: options };
    }
    options = think.extend({}, this.config('cookie'), options);
    if (value === null) {
      options.timeout = -1000;
    }
    if (options.timeout !== 0) {
      options.expires = new Date(Date.now() + options.timeout * 1000);
    }
    if (options.timeout > 0) {
      options.maxage = options.timeout;
    }
    options.name = name;
    options.value = value;
    this._sendCookie[name] = options;
  };
  /**
   * redirect
   * @param  {String} url  [redirect url]
   * @param  {Number} code []
   * @return {}      []
   */


  _class.prototype.redirect = function redirect(url, code) {
    this.res.statusCode = code || 302;
    this.header('Location', url || '/');
    this.end();
  };
  /**
   * send time
   * @param  {String} name [time type]
   * @return {}      []
   */


  _class.prototype.sendTime = function sendTime(name) {
    var time = Date.now() - this.startTime;
    this.header('X-' + (name || 'EXEC-TIME'), time + 'ms');
  };
  /**
   * output with success errno & errmsg
   * @param  {Object} data    [output data]
   * @param  {String} message [errmsg]
   * @return {Promise}         [pedding promise]
   */


  _class.prototype.success = function success() {
    var _obj;

    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var error = this.config('error');
    var obj = (_obj = {}, _obj[error.key] = 0, _obj[error.msg] = message, _obj.data = data, _obj);
    this.type(this.config('json_content_type'));
    this.end(obj);
  };
  /**
   * output with fail errno & errmsg
   * @param  {Number} errno  [error number]
   * @param  {String} errmsg [error message]
   * @param  {Object} data   [output data]
   * @return {Promise}        [pedding promise]
   */


  _class.prototype.fail = function fail(errno) {
    var errmsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var obj = void 0;
    var error = this.config('error');
    if (think.isObject(errno)) {
      obj = think.extend({}, errno);
    } else {
      var _obj2;

      if (/^[A-Z\_]+$/.test(errno)) {
        var msg = this.locale(errno);
        if (think.isArray(msg)) {
          errno = msg[0];
          errmsg = msg[1];
        }
      }
      if (!think.isNumber(errno)) {
        data = errmsg;
        errmsg = errno;
        errno = error.default_errno;
      }
      //read errmsg from config/locale/[lang].js
      if (!errmsg) {
        errmsg = this.locale(errno) || '';
      }
      obj = (_obj2 = {}, _obj2[error.key] = errno, _obj2[error.msg] = errmsg, _obj2);
      if (data) {
        obj.data = data;
      }
    }
    this.type(this.config('json_content_type'));
    this.end(obj);
  };
  /**
   * output with jsonp
   * @param  {Object} data [output data]
   * @return {}      []
   */


  _class.prototype.jsonp = function jsonp(data) {
    this.type(this.config('json_content_type'));
    var callback = this.get(this.config('callback_name'));
    //remove unsafe chars
    callback = callback.replace(/[^\w\.]/g, '');
    if (callback) {
      data = callback + '(' + (data !== undefined ? (0, _stringify2.default)(data) : '') + ')';
    }
    this.end(data);
  };
  /**
   * output with json
   * @param  {Object} data [output data]
   * @return {Promise}      []
   */


  _class.prototype.json = function json(data) {
    this.type(this.config('json_content_type'));
    this.end(data);
  };
  /**
   * get view instance
   * @return {Object} []
   */


  _class.prototype.view = function view() {
    if (!this._view) {
      var cls = think.require('view');
      this._view = new cls(this);
    }
    return this._view;
  };
  /**
   * set cache-control and expires header
   * @return {} []
   */


  _class.prototype.expires = function expires(time) {
    time = time * 1000;
    var date = new Date(Date.now() + time);
    this.header('Cache-Control', 'max-age=' + time);
    this.header('Expires', date.toUTCString());
  };
  /**
   * get locale value
   * @param  {String} key []
   * @return {String}     []
   */


  _class.prototype.locale = function locale() {
    return think.locale.apply(this, arguments);
  };
  /**
  * get or set session
  * @param  {String} name  [session name]
  * @param  {mixed} value [session value]
  * @return {Promise}       []
  */


  _class.prototype.session = function session(name, value) {
    think.session(this);
    var instance = this._session;
    if (name === undefined) {
      return instance.delete();
    }
    if (value !== undefined) {
      return instance.set(name, value);
    }
    return instance.get(name);
  };
  /**
   * write content
   * @param  {mixed} obj      []
   * @param  {String} encoding []
   * @return {Promise}          []
   */


  _class.prototype.write = function write(obj) {
    var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.config('encoding');

    if (!this.res.connection) {
      return;
    }
    this.type(this.config('view.content_type'));
    this.cookie(true);
    if (obj === undefined) {
      return;
    }
    if (think.isPromise(obj)) {
      //ignore Content-Type header before set
      this._contentTypeIsSend = false;
      throw new Error('can not write promise');
    }
    if (think.isArray(obj) || think.isObject(obj)) {
      obj = (0, _stringify2.default)(obj);
    } else if (!think.isBuffer(obj)) {
      obj += '';
    }

    //write after end
    if (this._isEnd) {
      if (think.isBuffer(obj)) {
        think.log('write after end, content is buffer', 'WARNING');
      } else {
        var pos = obj.indexOf('\n');
        if (pos > -1) {
          obj = obj.slice(0, pos) + '...';
        }
        think.log('write after end, content is `' + obj + '`', 'WARNING');
      }
      return;
    }
    var outputConfig = this.config('output_content');
    if (!outputConfig) {
      return this.res.write(obj, encoding);
    }
    var fn = think.co.wrap(outputConfig);
    var promise = fn(obj, encoding, this);
    this._outputContentPromise.push(promise);
  };
  /**
   * end
   * @return {} []
   */


  _class.prototype._end = function _end() {
    var _this3 = this;

    this.cookie(true);
    this.res.end();

    process.nextTick(function () {
      _this3._afterEnd();
    });
  };
  /**
   * after end
   * @return {} []
   */


  _class.prototype._afterEnd = function _afterEnd() {
    var _this4 = this;

    //flush session
    if (this._session && this._session.flush) {
      this._session.flush();
    }

    //show request info
    if (this.config('log_request') && !this._isResource) {
      think.log(function (colors) {
        var msg = [_this4.method, _this4.url, colors.cyan('' + _this4.res.statusCode)].join(' ');
        return msg;
      }, 'HTTP', this.startTime);
    }

    //remove upload tmp files
    if (!think.isEmpty(this._file)) {
      var key, filepath;
      for (key in this._file) {
        filepath = this._file[key].path;
        if (think.isFile(filepath)) {
          _fs2.default.unlink(filepath, function () {});
        }
      }
    }
  };
  /**
   * http end
   * @return {} []
   */


  _class.prototype.end = function end(obj, encoding) {
    var _this5 = this;

    if (this._isEnd) {
      return;
    }
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = 0;
    }
    this.write(obj, encoding);
    //set http end flag
    this._isEnd = true;
    if (!this._outputContentPromise.length) {
      return this._end();
    }

    return _promise2.default.all(this._outputContentPromise).then(function () {
      _this5._outputContentPromise = [];
      _this5._end();
    }).catch(function () {
      _this5._end();
    });
  };

  return _class;
}();

exports.default = _class;