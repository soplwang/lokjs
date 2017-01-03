/* Copyright 2017, Wang Wenlin under MIT License. */

"use strict";

exports.then = then;
exports.promisee = promisee;


/**
 * Combine stand-alone error and success continuations into node.js style callback.
 * @param {Function(e)} err - error continuation
 * @param {Function(v)} next - success continuation
 * @returns {Function(e, v)} - node.js style callback
 */
function then(err, next) {
  err = err || noop;
  next = next || noop;

  return function thk(err_, arg, arg2, /*...*/theArgs) {
    if (err_) {
      err(err_);
    } else if (arguments.length <= 2) {
      next(arg);
    } else if (arguments.length <= 3) {
      next(arg, arg2);
    } else {
      var l = arguments.length;
      var args = new Array(l-1);
      for (var i = 1; i < l; i++) args[i-1] = arguments[i];
      next.apply(undefined, args);
    }
  };
}


/**
 * Adapt promise with callback paradigm by functor alike interface.
 * @returns {Function(e, v)} - node.js style callback w/ promise mixin
 */
function promisee() {
  var fn;
  var promise = new Promise((done, err) => fn = _then(err, done));
  fn.then = (ful, r) => promise.then(ful, r);
  fn.catch = r => promise.catch(r);
  return fn;
}


/* Simplicitized version _then_ only for promisee().
 */
function _then(err, next) {
  return function _thk(err_, arg, /*...*/theArgs) {
    if (err_) {
      err(err_);
    } else if (arguments.length <= 2) {
      next(arg);
    } else {
      var l = arguments.length;
      var args = new Array(l-1);
      for (var i = 1; i < l; i++) args[i-1] = arguments[i];
      next(args);
    }
  };
}

/* No-op function
 */
function noop() {}
