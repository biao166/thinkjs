'use strict';

/**
 * csrf configs
 */

exports.__esModule = true;
exports.default = {
  session_name: '__CSRF__', //name in session
  form_name: '__CSRF__', //name in form
  errno: 400,
  errmsg: 'token error'
};