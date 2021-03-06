'use strict';

/**
 * db configs
 */

exports.__esModule = true;
exports.default = {
  type: 'mysql',
  host: '127.0.0.1',
  port: '',
  database: '',
  user: '',
  password: '',
  prefix: '',
  encoding: 'utf8',
  nums_per_page: 10,
  log_sql: false,
  log_connect: true,
  camel_case: false,
  cache: {
    on: true,
    type: '',
    timeout: 3600
  }
};