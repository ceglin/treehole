webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.4.2
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
   true ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Vue = factory();
})(this, function () {
  'use strict';

  /*  */

  // these helpers produces better vm code in JS engines due to their
  // explicitness and function inlining

  function isUndef(v) {
    return v === undefined || v === null;
  }

  function isDef(v) {
    return v !== undefined && v !== null;
  }

  function isTrue(v) {
    return v === true;
  }

  function isFalse(v) {
    return v === false;
  }

  /**
   * Check if value is primitive
   */
  function isPrimitive(value) {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  var _toString = Object.prototype.toString;

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]';
  }

  function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]';
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex(val) {
    var n = parseFloat(val);
    return n >= 0 && Math.floor(n) === n && isFinite(val);
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString(val) {
    return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
  }

  /**
   * Convert a input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber(val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n;
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase ? function (val) {
      return map[val.toLowerCase()];
    } : function (val) {
      return map[val];
    };
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if a attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,is');

  /**
   * Remove an item from an array
   */
  function remove(arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1);
      }
    }
  }

  /**
   * Check whether the object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached(fn) {
    var cache = Object.create(null);
    return function cachedFn(str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) {
      return c ? c.toUpperCase() : '';
    });
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /([^-])([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
  });

  /**
   * Simple bind, faster than native
   */
  function bind(fn, ctx) {
    function boundFn(a) {
      var l = arguments.length;
      return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
    }
    // record original fn length
    boundFn._length = fn.length;
    return boundFn;
  }

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret;
  }

  /**
   * Mix properties into target object.
   */
  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to;
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject(arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res;
  }

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
   */
  function noop(a, b, c) {}

  /**
   * Always return false.
   */
  var no = function (a, b, c) {
    return false;
  };

  /**
   * Return same value
   */
  var identity = function (_) {
    return _;
  };

  /**
   * Generate a static keys string from compiler modules.
   */
  function genStaticKeys(modules) {
    return modules.reduce(function (keys, m) {
      return keys.concat(m.staticKeys || []);
    }, []).join(',');
  }

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual(a, b) {
    if (a === b) {
      return true;
    }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i]);
          });
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key]);
          });
        } else {
          /* istanbul ignore next */
          return false;
        }
      } catch (e) {
        /* istanbul ignore next */
        return false;
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b);
    } else {
      return false;
    }
  }

  function looseIndexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Ensure a function is called only once.
   */
  function once(fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    };
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = ['component', 'directive', 'filter'];

  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated'];

  /*  */

  var config = {
    /**
     * Option merge strategies (used in core/util/options)
     */
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "development" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "development" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  };

  /*  */

  var emptyObject = Object.freeze({});

  /**
   * Check if a string starts with $ or _
   */
  function isReserved(str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F;
  }

  /**
   * Define a property.
   */
  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = /[^\w.$]/;
  function parsePath(path) {
    if (bailRE.test(path)) {
      return;
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) {
          return;
        }
        obj = obj[segments[i]];
      }
      return obj;
    };
  }

  /*  */

  var warn = noop;
  var tip = noop;
  var formatComponentName = null; // work around flow check

  {
    var hasConsole = typeof console !== 'undefined';
    var classifyRE = /(?:^|[-_])(\w)/g;
    var classify = function (str) {
      return str.replace(classifyRE, function (c) {
        return c.toUpperCase();
      }).replace(/[-_]/g, '');
    };

    warn = function (msg, vm) {
      var trace = vm ? generateComponentTrace(vm) : '';

      if (config.warnHandler) {
        config.warnHandler.call(null, msg, vm, trace);
      } else if (hasConsole && !config.silent) {
        console.error("[Vue warn]: " + msg + trace);
      }
    };

    tip = function (msg, vm) {
      if (hasConsole && !config.silent) {
        console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
      }
    };

    formatComponentName = function (vm, includeFile) {
      if (vm.$root === vm) {
        return '<Root>';
      }
      var name = typeof vm === 'string' ? vm : typeof vm === 'function' && vm.options ? vm.options.name : vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;

      var file = vm._isVue && vm.$options.__file;
      if (!name && file) {
        var match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
      }

      return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
    };

    var repeat = function (str, n) {
      var res = '';
      while (n) {
        if (n % 2 === 1) {
          res += str;
        }
        if (n > 1) {
          str += str;
        }
        n >>= 1;
      }
      return res;
    };

    var generateComponentTrace = function (vm) {
      if (vm._isVue && vm.$parent) {
        var tree = [];
        var currentRecursiveSequence = 0;
        while (vm) {
          if (tree.length > 0) {
            var last = tree[tree.length - 1];
            if (last.constructor === vm.constructor) {
              currentRecursiveSequence++;
              vm = vm.$parent;
              continue;
            } else if (currentRecursiveSequence > 0) {
              tree[tree.length - 1] = [last, currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push(vm);
          vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree.map(function (vm, i) {
          return "" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
        }).join('\n');
      } else {
        return "\n\n(found in " + formatComponentName(vm) + ")";
      }
    };
  }

  /*  */

  function handleError(err, vm, info) {
    if (config.errorHandler) {
      config.errorHandler.call(null, err, vm, info);
    } else {
      {
        warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
      }
      /* istanbul ignore else */
      if (inBrowser && typeof console !== 'undefined') {
        console.error(err);
      } else {
        throw err;
      }
    }
  }

  /*  */
  /* globals MutationObserver */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = UA && UA.indexOf('android') > 0;
  var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

  // Firefix has a "watch" function on Object.prototype...
  var nativeWatch = {}.watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', {
        get: function get() {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      }); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer;
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
  }

  var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  /**
   * Defer a task to execute it asynchronously.
   */
  var nextTick = function () {
    var callbacks = [];
    var pending = false;
    var timerFunc;

    function nextTickHandler() {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks.length = 0;
      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }

    // the nextTick behavior leverages the microtask queue, which can be accessed
    // via either native Promise.then or MutationObserver.
    // MutationObserver has wider support, however it is seriously bugged in
    // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
    // completely stops working after triggering a few times... so, if native
    // Promise is available, we will use it:
    /* istanbul ignore if */
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
      var p = Promise.resolve();
      var logError = function (err) {
        console.error(err);
      };
      timerFunc = function () {
        p.then(nextTickHandler).catch(logError);
        // in problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS) {
          setTimeout(noop);
        }
      };
    } else if (typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]')) {
      // use MutationObserver where native Promise is not available,
      // e.g. PhantomJS IE11, iOS7, Android 4.4
      var counter = 1;
      var observer = new MutationObserver(nextTickHandler);
      var textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = function () {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
      };
    } else {
      // fallback to setTimeout
      /* istanbul ignore next */
      timerFunc = function () {
        setTimeout(nextTickHandler, 0);
      };
    }

    return function queueNextTick(cb, ctx) {
      var _resolve;
      callbacks.push(function () {
        if (cb) {
          try {
            cb.call(ctx);
          } catch (e) {
            handleError(e, ctx, 'nextTick');
          }
        } else if (_resolve) {
          _resolve(ctx);
        }
      });
      if (!pending) {
        pending = true;
        timerFunc();
      }
      if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve, reject) {
          _resolve = resolve;
        });
      }
    };
  }();

  var _Set;
  /* istanbul ignore if */
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = function () {
      function Set() {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has(key) {
        return this.set[key] === true;
      };
      Set.prototype.add = function add(key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear() {
        this.set = Object.create(null);
      };

      return Set;
    }();
  }

  /*  */

  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep() {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub(sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub(sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify() {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget(_target) {
    if (Dep.target) {
      targetStack.push(Dep.target);
    }
    Dep.target = _target;
  }

  function popTarget() {
    Dep.target = targetStack.pop();
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
      var args = [],
          len = arguments.length;
      while (len--) args[len] = arguments[len];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      if (inserted) {
        ob.observeArray(inserted);
      }
      // notify change
      ob.dep.notify();
      return result;
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * By default, when a reactive property is set, the new value is
   * also converted to become reactive. However when passing down props,
   * we don't want to force conversion because the value may be a nested value
   * under a frozen data structure. Converting it would defeat the optimization.
   */
  var observerState = {
    shouldConvert: true
  };

  /**
   * Observer class that are attached to each observed
   * object. Once attached, the observer converts target
   * object's property keys into getter/setters that
   * collect dependencies and dispatches updates.
   */
  var Observer = function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      var augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i], obj[keys[i]]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray(items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment(target, src, keys) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment(target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe(value, asRootData) {
    if (!isObject(value)) {
      return;
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (observerState.shouldConvert && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob;
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1(obj, key, val, customSetter, shallow) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return;
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
          }
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
        return value;
      },
      set: function reactiveSetter(newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || newVal !== newVal && value !== value) {
          return;
        }
        /* eslint-enable no-self-compare */
        if ("development" !== 'production' && customSetter) {
          customSetter();
        }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set(target, key, val) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    if (hasOwn(target, key)) {
      target[key] = val;
      return val;
    }
    var ob = target.__ob__;
    if (target._isVue || ob && ob.vmCount) {
      "development" !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
      return val;
    }
    if (!ob) {
      target[key] = val;
      return val;
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val;
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del(target, key) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return;
    }
    var ob = target.__ob__;
    if (target._isVue || ob && ob.vmCount) {
      "development" !== 'production' && warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
      return;
    }
    if (!hasOwn(target, key)) {
      return;
    }
    delete target[key];
    if (!ob) {
      return;
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray(value) {
    for (var e = void 0, i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Options with restrictions
   */
  {
    strats.el = strats.propsData = function (parent, child, vm, key) {
      if (!vm) {
        warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
      }
      return defaultStrat(parent, child);
    };
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData(to, from) {
    if (!from) {
      return to;
    }
    var key, toVal, fromVal;
    var keys = Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
        mergeData(toVal, fromVal);
      }
    }
    return to;
  }

  /**
   * Data
   */
  function mergeDataOrFn(parentVal, childVal, vm) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal;
      }
      if (!parentVal) {
        return childVal;
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn() {
        return mergeData(typeof childVal === 'function' ? childVal.call(this) : childVal, typeof parentVal === 'function' ? parentVal.call(this) : parentVal);
      };
    } else if (parentVal || childVal) {
      return function mergedInstanceDataFn() {
        // instance merge
        var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
        var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
        if (instanceData) {
          return mergeData(instanceData, defaultData);
        } else {
          return defaultData;
        }
      };
    }
  }

  strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {
        "development" !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);

        return parentVal;
      }
      return mergeDataOrFn.call(this, parentVal, childVal);
    }

    return mergeDataOrFn(parentVal, childVal, vm);
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook(parentVal, childVal) {
    return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal || null);
    return childVal ? extend(res, childVal) : res;
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (parentVal, childVal) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) {
      parentVal = undefined;
    }
    if (childVal === nativeWatch) {
      childVal = undefined;
    }
    /* istanbul ignore if */
    if (!childVal) {
      return Object.create(parentVal || null);
    }
    if (!parentVal) {
      return childVal;
    }
    var ret = {};
    extend(ret, parentVal);
    for (var key in childVal) {
      var parent = ret[key];
      var child = childVal[key];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child];
    }
    return ret;
  };

  /**
   * Other object hashes.
   */
  strats.props = strats.methods = strats.inject = strats.computed = function (parentVal, childVal) {
    if (!parentVal) {
      return childVal;
    }
    var ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) {
      extend(ret, childVal);
    }
    return ret;
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
  };

  /**
   * Validate component names
   */
  function checkComponents(options) {
    for (var key in options.components) {
      var lower = key.toLowerCase();
      if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
        warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
      }
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps(options) {
    var props = options.props;
    if (!props) {
      return;
    }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        } else {
          warn('props must be strings when using array syntax.');
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val) ? val : { type: val };
      }
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject(options) {
    var inject = options.inject;
    if (Array.isArray(inject)) {
      var normalized = options.inject = {};
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = inject[i];
      }
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives(options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def = dirs[key];
        if (typeof def === 'function') {
          dirs[key] = { bind: def, update: def };
        }
      }
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions(parent, child, vm) {
    {
      checkComponents(child);
    }

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child);
    normalizeInject(child);
    normalizeDirectives(child);
    var extendsFrom = child.extends;
    if (extendsFrom) {
      parent = mergeOptions(parent, extendsFrom, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField(key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options;
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset(options, type, id, warnMissing) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return;
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) {
      return assets[id];
    }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) {
      return assets[camelizedId];
    }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) {
      return assets[PascalCaseId];
    }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if ("development" !== 'production' && warnMissing && !res) {
      warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
    }
    return res;
  }

  /*  */

  function validateProp(key, propOptions, propsData, vm) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // handle boolean props
    if (isType(Boolean, prop.type)) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
        value = true;
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldConvert = observerState.shouldConvert;
      observerState.shouldConvert = true;
      observe(value);
      observerState.shouldConvert = prevShouldConvert;
    }
    {
      assertProp(prop, key, value, vm, absent);
    }
    return value;
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue(vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined;
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if ("development" !== 'production' && isObject(def)) {
      warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
      return vm._props[key];
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
  }

  /**
   * Assert whether a prop is valid.
   */
  function assertProp(prop, name, value, vm, absent) {
    if (prop.required && absent) {
      warn('Missing required prop: "' + name + '"', vm);
      return;
    }
    if (value == null && !prop.required) {
      return;
    }
    var type = prop.type;
    var valid = !type || type === true;
    var expectedTypes = [];
    if (type) {
      if (!Array.isArray(type)) {
        type = [type];
      }
      for (var i = 0; i < type.length && !valid; i++) {
        var assertedType = assertType(value, type[i]);
        expectedTypes.push(assertedType.expectedType || '');
        valid = assertedType.valid;
      }
    }
    if (!valid) {
      warn('Invalid prop: type check failed for prop "' + name + '".' + ' Expected ' + expectedTypes.map(capitalize).join(', ') + ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.', vm);
      return;
    }
    var validator = prop.validator;
    if (validator) {
      if (!validator(value)) {
        warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
      }
    }
  }

  var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

  function assertType(value, type) {
    var valid;
    var expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
      valid = typeof value === expectedType.toLowerCase();
    } else if (expectedType === 'Object') {
      valid = isPlainObject(value);
    } else if (expectedType === 'Array') {
      valid = Array.isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid: valid,
      expectedType: expectedType
    };
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType(fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : '';
  }

  function isType(type, fn) {
    if (!Array.isArray(fn)) {
      return getType(fn) === getType(type);
    }
    for (var i = 0, len = fn.length; i < len; i++) {
      if (getType(fn[i]) === getType(type)) {
        return true;
      }
    }
    /* istanbul ignore next */
    return false;
  }

  /*  */

  var mark;
  var measure;

  {
    var perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
      mark = function (tag) {
        return perf.mark(tag);
      };
      measure = function (name, startTag, endTag) {
        perf.measure(name, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
        perf.clearMeasures(name);
      };
    }
  }

  /* not type checking this file because flow doesn't play well with Proxy */

  var initProxy;

  {
    var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
    );

    var warnNonPresent = function (target, key) {
      warn("Property or method \"" + key + "\" is not defined on the instance but " + "referenced during render. Make sure to declare reactive data " + "properties in the data option.", target);
    };

    var hasProxy = typeof Proxy !== 'undefined' && Proxy.toString().match(/native code/);

    if (hasProxy) {
      var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
      config.keyCodes = new Proxy(config.keyCodes, {
        set: function set(target, key, value) {
          if (isBuiltInModifier(key)) {
            warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
            return false;
          } else {
            target[key] = value;
            return true;
          }
        }
      });
    }

    var hasHandler = {
      has: function has(target, key) {
        var has = key in target;
        var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
        if (!has && !isAllowed) {
          warnNonPresent(target, key);
        }
        return has || !isAllowed;
      }
    };

    var getHandler = {
      get: function get(target, key) {
        if (typeof key === 'string' && !(key in target)) {
          warnNonPresent(target, key);
        }
        return target[key];
      }
    };

    initProxy = function initProxy(vm) {
      if (hasProxy) {
        // determine which proxy handler to use
        var options = vm.$options;
        var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
        vm._renderProxy = new Proxy(vm, handlers);
      } else {
        vm._renderProxy = vm;
      }
    };
  }

  /*  */

  var VNode = function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.functionalContext = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: {} };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance;
  };

  Object.defineProperties(VNode.prototype, prototypeAccessors);

  var createEmptyVNode = function (text) {
    if (text === void 0) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node;
  };

  function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode(vnode) {
    var cloned = new VNode(vnode.tag, vnode.data, vnode.children, vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.isCloned = true;
    return cloned;
  }

  function cloneVNodes(vnodes) {
    var len = vnodes.length;
    var res = new Array(len);
    for (var i = 0; i < len; i++) {
      res[i] = cloneVNode(vnodes[i]);
    }
    return res;
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    };
  });

  function createFnInvoker(fns) {
    function invoker() {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          cloned[i].apply(null, arguments$1);
        }
      } else {
        // return handler return value for single handlers
        return fns.apply(null, arguments);
      }
    }
    invoker.fns = fns;
    return invoker;
  }

  function updateListeners(on, oldOn, add, remove$$1, vm) {
    var name, cur, old, event;
    for (name in on) {
      cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (isUndef(cur)) {
        "development" !== 'production' && warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm);
      } else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur);
        }
        add(event.name, cur, event.once, event.capture, event.passive);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook(def, hookKey, hook) {
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook() {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData(data, Ctor, tag) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return;
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        {
          var keyInLowerCase = key.toLowerCase();
          if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
            tip("Prop \"" + keyInLowerCase + "\" is passed to component " + formatComponentName(tag || Ctor) + ", but the declared prop name is" + " \"" + key + "\". " + "Note that HTML attributes are case-insensitive and camelCased " + "props need to use their kebab-case equivalents when using in-DOM " + "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\".");
          }
        }
        checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey, false);
      }
    }
    return res;
  }

  function checkProp(res, hash, key, altKey, preserve) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true;
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true;
      }
    }
    return false;
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren(children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children);
      }
    }
    return children;
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren(children) {
    return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
  }

  function isTextNode(node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment);
  }

  function normalizeArrayChildren(children, nestedIndex) {
    var res = [];
    var i, c, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') {
        continue;
      }
      last = res[res.length - 1];
      //  nested
      if (Array.isArray(c)) {
        res.push.apply(res, normalizeArrayChildren(c, (nestedIndex || '') + "_" + i));
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          last.text += String(c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[res.length - 1] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res;
  }

  /*  */

  function ensureCtor(comp, base) {
    if (comp.__esModule && comp.default) {
      comp = comp.default;
    }
    return isObject(comp) ? base.extend(comp) : comp;
  }

  function createAsyncPlaceholder(factory, data, context, children, tag) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node;
  }

  function resolveAsyncComponent(factory, baseCtor, context) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp;
    }

    if (isDef(factory.resolved)) {
      return factory.resolved;
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp;
    }

    if (isDef(factory.contexts)) {
      // already pending
      factory.contexts.push(context);
    } else {
      var contexts = factory.contexts = [context];
      var sync = true;

      var forceRender = function () {
        for (var i = 0, l = contexts.length; i < l; i++) {
          contexts[i].$forceUpdate();
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender();
        }
      });

      var reject = once(function (reason) {
        "development" !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender();
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (typeof res.then === 'function') {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isDef(res.component) && typeof res.component.then === 'function') {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              setTimeout(function () {
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender();
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            setTimeout(function () {
              if (isUndef(factory.resolved)) {
                reject("timeout (" + res.timeout + "ms)");
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading ? factory.loadingComp : factory.resolved;
    }
  }

  /*  */

  function getFirstComponentChild(children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && isDef(c.componentOptions)) {
          return c;
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents(vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add(event, fn, once$$1) {
    if (once$$1) {
      target.$once(event, fn);
    } else {
      target.$on(event, fn);
    }
  }

  function remove$1(event, fn) {
    target.$off(event, fn);
  }

  function updateComponentListeners(vm, listeners, oldListeners) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  }

  function eventsMixin(Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var this$1 = this;

      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          this$1.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm;
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on() {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm;
    };

    Vue.prototype.$off = function (event, fn) {
      var this$1 = this;

      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm;
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          this$1.$off(event[i$1], fn);
        }
        return vm;
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm;
      }
      if (arguments.length === 1) {
        vm._events[event] = null;
        return vm;
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break;
        }
      }
      return vm;
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      {
        var lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
          tip("Event \"" + lowerCaseEvent + "\" is emitted in component " + formatComponentName(vm) + " but the handler is registered for \"" + event + "\". " + "Note that HTML attributes are case-insensitive and you cannot use " + "v-on to listen to camelCase events when using in-DOM templates. " + "You should probably use \"" + hyphenate(event) + "\" instead of \"" + event + "\".");
        }
      }
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        for (var i = 0, l = cbs.length; i < l; i++) {
          try {
            cbs[i].apply(vm, args);
          } catch (e) {
            handleError(e, vm, "event handler for \"" + event + "\"");
          }
        }
      }
      return vm;
    };
  }

  /*  */

  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots(children, context) {
    var slots = {};
    if (!children) {
      return slots;
    }
    var defaultSlot = [];
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.functionalContext === context) && child.data && child.data.slot != null) {
        var name = child.data.slot;
        var slot = slots[name] || (slots[name] = []);
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children);
        } else {
          slot.push(child);
        }
      } else {
        defaultSlot.push(child);
      }
    }
    // ignore whitespace
    if (!defaultSlot.every(isWhitespace)) {
      slots.default = defaultSlot;
    }
    return slots;
  }

  function isWhitespace(node) {
    return node.isComment || node.text === ' ';
  }

  function resolveScopedSlots(fns, // see flow/vnode
  res) {
    res = res || {};
    for (var i = 0; i < fns.length; i++) {
      if (Array.isArray(fns[i])) {
        resolveScopedSlots(fns[i], res);
      } else {
        res[fns[i].key] = fns[i].fn;
      }
    }
    return res;
  }

  /*  */

  var activeInstance = null;
  var isUpdatingChildComponent = false;

  function initLifecycle(vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate');
      }
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var prevActiveInstance = activeInstance;
      activeInstance = vm;
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */
        , vm.$options._parentElm, vm.$options._refElm);
        // no need for the ref nodes after initial patch
        // this prevents keeping a detached DOM tree in memory (#5851)
        vm.$options._parentElm = vm.$options._refElm = null;
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      activeInstance = prevActiveInstance;
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return;
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
    };
  }

  function mountComponent(vm, el, hydrating) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
          warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
        } else {
          warn('Failed to mount component: template or render function not defined.', vm);
        }
      }
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      updateComponent = function () {
        var name = vm._name;
        var id = vm._uid;
        var startTag = "vue-perf-start:" + id;
        var endTag = "vue-perf-end:" + id;

        mark(startTag);
        var vnode = vm._render();
        mark(endTag);
        measure(name + " render", startTag, endTag);

        mark(startTag);
        vm._update(vnode, hydrating);
        mark(endTag);
        measure(name + " patch", startTag, endTag);
      };
    } else {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    vm._watcher = new Watcher(vm, updateComponent, noop);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm;
  }

  function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
    {
      isUpdatingChildComponent = true;
    }

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren
    var hasChildren = !!(renderChildren || // has new static slots
    vm.$options._renderChildren || // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) {
      // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listensers hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data && parentVnode.data.attrs;
    vm.$listeners = listeners;

    // update props
    if (propsData && vm.$options.props) {
      observerState.shouldConvert = false;
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        props[key] = validateProp(key, vm.$options.props, propsData, vm);
      }
      observerState.shouldConvert = true;
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    if (listeners) {
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      updateComponentListeners(vm, listeners, oldListeners);
    }
    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }

    {
      isUpdatingChildComponent = false;
    }
  }

  function isInInactiveTree(vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) {
        return true;
      }
    }
    return false;
  }

  function activateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return;
      }
    } else if (vm._directInactive) {
      return;
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent(vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return;
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        try {
          handlers[i].call(vm);
        } catch (e) {
          handleError(e, vm, hook + " hook");
        }
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
  }

  /*  */

  var MAX_UPDATE_COUNT = 100;

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue() {
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) {
      return a.id - b.id;
    });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      id = watcher.id;
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if ("development" !== 'production' && has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > MAX_UPDATE_COUNT) {
          warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
          break;
        }
      }
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks(queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent(vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks(queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */

  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher(vm, expOrFn, cb, options) {
    this.vm = vm;
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = expOrFn.toString();
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = function () {};
        "development" !== 'production' && warn("Failed watching path: \"" + expOrFn + "\" " + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
      }
    }
    this.value = this.lazy ? undefined : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get() {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, "getter for watcher \"" + this.expression + "\"");
      } else {
        throw e;
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value;
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep(dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps() {
    var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      var dep = this$1.deps[i];
      if (!this$1.newDepIds.has(dep.id)) {
        dep.removeSub(this$1);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run() {
    if (this.active) {
      var value = this.get();
      if (value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) || this.deep) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, "callback for watcher \"" + this.expression + "\"");
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate() {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend() {
    var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown() {
    var this$1 = this;

    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this$1.deps[i].removeSub(this$1);
      }
      this.active = false;
    }
  };

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  var seenObjects = new _Set();
  function traverse(val) {
    seenObjects.clear();
    _traverse(val, seenObjects);
  }

  function _traverse(val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if (!isA && !isObject(val) || !Object.isExtensible(val)) {
      return;
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return;
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) {
        _traverse(val[i], seen);
      }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) {
        _traverse(val[keys[i]], seen);
      }
    }
  }

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
      return this[sourceKey][key];
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState(vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) {
      initProps(vm, opts.props);
    }
    if (opts.methods) {
      initMethods(vm, opts.methods);
    }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) {
      initComputed(vm, opts.computed);
    }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function checkOptionType(vm, name) {
    var option = vm.$options[name];
    if (!isPlainObject(option)) {
      warn("component option \"" + name + "\" should be an object.", vm);
    }
  }

  function initProps(vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    observerState.shouldConvert = isRoot;
    var loop = function (key) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        if (isReservedAttribute(key) || config.isReservedAttr(key)) {
          warn("\"" + key + "\" is a reserved attribute and cannot be used as component prop.", vm);
        }
        defineReactive$$1(props, key, value, function () {
          if (vm.$parent && !isUpdatingChildComponent) {
            warn("Avoid mutating a prop directly since the value will be " + "overwritten whenever the parent component re-renders. " + "Instead, use a data or computed property based on the prop's " + "value. Prop being mutated: \"" + key + "\"", vm);
          }
        });
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop(key);
    observerState.shouldConvert = true;
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
    if (!isPlainObject(data)) {
      data = {};
      "development" !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn("method \"" + key + "\" has already been defined as a data property.", vm);
        }
      }
      if (props && hasOwn(props, key)) {
        "development" !== 'production' && warn("The data property \"" + key + "\" is already declared as a prop. " + "Use prop default value instead.", vm);
      } else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData(data, vm) {
    try {
      return data.call(vm);
    } catch (e) {
      handleError(e, vm, "data()");
      return {};
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed(vm, computed) {
    "development" !== 'production' && checkOptionType(vm, 'computed');
    var watchers = vm._computedWatchers = Object.create(null);

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if ("development" !== 'production' && getter == null) {
        warn("Getter is missing for computed property \"" + key + "\".", vm);
      }
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn("The computed property \"" + key + "\" is already defined in data.", vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn("The computed property \"" + key + "\" is already defined as a prop.", vm);
        }
      }
    }
  }

  function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = createComputedGetter(key);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get ? userDef.cache !== false ? createComputedGetter(key) : userDef.get : noop;
      sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
    }
    if ("development" !== 'production' && sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn("Computed property \"" + key + "\" was assigned to but it has no setter.", this);
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter(key) {
    return function computedGetter() {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value;
      }
    };
  }

  function initMethods(vm, methods) {
    "development" !== 'production' && checkOptionType(vm, 'methods');
    var props = vm.$options.props;
    for (var key in methods) {
      vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
      {
        if (methods[key] == null) {
          warn("method \"" + key + "\" has an undefined value in the component definition. " + "Did you reference the function correctly?", vm);
        }
        if (props && hasOwn(props, key)) {
          warn("method \"" + key + "\" has already been defined as a prop.", vm);
        }
      }
    }
  }

  function initWatch(vm, watch) {
    "development" !== 'production' && checkOptionType(vm, 'watch');
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher(vm, keyOrFn, handler, options) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(keyOrFn, handler, options);
  }

  function stateMixin(Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () {
      return this._data;
    };
    var propsDef = {};
    propsDef.get = function () {
      return this._props;
    };
    {
      dataDef.set = function (newData) {
        warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
      };
      propsDef.set = function () {
        warn("$props is readonly.", this);
      };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (expOrFn, cb, options) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options);
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        cb.call(vm, watcher.value);
      }
      return function unwatchFn() {
        watcher.teardown();
      };
    };
  }

  /*  */

  function initProvide(vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
    }
  }

  function initInjections(vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      observerState.shouldConvert = false;
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key], function () {
            warn("Avoid mutating an injected value directly since the changes will be " + "overwritten whenever the provided component re-renders. " + "injection being mutated: \"" + key + "\"", vm);
          });
        }
      });
      observerState.shouldConvert = true;
    }
  }

  function resolveInject(inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var provideKey = inject[key];
        var source = vm;
        while (source) {
          if (source._provided && provideKey in source._provided) {
            result[key] = source._provided[provideKey];
            break;
          }
          source = source.$parent;
        }
        if ("development" !== 'production' && !source) {
          warn("Injection \"" + key + "\" not found", vm);
        }
      }
      return result;
    }
  }

  /*  */

  function createFunctionalComponent(Ctor, propsData, data, context, children) {
    var props = {};
    var propOptions = Ctor.options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || {});
      }
    } else {
      if (isDef(data.attrs)) {
        mergeProps(props, data.attrs);
      }
      if (isDef(data.props)) {
        mergeProps(props, data.props);
      }
    }
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var _context = Object.create(context);
    var h = function (a, b, c, d) {
      return createElement(_context, a, b, c, d, true);
    };
    var vnode = Ctor.options.render.call(null, h, {
      data: data,
      props: props,
      children: children,
      parent: context,
      listeners: data.on || {},
      injections: resolveInject(Ctor.options.inject, context),
      slots: function () {
        return resolveSlots(children, context);
      }
    });
    if (vnode instanceof VNode) {
      vnode.functionalContext = context;
      vnode.functionalOptions = Ctor.options;
      if (data.slot) {
        (vnode.data || (vnode.data = {})).slot = data.slot;
      }
    }
    return vnode;
  }

  function mergeProps(to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  // hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init(vnode, hydrating, parentElm, refElm) {
      if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
        var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance, parentElm, refElm);
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      } else if (vnode.data.keepAlive) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      }
    },

    prepatch: function prepatch(oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(child, options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
      );
    },

    insert: function insert(vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy(vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent(Ctor, data, context, children, tag) {
    if (isUndef(Ctor)) {
      return;
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      {
        warn("Invalid Component definition: " + String(Ctor), context);
      }
      return;
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children);
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // merge component management hooks onto the placeholder node
    mergeHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }, asyncFactory);
    return vnode;
  }

  function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm, refElm) {
    var vnodeComponentOptions = vnode.componentOptions;
    var options = {
      _isComponent: true,
      parent: parent,
      propsData: vnodeComponentOptions.propsData,
      _componentTag: vnodeComponentOptions.tag,
      _parentVnode: vnode,
      _parentListeners: vnodeComponentOptions.listeners,
      _renderChildren: vnodeComponentOptions.children,
      _parentElm: parentElm || null,
      _refElm: refElm || null
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnodeComponentOptions.Ctor(options);
  }

  function mergeHooks(data) {
    if (!data.hook) {
      data.hook = {};
    }
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var fromParent = data.hook[key];
      var ours = componentVNodeHooks[key];
      data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
    }
  }

  function mergeHook$1(one, two) {
    return function (a, b, c, d) {
      one(a, b, c, d);
      two(a, b, c, d);
    };
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel(options, data) {
    var prop = options.model && options.model.prop || 'value';
    var event = options.model && options.model.event || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    if (isDef(on[event])) {
      on[event] = [data.model.callback].concat(on[event]);
    } else {
      on[event] = data.model.callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType);
  }

  function _createElement(context, tag, data, children, normalizationType) {
    if (isDef(data) && isDef(data.__ob__)) {
      "development" !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
      return createEmptyVNode();
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode();
    }
    // warn against non-primitive key
    if ("development" !== 'production' && isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
      warn('Avoid using non-primitive value as key, ' + 'use string/number value instead.', context);
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) && typeof children[0] === 'function') {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
      } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(tag, data, children, undefined, undefined, context);
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (isDef(vnode)) {
      if (ns) {
        applyNS(vnode, ns);
      }
      return vnode;
    } else {
      return createEmptyVNode();
    }
  }

  function applyNS(vnode, ns) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      return;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && isUndef(child.ns)) {
          applyNS(child, ns);
        }
      }
    }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList(val, render) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    if (isDef(ret)) {
      ret._isVList = true;
    }
    return ret;
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot(name, fallback, props, bindObject) {
    var scopedSlotFn = this.$scopedSlots[name];
    if (scopedSlotFn) {
      // scoped slot
      props = props || {};
      if (bindObject) {
        props = extend(extend({}, bindObject), props);
      }
      return scopedSlotFn(props) || fallback;
    } else {
      var slotNodes = this.$slots[name];
      // warn duplicate slot usage
      if (slotNodes && "development" !== 'production') {
        slotNodes._rendered && warn("Duplicate presence of slot \"" + name + "\" found in the same render tree " + "- this will likely cause render errors.", this);
        slotNodes._rendered = true;
      }
      return slotNodes || fallback;
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity;
  }

  /*  */

  /**
   * Runtime helper for checking keyCodes from config.
   */
  function checkKeyCodes(eventKeyCode, key, builtInAlias) {
    var keyCodes = config.keyCodes[key] || builtInAlias;
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1;
    } else {
      return keyCodes !== eventKeyCode;
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps(data, tag, value, asProp, isSync) {
    if (value) {
      if (!isObject(value)) {
        "development" !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function (key) {
          if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
          }
          if (!(key in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on["update:" + key] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop(key);
      }
    }
    return data;
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic(index, isInFor) {
    var tree = this._staticTrees[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree by doing a shallow clone.
    if (tree && !isInFor) {
      return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree);
    }
    // otherwise, render a fresh tree.
    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
    markStatic(tree, "__static__" + index, false);
    return tree;
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce(tree, index, key) {
    markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
    return tree;
  }

  function markStatic(tree, key, isOnce) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], key + "_" + i, isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode(node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners(data, value) {
    if (value) {
      if (!isPlainObject(value)) {
        "development" !== 'production' && warn('v-on without argument expects an Object value', this);
      } else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(ours, existing) : ours;
        }
      }
    }
    return data;
  }

  /*  */

  function initRender(vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null;
    var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) {
      return createElement(vm, a, b, c, d, false);
    };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) {
      return createElement(vm, a, b, c, d, true);
    };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;
    /* istanbul ignore else */
    {
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs, function () {
        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
      }, true);
      defineReactive$$1(vm, '$listeners', vm.$options._parentListeners, function () {
        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
      }, true);
    }
  }

  function renderMixin(Vue) {
    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      var _parentVnode = ref._parentVnode;

      if (vm._isMounted) {
        // clone slot nodes on re-renders
        for (var key in vm.$slots) {
          vm.$slots[key] = cloneVNodes(vm.$slots[key]);
        }
      }

      vm.$scopedSlots = _parentVnode && _parentVnode.data.scopedSlots || emptyObject;

      if (staticRenderFns && !vm._staticTrees) {
        vm._staticTrees = [];
      }
      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render function");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        {
          vnode = vm.$options.renderError ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e) : vm._vnode;
        }
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if ("development" !== 'production' && Array.isArray(vnode)) {
          warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
        }
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode;
    };

    // internal render helpers.
    // these are exposed on the instance prototype to reduce generated render
    // code size.
    Vue.prototype._o = markOnce;
    Vue.prototype._n = toNumber;
    Vue.prototype._s = toString;
    Vue.prototype._l = renderList;
    Vue.prototype._t = renderSlot;
    Vue.prototype._q = looseEqual;
    Vue.prototype._i = looseIndexOf;
    Vue.prototype._m = renderStatic;
    Vue.prototype._f = resolveFilter;
    Vue.prototype._k = checkKeyCodes;
    Vue.prototype._b = bindObjectProps;
    Vue.prototype._v = createTextVNode;
    Vue.prototype._e = createEmptyVNode;
    Vue.prototype._u = resolveScopedSlots;
    Vue.prototype._g = bindObjectListeners;
  }

  /*  */

  var uid$1 = 0;

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$1++;

      var startTag, endTag;
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        startTag = "vue-perf-init:" + vm._uid;
        endTag = "vue-perf-end:" + vm._uid;
        mark(startTag);
      }

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
      }
      /* istanbul ignore else */
      {
        initProxy(vm);
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        vm._name = formatComponentName(vm, false);
        mark(endTag);
        measure(vm._name + " init", startTag, endTag);
      }

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent(vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    opts.parent = options.parent;
    opts.propsData = options.propsData;
    opts._parentVnode = options._parentVnode;
    opts._parentListeners = options._parentListeners;
    opts._renderChildren = options._renderChildren;
    opts._componentTag = options._componentTag;
    opts._parentElm = options._parentElm;
    opts._refElm = options._refElm;
    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions(Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options;
  }

  function resolveModifiedOptions(Ctor) {
    var modified;
    var latest = Ctor.options;
    var extended = Ctor.extendOptions;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) {
          modified = {};
        }
        modified[key] = dedupe(latest[key], extended[key], sealed[key]);
      }
    }
    return modified;
  }

  function dedupe(latest, extended, sealed) {
    // compare latest and sealed to ensure lifecycle hooks won't be duplicated
    // between merges
    if (Array.isArray(latest)) {
      var res = [];
      sealed = Array.isArray(sealed) ? sealed : [sealed];
      extended = Array.isArray(extended) ? extended : [extended];
      for (var i = 0; i < latest.length; i++) {
        // push original options and not sealed options to exclude duplicated options
        if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
          res.push(latest[i]);
        }
      }
      return res;
    } else {
      return latest;
    }
  }

  function Vue$3(options) {
    if ("development" !== 'production' && !(this instanceof Vue$3)) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue$3);
  stateMixin(Vue$3);
  eventsMixin(Vue$3);
  lifecycleMixin(Vue$3);
  renderMixin(Vue$3);

  /*  */

  function initUse(Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
      if (installedPlugins.indexOf(plugin) > -1) {
        return this;
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this;
    };
  }

  /*  */

  function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  /*  */

  function initExtend(Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId];
      }

      var name = extendOptions.name || Super.options.name;
      {
        if (!/^[a-zA-Z][\w-]*$/.test(name)) {
          warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characters and the hyphen, ' + 'and must start with a letter.');
        }
      }

      var Sub = function VueComponent(options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(Super.options, extendOptions);
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub;
    };
  }

  function initProps$1(Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1(Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (!definition) {
          return this.options[type + 's'][id];
        } else {
          /* istanbul ignore if */
          {
            if (type === 'component' && config.isReservedTag(id)) {
              warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
            }
          }
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition;
        }
      };
    });
  }

  /*  */

  var patternTypes = [String, RegExp, Array];

  function getComponentName(opts) {
    return opts && (opts.Ctor.options.name || opts.tag);
  }

  function matches(pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1;
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1;
    } else if (isRegExp(pattern)) {
      return pattern.test(name);
    }
    /* istanbul ignore next */
    return false;
  }

  function pruneCache(cache, current, filter) {
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          if (cachedNode !== current) {
            pruneCacheEntry(cachedNode);
          }
          cache[key] = null;
        }
      }
    }
  }

  function pruneCacheEntry(vnode) {
    if (vnode) {
      vnode.componentInstance.$destroy();
    }
  }

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes
    },

    created: function created() {
      this.cache = Object.create(null);
    },

    destroyed: function destroyed() {
      var this$1 = this;

      for (var key in this$1.cache) {
        pruneCacheEntry(this$1.cache[key]);
      }
    },

    watch: {
      include: function include(val) {
        pruneCache(this.cache, this._vnode, function (name) {
          return matches(val, name);
        });
      },
      exclude: function exclude(val) {
        pruneCache(this.cache, this._vnode, function (name) {
          return !matches(val, name);
        });
      }
    },

    render: function render() {
      var vnode = getFirstComponentChild(this.$slots.default);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        if (name && (this.include && !matches(this.include, name) || this.exclude && matches(this.exclude, name))) {
          return vnode;
        }
        var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;
        if (this.cache[key]) {
          vnode.componentInstance = this.cache[key].componentInstance;
        } else {
          this.cache[key] = vnode;
        }
        vnode.data.keepAlive = true;
      }
      return vnode;
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI(Vue) {
    // config
    var configDef = {};
    configDef.get = function () {
      return config;
    };
    {
      configDef.set = function () {
        warn('Do not replace the Vue.config object, set individual fields instead.');
      };
    }
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue$3);

  Object.defineProperty(Vue$3.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue$3.prototype, '$ssrContext', {
    get: function get() {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext;
    }
  });

  Vue$3.version = '2.4.2';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select');
  var mustUseProp = function (tag, type, attr) {
    return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : '';
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false;
  };

  /*  */

  function genClassForVnode(vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class);
  }

  function mergeClassData(child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class) ? [child.class, parent.class] : parent.class
    };
  }

  function renderClass(staticClass, dynamicClass) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass));
    }
    /* istanbul ignore next */
    return '';
  }

  function concat(a, b) {
    return a ? b ? a + ' ' + b : a : b || '';
  }

  function stringifyClass(value) {
    if (Array.isArray(value)) {
      return stringifyArray(value);
    }
    if (isObject(value)) {
      return stringifyObject(value);
    }
    if (typeof value === 'string') {
      return value;
    }
    /* istanbul ignore next */
    return '';
  }

  function stringifyArray(value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) {
          res += ' ';
        }
        res += stringified;
      }
    }
    return res;
  }

  function stringifyObject(value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) {
          res += ' ';
        }
        res += key;
      }
    }
    return res;
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot');

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

  var isPreTag = function (tag) {
    return tag === 'pre';
  };

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag);
  };

  function getTagNamespace(tag) {
    if (isSVG(tag)) {
      return 'svg';
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math';
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement(tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true;
    }
    if (isReservedTag(tag)) {
      return false;
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag];
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
    } else {
      return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
    }
  }

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query(el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        "development" !== 'production' && warn('Cannot find element: ' + el);
        return document.createElement('div');
      }
      return selected;
    } else {
      return el;
    }
  }

  /*  */

  function createElement$1(tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm;
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm;
  }

  function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
  }

  function createTextNode(text) {
    return document.createTextNode(text);
  }

  function createComment(text) {
    return document.createComment(text);
  }

  function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild(node, child) {
    node.removeChild(child);
  }

  function appendChild(node, child) {
    node.appendChild(child);
  }

  function parentNode(node) {
    return node.parentNode;
  }

  function nextSibling(node) {
    return node.nextSibling;
  }

  function tagName(node) {
    return node.tagName;
  }

  function setTextContent(node, text) {
    node.textContent = text;
  }

  function setAttribute(node, key, val) {
    node.setAttribute(key, val);
  }

  var nodeOps = Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setAttribute: setAttribute
  });

  /*  */

  var ref = {
    create: function create(_, vnode) {
      registerRef(vnode);
    },
    update: function update(oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy(vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef(vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!key) {
      return;
    }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
  
  /*
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode(a, b) {
    return a.key === b.key && (a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b) || isTrue(a.isAsyncPlaceholder) && a.asyncFactory === b.asyncFactory && isUndef(b.asyncFactory.error));
  }

  // Some browsers do not support dynamically changing type for <input>
  // so they need to be treated as different nodes
  function sameInputType(a, b) {
    if (a.tag !== 'input') {
      return true;
    }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB;
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) {
        map[key] = i;
      }
    }
    return map;
  }

  function createPatchFunction(backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt(elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
    }

    function createRmCb(childElm, listeners) {
      function remove$$1() {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1;
    }

    function removeNode(el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    var inPre = 0;
    function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return;
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {
        {
          if (data && data.pre) {
            inPre++;
          }
          if (!inPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) && config.isUnknownElement(tag)) {
            warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
          }
        }
        vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }

        if ("development" !== 'production' && data && data.pre) {
          inPre--;
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */, parentElm, refElm);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true;
        }
      }
    }

    function initComponent(vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break;
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert(parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (ref$$1.parentNode === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren(vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
      }
    }

    function isPatchable(vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag);
    }

    function invokeCreateHooks(vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) {
          i.create(emptyNode, vnode);
        }
        if (isDef(i.insert)) {
          insertedVnodeQueue.push(vnode);
        }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope(vnode) {
      var i;
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) && i !== vnode.context && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
    }

    function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
      }
    }

    function invokeDestroyHook(vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) {
          i(vnode);
        }
        for (i = 0; i < cbs.destroy.length; ++i) {
          cbs.destroy[i](vnode);
        }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else {
            // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook(vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, elmToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
          // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
          // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) {
            oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          }
          idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
          if (isUndef(idxInOld)) {
            // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            elmToMove = oldCh[idxInOld];
            /* istanbul ignore if */
            if ("development" !== 'production' && !elmToMove) {
              warn('It seems there are duplicate keys that is causing an update error. ' + 'Make sure each v-for item has a unique key.');
            }
            if (sameVnode(elmToMove, newStartVnode)) {
              patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
              newStartVnode = newCh[++newStartIdx];
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
              newStartVnode = newCh[++newStartIdx];
            }
          }
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
      if (oldVnode === vnode) {
        return;
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return;
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
        vnode.componentInstance = oldVnode.componentInstance;
        return;
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) {
          cbs.update[i](oldVnode, vnode);
        }
        if (isDef(i = data.hook) && isDef(i = i.update)) {
          i(oldVnode, vnode);
        }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) {
            updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
          }
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text)) {
            nodeOps.setTextContent(elm, '');
          }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
          i(oldVnode, vnode);
        }
      }
    }

    function invokeInsertHook(vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    var bailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate(elm, vnode, insertedVnodeQueue) {
      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.elm = elm;
        vnode.isAsyncPlaceholder = true;
        return true;
      }
      {
        if (!assertNodeMatch(elm, vnode)) {
          return false;
        }
      }
      vnode.elm = elm;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) {
          i(vnode, true /* hydrating */);
        }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true;
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
                childrenMatch = false;
                break;
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              if ("development" !== 'production' && typeof console !== 'undefined' && !bailed) {
                bailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false;
            }
          }
        }
        if (isDef(data)) {
          for (var key in data) {
            if (!isRenderedModule(key)) {
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break;
            }
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true;
    }

    function assertNodeMatch(node, vnode) {
      if (isDef(vnode.tag)) {
        return vnode.tag.indexOf('vue-component') === 0 || vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
      } else {
        return node.nodeType === (vnode.isComment ? 8 : 3);
      }
    }

    return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) {
          invokeDestroyHook(oldVnode);
        }
        return;
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue, parentElm, refElm);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode;
              } else {
                warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }
          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm$1 = nodeOps.parentNode(oldElm);
          createElm(vnode, insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1, nodeOps.nextSibling(oldElm));

          if (isDef(vnode.parent)) {
            // component root element replaced.
            // update parent placeholder node element, recursively
            var ancestor = vnode.parent;
            while (ancestor) {
              ancestor.elm = vnode.elm;
              ancestor = ancestor.parent;
            }
            if (isPatchable(vnode)) {
              for (var i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, vnode.parent);
              }
            }
          }

          if (isDef(parentElm$1)) {
            removeVnodes(parentElm$1, [oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm;
    };
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives(vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives(oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update(oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1(dirs, vm) {
    var res = Object.create(null);
    if (!dirs) {
      return res;
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    return res;
  }

  function getRawDirName(dir) {
    return dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.');
  }

  function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, "directive " + dir.name + " " + hook + " hook");
      }
    }
  }

  var baseModules = [ref, directives];

  /*  */

  function updateAttrs(oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return;
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return;
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    /* istanbul ignore if */
    if (isIE9 && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr(el, key, value) {
    if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, key);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass(oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (isUndef(data.staticClass) && isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class))) {
      return;
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  var validDivisionCharRE = /[\w).+\-_$\]]/;

  function parseFilters(exp) {
    var inSingle = false;
    var inDouble = false;
    var inTemplateString = false;
    var inRegex = false;
    var curly = 0;
    var square = 0;
    var paren = 0;
    var lastFilterIndex = 0;
    var c, prev, i, expression, filters;

    for (i = 0; i < exp.length; i++) {
      prev = c;
      c = exp.charCodeAt(i);
      if (inSingle) {
        if (c === 0x27 && prev !== 0x5C) {
          inSingle = false;
        }
      } else if (inDouble) {
        if (c === 0x22 && prev !== 0x5C) {
          inDouble = false;
        }
      } else if (inTemplateString) {
        if (c === 0x60 && prev !== 0x5C) {
          inTemplateString = false;
        }
      } else if (inRegex) {
        if (c === 0x2f && prev !== 0x5C) {
          inRegex = false;
        }
      } else if (c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C && exp.charCodeAt(i - 1) !== 0x7C && !curly && !square && !paren) {
        if (expression === undefined) {
          // first filter, end of expression
          lastFilterIndex = i + 1;
          expression = exp.slice(0, i).trim();
        } else {
          pushFilter();
        }
      } else {
        switch (c) {
          case 0x22:
            inDouble = true;break; // "
          case 0x27:
            inSingle = true;break; // '
          case 0x60:
            inTemplateString = true;break; // `
          case 0x28:
            paren++;break; // (
          case 0x29:
            paren--;break; // )
          case 0x5B:
            square++;break; // [
          case 0x5D:
            square--;break; // ]
          case 0x7B:
            curly++;break; // {
          case 0x7D:
            curly--;break; // }
        }
        if (c === 0x2f) {
          // /
          var j = i - 1;
          var p = void 0;
          // find first non-whitespace prev char
          for (; j >= 0; j--) {
            p = exp.charAt(j);
            if (p !== ' ') {
              break;
            }
          }
          if (!p || !validDivisionCharRE.test(p)) {
            inRegex = true;
          }
        }
      }
    }

    if (expression === undefined) {
      expression = exp.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
      pushFilter();
    }

    function pushFilter() {
      (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
      lastFilterIndex = i + 1;
    }

    if (filters) {
      for (i = 0; i < filters.length; i++) {
        expression = wrapFilter(expression, filters[i]);
      }
    }

    return expression;
  }

  function wrapFilter(exp, filter) {
    var i = filter.indexOf('(');
    if (i < 0) {
      // _f: resolveFilter
      return "_f(\"" + filter + "\")(" + exp + ")";
    } else {
      var name = filter.slice(0, i);
      var args = filter.slice(i + 1);
      return "_f(\"" + name + "\")(" + exp + "," + args;
    }
  }

  /*  */

  function baseWarn(msg) {
    console.error("[Vue compiler]: " + msg);
  }

  function pluckModuleFunction(modules, key) {
    return modules ? modules.map(function (m) {
      return m[key];
    }).filter(function (_) {
      return _;
    }) : [];
  }

  function addProp(el, name, value) {
    (el.props || (el.props = [])).push({ name: name, value: value });
  }

  function addAttr(el, name, value) {
    (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  }

  function addDirective(el, name, rawName, value, arg, modifiers) {
    (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
  }

  function addHandler(el, name, value, modifiers, important, warn) {
    // warn prevent and passive modifier
    /* istanbul ignore if */
    if ("development" !== 'production' && warn && modifiers && modifiers.prevent && modifiers.passive) {
      warn('passive and prevent can\'t be used together. ' + 'Passive handler can\'t prevent default event.');
    }
    // check capture modifier
    if (modifiers && modifiers.capture) {
      delete modifiers.capture;
      name = '!' + name; // mark the event as captured
    }
    if (modifiers && modifiers.once) {
      delete modifiers.once;
      name = '~' + name; // mark the event as once
    }
    /* istanbul ignore if */
    if (modifiers && modifiers.passive) {
      delete modifiers.passive;
      name = '&' + name; // mark the event as passive
    }
    var events;
    if (modifiers && modifiers.native) {
      delete modifiers.native;
      events = el.nativeEvents || (el.nativeEvents = {});
    } else {
      events = el.events || (el.events = {});
    }
    var newHandler = { value: value, modifiers: modifiers };
    var handlers = events[name];
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
    } else {
      events[name] = newHandler;
    }
  }

  function getBindingAttr(el, name, getStatic) {
    var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
    if (dynamicValue != null) {
      return parseFilters(dynamicValue);
    } else if (getStatic !== false) {
      var staticValue = getAndRemoveAttr(el, name);
      if (staticValue != null) {
        return JSON.stringify(staticValue);
      }
    }
  }

  function getAndRemoveAttr(el, name) {
    var val;
    if ((val = el.attrsMap[name]) != null) {
      var list = el.attrsList;
      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i].name === name) {
          list.splice(i, 1);
          break;
        }
      }
    }
    return val;
  }

  /*  */

  /**
   * Cross-platform code generation for component v-model
   */
  function genComponentModel(el, value, modifiers) {
    var ref = modifiers || {};
    var number = ref.number;
    var trim = ref.trim;

    var baseValueExpression = '$$v';
    var valueExpression = baseValueExpression;
    if (trim) {
      valueExpression = "(typeof " + baseValueExpression + " === 'string'" + "? " + baseValueExpression + ".trim()" + ": " + baseValueExpression + ")";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }
    var assignment = genAssignmentCode(value, valueExpression);

    el.model = {
      value: "(" + value + ")",
      expression: "\"" + value + "\"",
      callback: "function (" + baseValueExpression + ") {" + assignment + "}"
    };
  }

  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */
  function genAssignmentCode(value, assignment) {
    var modelRs = parseModel(value);
    if (modelRs.idx === null) {
      return value + "=" + assignment;
    } else {
      return "$set(" + modelRs.exp + ", " + modelRs.idx + ", " + assignment + ")";
    }
  }

  /**
   * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
   *
   * for loop possible cases:
   *
   * - test
   * - test[idx]
   * - test[test1[idx]]
   * - test["a"][idx]
   * - xxx.test[a[a].test1[idx]]
   * - test.xxx.a["asa"][test1[idx]]
   *
   */

  var len;
  var str;
  var chr;
  var index$1;
  var expressionPos;
  var expressionEndPos;

  function parseModel(val) {
    str = val;
    len = str.length;
    index$1 = expressionPos = expressionEndPos = 0;

    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
      return {
        exp: val,
        idx: null
      };
    }

    while (!eof()) {
      chr = next();
      /* istanbul ignore if */
      if (isStringStart(chr)) {
        parseString(chr);
      } else if (chr === 0x5B) {
        parseBracket(chr);
      }
    }

    return {
      exp: val.substring(0, expressionPos),
      idx: val.substring(expressionPos + 1, expressionEndPos)
    };
  }

  function next() {
    return str.charCodeAt(++index$1);
  }

  function eof() {
    return index$1 >= len;
  }

  function isStringStart(chr) {
    return chr === 0x22 || chr === 0x27;
  }

  function parseBracket(chr) {
    var inBracket = 1;
    expressionPos = index$1;
    while (!eof()) {
      chr = next();
      if (isStringStart(chr)) {
        parseString(chr);
        continue;
      }
      if (chr === 0x5B) {
        inBracket++;
      }
      if (chr === 0x5D) {
        inBracket--;
      }
      if (inBracket === 0) {
        expressionEndPos = index$1;
        break;
      }
    }
  }

  function parseString(chr) {
    var stringQuote = chr;
    while (!eof()) {
      chr = next();
      if (chr === stringQuote) {
        break;
      }
    }
  }

  /*  */

  var warn$1;

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  function model(el, dir, _warn) {
    warn$1 = _warn;
    var value = dir.value;
    var modifiers = dir.modifiers;
    var tag = el.tag;
    var type = el.attrsMap.type;

    {
      var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
      if (tag === 'input' && dynamicType) {
        warn$1("<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" + "v-model does not support dynamic input types. Use v-if branches instead.");
      }
      // inputs with type="file" are read only and setting the input's
      // value will throw an error.
      if (tag === 'input' && type === 'file') {
        warn$1("<" + el.tag + " v-model=\"" + value + "\" type=\"file\">:\n" + "File inputs are read only. Use a v-on:change listener instead.");
      }
    }

    if (el.component) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false;
    } else if (tag === 'select') {
      genSelect(el, value, modifiers);
    } else if (tag === 'input' && type === 'checkbox') {
      genCheckboxModel(el, value, modifiers);
    } else if (tag === 'input' && type === 'radio') {
      genRadioModel(el, value, modifiers);
    } else if (tag === 'input' || tag === 'textarea') {
      genDefaultModel(el, value, modifiers);
    } else if (!config.isReservedTag(tag)) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false;
    } else {
      warn$1("<" + el.tag + " v-model=\"" + value + "\">: " + "v-model is not supported on this element type. " + 'If you are working with contenteditable, it\'s recommended to ' + 'wrap a library dedicated for that purpose inside a custom component.');
    }

    // ensure runtime directive metadata
    return true;
  }

  function genCheckboxModel(el, value, modifiers) {
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr(el, 'value') || 'null';
    var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
    var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
    addProp(el, 'checked', "Array.isArray(" + value + ")" + "?_i(" + value + "," + valueBinding + ")>-1" + (trueValueBinding === 'true' ? ":(" + value + ")" : ":_q(" + value + "," + trueValueBinding + ")"));
    addHandler(el, CHECKBOX_RADIO_TOKEN, "var $$a=" + value + "," + '$$el=$event.target,' + "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" + 'if(Array.isArray($$a)){' + "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," + '$$i=_i($$a,$$v);' + "if($$el.checked){$$i<0&&(" + value + "=$$a.concat($$v))}" + "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" + "}else{" + genAssignmentCode(value, '$$c') + "}", null, true);
  }

  function genRadioModel(el, value, modifiers) {
    var number = modifiers && modifiers.number;
    var valueBinding = getBindingAttr(el, 'value') || 'null';
    valueBinding = number ? "_n(" + valueBinding + ")" : valueBinding;
    addProp(el, 'checked', "_q(" + value + "," + valueBinding + ")");
    addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
  }

  function genSelect(el, value, modifiers) {
    var number = modifiers && modifiers.number;
    var selectedVal = "Array.prototype.filter" + ".call($event.target.options,function(o){return o.selected})" + ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" + "return " + (number ? '_n(val)' : 'val') + "})";

    var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
    var code = "var $$selectedVal = " + selectedVal + ";";
    code = code + " " + genAssignmentCode(value, assignment);
    addHandler(el, 'change', code, null, true);
  }

  function genDefaultModel(el, value, modifiers) {
    var type = el.attrsMap.type;
    var ref = modifiers || {};
    var lazy = ref.lazy;
    var number = ref.number;
    var trim = ref.trim;
    var needCompositionGuard = !lazy && type !== 'range';
    var event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';

    var valueExpression = '$event.target.value';
    if (trim) {
      valueExpression = "$event.target.value.trim()";
    }
    if (number) {
      valueExpression = "_n(" + valueExpression + ")";
    }

    var code = genAssignmentCode(value, valueExpression);
    if (needCompositionGuard) {
      code = "if($event.target.composing)return;" + code;
    }

    addProp(el, 'value', "(" + value + ")");
    addHandler(el, event, code, null, true);
    if (trim || number) {
      addHandler(el, 'blur', '$forceUpdate()');
    }
  }

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents(on) {
    var event;
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      // Chrome fires microtasks in between click/change, leads to #4521
      event = isChrome ? 'click' : 'change';
      on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function add$1(event, handler, once$$1, capture, passive) {
    if (once$$1) {
      var oldHandler = handler;
      var _target = target$1; // save current target element in closure
      handler = function (ev) {
        var res = arguments.length === 1 ? oldHandler(ev) : oldHandler.apply(null, arguments);
        if (res !== null) {
          remove$2(event, handler, capture, _target);
        }
      };
    }
    target$1.addEventListener(event, handler, supportsPassive ? { capture: capture, passive: passive } : capture);
  }

  function remove$2(event, handler, capture, _target) {
    (_target || target$1).removeEventListener(event, handler, capture);
  }

  function updateDOMListeners(oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return;
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  function updateDOMProps(oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return;
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (isUndef(props[key])) {
        elm[key] = '';
      }
    }
    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) {
          vnode.children.length = 0;
        }
        if (cur === oldProps[key]) {
          continue;
        }
      }

      if (key === 'value') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, vnode, strCur)) {
          elm.value = strCur;
        }
      } else {
        elm[key] = cur;
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue(elm, vnode, checkVal) {
    return !elm.composing && (vnode.tag === 'option' || isDirty(elm, checkVal) || isInputChanged(elm, checkVal));
  }

  function isDirty(elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try {
      notInFocus = document.activeElement !== elm;
    } catch (e) {}
    return notInFocus && elm.value !== checkVal;
  }

  function isInputChanged(elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers) && modifiers.number) {
      return toNumber(value) !== toNumber(newVal);
    }
    if (isDef(modifiers) && modifiers.trim) {
      return value.trim() !== newVal.trim();
    }
    return value !== newVal;
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res;
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData(data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle ? extend(data.staticStyle, style) : style;
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding(bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle);
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle);
    }
    return bindingStyle;
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle(vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
          extend(res, styleData);
        }
      }
    }

    if (styleData = normalizeStyleData(vnode.data)) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while (parentNode = parentNode.parent) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res;
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(name, val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && prop in emptyStyle) {
      return prop;
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name;
      }
    }
  });

  function updateStyle(oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)) {
      return;
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likley wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return;
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(function (c) {
          return el.classList.add(c);
        });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return;
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(function (c) {
          return el.classList.remove(c);
        });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition(def$$1) {
    if (!def$$1) {
      return;
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res;
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1);
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: name + "-enter",
      enterToClass: name + "-enter-to",
      enterActiveClass: name + "-enter-active",
      leaveClass: name + "-leave",
      leaveToClass: name + "-leave-to",
      leaveActiveClass: name + "-leave-active"
    };
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout;

  function nextFrame(fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass(el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass(el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds(el, expectedType, cb) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) {
      return cb();
    }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo(el, expectedType) {
    var styles = window.getComputedStyle(el);
    var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
    var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = styles[animationProp + 'Delay'].split(', ');
    var animationDurations = styles[animationProp + 'Duration'].split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
      propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }
    var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    };
  }

  function getTimeout(delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i]);
    }));
  }

  function toMs(s) {
    return Number(s.slice(0, -1)) * 1000;
  }

  /*  */

  function enter(vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return;
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return;
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      transitionNode = transitionNode.parent;
      context = transitionNode.context;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return;
    }

    var startClass = isAppear && appearClass ? appearClass : enterClass;
    var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
    var toClass = isAppear && appearToClass ? appearToClass : enterToClass;

    var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
    var enterHook = isAppear ? typeof appear === 'function' ? appear : enter : enter;
    var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
    var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;

    var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);

    if ("development" !== 'production' && explicitEnterDuration != null) {
      checkDuration(explicitEnterDuration, 'enter', vnode);
    }

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        addTransitionClass(el, toClass);
        removeTransitionClass(el, startClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave(vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return rm();
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb) || el.nodeType !== 1) {
      return;
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);

    if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
      checkDuration(explicitLeaveDuration, 'leave', vnode);
    }

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave() {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return;
      }
      // record leaving element
      if (!vnode.data.show) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          addTransitionClass(el, leaveToClass);
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled && !userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  // only used in dev mode
  function checkDuration(val, name, vnode) {
    if (typeof val !== 'number') {
      warn("<transition> explicit " + name + " duration is not a valid number - " + "got " + JSON.stringify(val) + ".", vnode.context);
    } else if (isNaN(val)) {
      warn("<transition> explicit " + name + " duration is NaN - " + 'the duration expression might be incorrect.', vnode.context);
    }
  }

  function isValidDuration(val) {
    return typeof val === 'number' && !isNaN(val);
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength(fn) {
    if (isUndef(fn)) {
      return false;
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
    } else {
      return (fn._length || fn.length) > 1;
    }
  }

  function _enter(_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1(vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [attrs, klass, events, domProps, style, transition];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var model$1 = {
    inserted: function inserted(el, binding, vnode) {
      if (vnode.tag === 'select') {
        var cb = function () {
          setSelected(el, binding, vnode.context);
        };
        cb();
        /* istanbul ignore if */
        if (isIE || isEdge) {
          setTimeout(cb, 0);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          if (!isAndroid) {
            el.addEventListener('compositionstart', onCompositionStart);
            el.addEventListener('compositionend', onCompositionEnd);
          }
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },
    componentUpdated: function componentUpdated(el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) {
          return !looseEqual(o, prevOptions[i]);
        })) {
          trigger(el, 'change');
        }
      }
    }
  };

  function setSelected(el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      "development" !== 'production' && warn("<select multiple v-model=\"" + binding.expression + "\"> " + "expects an Array value for its binding, but got " + Object.prototype.toString.call(value).slice(8, -1), vm);
      return;
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return;
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function getValue(option) {
    return '_value' in option ? option._value : option.value;
  }

  function onCompositionStart(e) {
    e.target.composing = true;
  }

  function onCompositionEnd(e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) {
      return;
    }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode(vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
  }

  var show = {
    bind: function bind(el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update(el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (value === oldValue) {
        return;
      }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: model$1,
    show: show
  };

  /*  */

  // Provides transition support for a single element/component.
  // supports transition mode (out-in / in-out)

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild(vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children));
    } else {
      return vnode;
    }
  }

  function extractTransitionData(comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data;
  }

  function placeholder(h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      });
    }
  }

  function hasParentTransition(vnode) {
    while (vnode = vnode.parent) {
      if (vnode.data.transition) {
        return true;
      }
    }
  }

  function isSameChild(child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag;
  }

  function isAsyncPlaceholder(node) {
    return node.isComment && node.asyncFactory;
  }

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render(h) {
      var this$1 = this;

      var children = this.$options._renderChildren;
      if (!children) {
        return;
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(function (c) {
        return c.tag || isAsyncPlaceholder(c);
      });
      /* istanbul ignore if */
      if (!children.length) {
        return;
      }

      // warn multiple elements
      if ("development" !== 'production' && children.length > 1) {
        warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
      }

      var mode = this.mode;

      // warn invalid mode
      if ("development" !== 'production' && mode && mode !== 'in-out' && mode !== 'out-in') {
        warn('invalid <transition> mode: ' + mode, this.$parent);
      }

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild;
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild;
      }

      if (this._leaving) {
        return placeholder(h, rawChild);
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + this._uid + "-";
      child.key = child.key == null ? child.isComment ? id + 'comment' : id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(function (d) {
        return d.name === 'show';
      })) {
        child.data.show = true;
      }

      if (oldChild && oldChild.data && !isSameChild(child, oldChild) && !isAsyncPlaceholder(oldChild)) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild && (oldChild.data.transition = extend({}, data));
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild);
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild;
          }
          var delayedLeave;
          var performLeave = function () {
            delayedLeave();
          };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) {
            delayedLeave = leave;
          });
        }
      }

      return rawChild;
    }
  };

  /*  */

  // Provides transition support for list items.
  // supports move transitions using the FLIP technique.

  // Because the vdom's children update algorithm is "unstable" - i.e.
  // it doesn't guarantee the relative positioning of removed elements,
  // we force transition-group to update its children into two passes:
  // in the first pass, we remove all nodes that need to be removed,
  // triggering their leaving transition; in the second pass, we insert/move
  // into the final desired state. This way in the second pass removed
  // nodes will remain where they should be.

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    render: function render(h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c;(c.data || (c.data = {})).transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
            warn("<transition-group> children must be keyed: <" + name + ">");
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children);
    },

    beforeUpdate: function beforeUpdate() {
      // force removing pass
      this.__patch__(this._vnode, this.kept, false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
      );
      this._vnode = this.kept;
    },

    updated: function updated() {
      var children = this.prevChildren;
      var moveClass = this.moveClass || (this.name || 'v') + '-move';
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return;
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      var body = document.body;
      var f = body.offsetHeight; // eslint-disable-line

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove(el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false;
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove;
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) {
            removeClass(clone, cls);
          });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return this._hasMove = info.hasTransform;
      }
    }
  };

  function callPendingCbs(c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition(c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation(c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue$3.config.mustUseProp = mustUseProp;
  Vue$3.config.isReservedTag = isReservedTag;
  Vue$3.config.isReservedAttr = isReservedAttr;
  Vue$3.config.getTagNamespace = getTagNamespace;
  Vue$3.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue$3.options.directives, platformDirectives);
  extend(Vue$3.options.components, platformComponents);

  // install platform patch function
  Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue$3.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating);
  };

  // devtools global hook
  /* istanbul ignore next */
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue$3);
      } else if ("development" !== 'production' && isChrome) {
        console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
      }
    }
    if ("development" !== 'production' && config.productionTip !== false && inBrowser && typeof console !== 'undefined') {
      console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" + "Make sure to turn on production mode when deploying for production.\n" + "See more tips at https://vuejs.org/guide/deployment.html");
    }
  }, 0);

  /*  */

  // check whether current browser encodes a char inside attribute values
  function shouldDecode(content, encoded) {
    var div = document.createElement('div');
    div.innerHTML = "<div a=\"" + content + "\"/>";
    return div.innerHTML.indexOf(encoded) > 0;
  }

  // #3663
  // IE encodes newlines inside attribute values while other browsers don't
  var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

  /*  */

  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

  var buildRegex = cached(function (delimiters) {
    var open = delimiters[0].replace(regexEscapeRE, '\\$&');
    var close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
  });

  function parseText(text, delimiters) {
    var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
    if (!tagRE.test(text)) {
      return;
    }
    var tokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match, index;
    while (match = tagRE.exec(text)) {
      index = match.index;
      // push text token
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // tag token
      var exp = parseFilters(match[1].trim());
      tokens.push("_s(" + exp + ")");
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    return tokens.join('+');
  }

  /*  */

  function transformNode(el, options) {
    var warn = options.warn || baseWarn;
    var staticClass = getAndRemoveAttr(el, 'class');
    if ("development" !== 'production' && staticClass) {
      var expression = parseText(staticClass, options.delimiters);
      if (expression) {
        warn("class=\"" + staticClass + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div class="{{ val }}">, use <div :class="val">.');
      }
    }
    if (staticClass) {
      el.staticClass = JSON.stringify(staticClass);
    }
    var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
    if (classBinding) {
      el.classBinding = classBinding;
    }
  }

  function genData(el) {
    var data = '';
    if (el.staticClass) {
      data += "staticClass:" + el.staticClass + ",";
    }
    if (el.classBinding) {
      data += "class:" + el.classBinding + ",";
    }
    return data;
  }

  var klass$1 = {
    staticKeys: ['staticClass'],
    transformNode: transformNode,
    genData: genData
  };

  /*  */

  function transformNode$1(el, options) {
    var warn = options.warn || baseWarn;
    var staticStyle = getAndRemoveAttr(el, 'style');
    if (staticStyle) {
      /* istanbul ignore if */
      {
        var expression = parseText(staticStyle, options.delimiters);
        if (expression) {
          warn("style=\"" + staticStyle + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div style="{{ val }}">, use <div :style="val">.');
        }
      }
      el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
    }

    var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
    if (styleBinding) {
      el.styleBinding = styleBinding;
    }
  }

  function genData$1(el) {
    var data = '';
    if (el.staticStyle) {
      data += "staticStyle:" + el.staticStyle + ",";
    }
    if (el.styleBinding) {
      data += "style:(" + el.styleBinding + "),";
    }
    return data;
  }

  var style$1 = {
    staticKeys: ['staticStyle'],
    transformNode: transformNode$1,
    genData: genData$1
  };

  var modules$1 = [klass$1, style$1];

  /*  */

  function text(el, dir) {
    if (dir.value) {
      addProp(el, 'textContent', "_s(" + dir.value + ")");
    }
  }

  /*  */

  function html(el, dir) {
    if (dir.value) {
      addProp(el, 'innerHTML', "_s(" + dir.value + ")");
    }
  }

  var directives$1 = {
    model: model,
    text: text,
    html: html
  };

  /*  */

  var isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' + 'link,meta,param,source,track,wbr');

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  var isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' + 'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' + 'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' + 'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' + 'title,tr,track');

  /*  */

  var baseOptions = {
    expectHTML: true,
    modules: modules$1,
    directives: directives$1,
    isPreTag: isPreTag,
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp,
    canBeLeftOpenTag: canBeLeftOpenTag,
    isReservedTag: isReservedTag,
    getTagNamespace: getTagNamespace,
    staticKeys: genStaticKeys(modules$1)
  };

  /*  */

  var decoder;

  var he = {
    decode: function decode(html) {
      decoder = decoder || document.createElement('div');
      decoder.innerHTML = html;
      return decoder.textContent;
    }
  };

  /**
   * Not type-checking this file because it's mostly vendor code.
   */

  /*!
   * HTML Parser By John Resig (ejohn.org)
   * Modified by Juriy "kangax" Zaytsev
   * Original code by Erik Arvidsson, Mozilla Public License
   * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
   */

  // Regular Expressions for parsing tags and attributes
  var singleAttrIdentifier = /([^\s"'<>/=]+)/;
  var singleAttrAssign = /(?:=)/;
  var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source];
  var attribute = new RegExp('^\\s*' + singleAttrIdentifier.source + '(?:\\s*(' + singleAttrAssign.source + ')' + '\\s*(?:' + singleAttrValues.join('|') + '))?');

  // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
  // but for Vue templates we can enforce a simple charset
  var ncname = '[a-zA-Z_][\\w\\-\\.]*';
  var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
  var startTagOpen = new RegExp('^<' + qnameCapture);
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
  var doctype = /^<!DOCTYPE [^>]+>/i;
  var comment = /^<!--/;
  var conditionalComment = /^<!\[/;

  var IS_REGEX_CAPTURING_BROKEN = false;
  'x'.replace(/x(.)?/g, function (m, g) {
    IS_REGEX_CAPTURING_BROKEN = g === '';
  });

  // Special Elements (can contain anything)
  var isPlainTextElement = makeMap('script,style,textarea', true);
  var reCache = {};

  var decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n'
  };
  var encodedAttr = /&(?:lt|gt|quot|amp);/g;
  var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

  // #5992
  var isIgnoreNewlineTag = makeMap('pre,textarea', true);
  var shouldIgnoreFirstNewline = function (tag, html) {
    return tag && isIgnoreNewlineTag(tag) && html[0] === '\n';
  };

  function decodeAttr(value, shouldDecodeNewlines) {
    var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
    return value.replace(re, function (match) {
      return decodingMap[match];
    });
  }

  function parseHTML(html, options) {
    var stack = [];
    var expectHTML = options.expectHTML;
    var isUnaryTag$$1 = options.isUnaryTag || no;
    var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
    var index = 0;
    var last, lastTag;
    while (html) {
      last = html;
      // Make sure we're not in a plaintext content element like script/style
      if (!lastTag || !isPlainTextElement(lastTag)) {
        var textEnd = html.indexOf('<');
        if (textEnd === 0) {
          // Comment:
          if (comment.test(html)) {
            var commentEnd = html.indexOf('-->');

            if (commentEnd >= 0) {
              if (options.shouldKeepComment) {
                options.comment(html.substring(4, commentEnd));
              }
              advance(commentEnd + 3);
              continue;
            }
          }

          // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
          if (conditionalComment.test(html)) {
            var conditionalEnd = html.indexOf(']>');

            if (conditionalEnd >= 0) {
              advance(conditionalEnd + 2);
              continue;
            }
          }

          // Doctype:
          var doctypeMatch = html.match(doctype);
          if (doctypeMatch) {
            advance(doctypeMatch[0].length);
            continue;
          }

          // End tag:
          var endTagMatch = html.match(endTag);
          if (endTagMatch) {
            var curIndex = index;
            advance(endTagMatch[0].length);
            parseEndTag(endTagMatch[1], curIndex, index);
            continue;
          }

          // Start tag:
          var startTagMatch = parseStartTag();
          if (startTagMatch) {
            handleStartTag(startTagMatch);
            if (shouldIgnoreFirstNewline(lastTag, html)) {
              advance(1);
            }
            continue;
          }
        }

        var text = void 0,
            rest = void 0,
            next = void 0;
        if (textEnd >= 0) {
          rest = html.slice(textEnd);
          while (!endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest)) {
            // < in plain text, be forgiving and treat it as text
            next = rest.indexOf('<', 1);
            if (next < 0) {
              break;
            }
            textEnd += next;
            rest = html.slice(textEnd);
          }
          text = html.substring(0, textEnd);
          advance(textEnd);
        }

        if (textEnd < 0) {
          text = html;
          html = '';
        }

        if (options.chars && text) {
          options.chars(text);
        }
      } else {
        var endTagLength = 0;
        var stackedTag = lastTag.toLowerCase();
        var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
        var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
          endTagLength = endTag.length;
          if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
            text = text.replace(/<!--([\s\S]*?)-->/g, '$1').replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
          }
          if (shouldIgnoreFirstNewline(stackedTag, text)) {
            text = text.slice(1);
          }
          if (options.chars) {
            options.chars(text);
          }
          return '';
        });
        index += html.length - rest$1.length;
        html = rest$1;
        parseEndTag(stackedTag, index - endTagLength, index);
      }

      if (html === last) {
        options.chars && options.chars(html);
        if ("development" !== 'production' && !stack.length && options.warn) {
          options.warn("Mal-formatted tag at end of template: \"" + html + "\"");
        }
        break;
      }
    }

    // Clean up any remaining tags
    parseEndTag();

    function advance(n) {
      index += n;
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: [],
          start: index
        };
        advance(start[0].length);
        var end, attr;
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push(attr);
        }
        if (end) {
          match.unarySlash = end[1];
          advance(end[0].length);
          match.end = index;
          return match;
        }
      }
    }

    function handleStartTag(match) {
      var tagName = match.tagName;
      var unarySlash = match.unarySlash;

      if (expectHTML) {
        if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
          parseEndTag(lastTag);
        }
        if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
          parseEndTag(tagName);
        }
      }

      var unary = isUnaryTag$$1(tagName) || !!unarySlash;

      var l = match.attrs.length;
      var attrs = new Array(l);
      for (var i = 0; i < l; i++) {
        var args = match.attrs[i];
        // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
        if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
          if (args[3] === '') {
            delete args[3];
          }
          if (args[4] === '') {
            delete args[4];
          }
          if (args[5] === '') {
            delete args[5];
          }
        }
        var value = args[3] || args[4] || args[5] || '';
        attrs[i] = {
          name: args[1],
          value: decodeAttr(value, options.shouldDecodeNewlines)
        };
      }

      if (!unary) {
        stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
        lastTag = tagName;
      }

      if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
      }
    }

    function parseEndTag(tagName, start, end) {
      var pos, lowerCasedTagName;
      if (start == null) {
        start = index;
      }
      if (end == null) {
        end = index;
      }

      if (tagName) {
        lowerCasedTagName = tagName.toLowerCase();
      }

      // Find the closest opened tag of the same type
      if (tagName) {
        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].lowerCasedTag === lowerCasedTagName) {
            break;
          }
        }
      } else {
        // If no tag name is provided, clean shop
        pos = 0;
      }

      if (pos >= 0) {
        // Close all the open elements, up the stack
        for (var i = stack.length - 1; i >= pos; i--) {
          if ("development" !== 'production' && (i > pos || !tagName) && options.warn) {
            options.warn("tag <" + stack[i].tag + "> has no matching end tag.");
          }
          if (options.end) {
            options.end(stack[i].tag, start, end);
          }
        }

        // Remove the open elements from the stack
        stack.length = pos;
        lastTag = pos && stack[pos - 1].tag;
      } else if (lowerCasedTagName === 'br') {
        if (options.start) {
          options.start(tagName, [], true, start, end);
        }
      } else if (lowerCasedTagName === 'p') {
        if (options.start) {
          options.start(tagName, [], false, start, end);
        }
        if (options.end) {
          options.end(tagName, start, end);
        }
      }
    }
  }

  /*  */

  var onRE = /^@|^v-on:/;
  var dirRE = /^v-|^@|^:/;
  var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
  var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

  var argRE = /:(.*)$/;
  var bindRE = /^:|^v-bind:/;
  var modifierRE = /\.[^.]+/g;

  var decodeHTMLCached = cached(he.decode);

  // configurable state
  var warn$2;
  var delimiters;
  var transforms;
  var preTransforms;
  var postTransforms;
  var platformIsPreTag;
  var platformMustUseProp;
  var platformGetTagNamespace;

  /**
   * Convert HTML string to AST.
   */
  function parse(template, options) {
    warn$2 = options.warn || baseWarn;

    platformIsPreTag = options.isPreTag || no;
    platformMustUseProp = options.mustUseProp || no;
    platformGetTagNamespace = options.getTagNamespace || no;

    transforms = pluckModuleFunction(options.modules, 'transformNode');
    preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
    postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

    delimiters = options.delimiters;

    var stack = [];
    var preserveWhitespace = options.preserveWhitespace !== false;
    var root;
    var currentParent;
    var inVPre = false;
    var inPre = false;
    var warned = false;

    function warnOnce(msg) {
      if (!warned) {
        warned = true;
        warn$2(msg);
      }
    }

    function endPre(element) {
      // check pre state
      if (element.pre) {
        inVPre = false;
      }
      if (platformIsPreTag(element.tag)) {
        inPre = false;
      }
    }

    parseHTML(template, {
      warn: warn$2,
      expectHTML: options.expectHTML,
      isUnaryTag: options.isUnaryTag,
      canBeLeftOpenTag: options.canBeLeftOpenTag,
      shouldDecodeNewlines: options.shouldDecodeNewlines,
      shouldKeepComment: options.comments,
      start: function start(tag, attrs, unary) {
        // check namespace.
        // inherit parent ns if there is one
        var ns = currentParent && currentParent.ns || platformGetTagNamespace(tag);

        // handle IE svg bug
        /* istanbul ignore if */
        if (isIE && ns === 'svg') {
          attrs = guardIESVGBug(attrs);
        }

        var element = {
          type: 1,
          tag: tag,
          attrsList: attrs,
          attrsMap: makeAttrsMap(attrs),
          parent: currentParent,
          children: []
        };
        if (ns) {
          element.ns = ns;
        }

        if (isForbiddenTag(element) && !isServerRendering()) {
          element.forbidden = true;
          "development" !== 'production' && warn$2('Templates should only be responsible for mapping the state to the ' + 'UI. Avoid placing tags with side-effects in your templates, such as ' + "<" + tag + ">" + ', as they will not be parsed.');
        }

        // apply pre-transforms
        for (var i = 0; i < preTransforms.length; i++) {
          preTransforms[i](element, options);
        }

        if (!inVPre) {
          processPre(element);
          if (element.pre) {
            inVPre = true;
          }
        }
        if (platformIsPreTag(element.tag)) {
          inPre = true;
        }
        if (inVPre) {
          processRawAttrs(element);
        } else {
          processFor(element);
          processIf(element);
          processOnce(element);
          processKey(element);

          // determine whether this is a plain element after
          // removing structural attributes
          element.plain = !element.key && !attrs.length;

          processRef(element);
          processSlot(element);
          processComponent(element);
          for (var i$1 = 0; i$1 < transforms.length; i$1++) {
            transforms[i$1](element, options);
          }
          processAttrs(element);
        }

        function checkRootConstraints(el) {
          {
            if (el.tag === 'slot' || el.tag === 'template') {
              warnOnce("Cannot use <" + el.tag + "> as component root element because it may " + 'contain multiple nodes.');
            }
            if (el.attrsMap.hasOwnProperty('v-for')) {
              warnOnce('Cannot use v-for on stateful component root element because ' + 'it renders multiple elements.');
            }
          }
        }

        // tree management
        if (!root) {
          root = element;
          checkRootConstraints(root);
        } else if (!stack.length) {
          // allow root elements with v-if, v-else-if and v-else
          if (root.if && (element.elseif || element.else)) {
            checkRootConstraints(element);
            addIfCondition(root, {
              exp: element.elseif,
              block: element
            });
          } else {
            warnOnce("Component template should contain exactly one root element. " + "If you are using v-if on multiple elements, " + "use v-else-if to chain them instead.");
          }
        }
        if (currentParent && !element.forbidden) {
          if (element.elseif || element.else) {
            processIfConditions(element, currentParent);
          } else if (element.slotScope) {
            // scoped slot
            currentParent.plain = false;
            var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
          } else {
            currentParent.children.push(element);
            element.parent = currentParent;
          }
        }
        if (!unary) {
          currentParent = element;
          stack.push(element);
        } else {
          endPre(element);
        }
        // apply post-transforms
        for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
          postTransforms[i$2](element, options);
        }
      },

      end: function end() {
        // remove trailing whitespace
        var element = stack[stack.length - 1];
        var lastNode = element.children[element.children.length - 1];
        if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
          element.children.pop();
        }
        // pop stack
        stack.length -= 1;
        currentParent = stack[stack.length - 1];
        endPre(element);
      },

      chars: function chars(text) {
        if (!currentParent) {
          {
            if (text === template) {
              warnOnce('Component template requires a root element, rather than just text.');
            } else if (text = text.trim()) {
              warnOnce("text \"" + text + "\" outside root element will be ignored.");
            }
          }
          return;
        }
        // IE textarea placeholder bug
        /* istanbul ignore if */
        if (isIE && currentParent.tag === 'textarea' && currentParent.attrsMap.placeholder === text) {
          return;
        }
        var children = currentParent.children;
        text = inPre || text.trim() ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
        if (text) {
          var expression;
          if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
            children.push({
              type: 2,
              expression: expression,
              text: text
            });
          } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
            children.push({
              type: 3,
              text: text
            });
          }
        }
      },
      comment: function comment(text) {
        currentParent.children.push({
          type: 3,
          text: text,
          isComment: true
        });
      }
    });
    return root;
  }

  function processPre(el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
      el.pre = true;
    }
  }

  function processRawAttrs(el) {
    var l = el.attrsList.length;
    if (l) {
      var attrs = el.attrs = new Array(l);
      for (var i = 0; i < l; i++) {
        attrs[i] = {
          name: el.attrsList[i].name,
          value: JSON.stringify(el.attrsList[i].value)
        };
      }
    } else if (!el.pre) {
      // non root node in pre blocks with no attributes
      el.plain = true;
    }
  }

  function processKey(el) {
    var exp = getBindingAttr(el, 'key');
    if (exp) {
      if ("development" !== 'production' && el.tag === 'template') {
        warn$2("<template> cannot be keyed. Place the key on real elements instead.");
      }
      el.key = exp;
    }
  }

  function processRef(el) {
    var ref = getBindingAttr(el, 'ref');
    if (ref) {
      el.ref = ref;
      el.refInFor = checkInFor(el);
    }
  }

  function processFor(el) {
    var exp;
    if (exp = getAndRemoveAttr(el, 'v-for')) {
      var inMatch = exp.match(forAliasRE);
      if (!inMatch) {
        "development" !== 'production' && warn$2("Invalid v-for expression: " + exp);
        return;
      }
      el.for = inMatch[2].trim();
      var alias = inMatch[1].trim();
      var iteratorMatch = alias.match(forIteratorRE);
      if (iteratorMatch) {
        el.alias = iteratorMatch[1].trim();
        el.iterator1 = iteratorMatch[2].trim();
        if (iteratorMatch[3]) {
          el.iterator2 = iteratorMatch[3].trim();
        }
      } else {
        el.alias = alias;
      }
    }
  }

  function processIf(el) {
    var exp = getAndRemoveAttr(el, 'v-if');
    if (exp) {
      el.if = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) {
        el.else = true;
      }
      var elseif = getAndRemoveAttr(el, 'v-else-if');
      if (elseif) {
        el.elseif = elseif;
      }
    }
  }

  function processIfConditions(el, parent) {
    var prev = findPrevElement(parent.children);
    if (prev && prev.if) {
      addIfCondition(prev, {
        exp: el.elseif,
        block: el
      });
    } else {
      warn$2("v-" + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + " " + "used on element <" + el.tag + "> without corresponding v-if.");
    }
  }

  function findPrevElement(children) {
    var i = children.length;
    while (i--) {
      if (children[i].type === 1) {
        return children[i];
      } else {
        if ("development" !== 'production' && children[i].text !== ' ') {
          warn$2("text \"" + children[i].text.trim() + "\" between v-if and v-else(-if) " + "will be ignored.");
        }
        children.pop();
      }
    }
  }

  function addIfCondition(el, condition) {
    if (!el.ifConditions) {
      el.ifConditions = [];
    }
    el.ifConditions.push(condition);
  }

  function processOnce(el) {
    var once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
      el.once = true;
    }
  }

  function processSlot(el) {
    if (el.tag === 'slot') {
      el.slotName = getBindingAttr(el, 'name');
      if ("development" !== 'production' && el.key) {
        warn$2("`key` does not work on <slot> because slots are abstract outlets " + "and can possibly expand into multiple elements. " + "Use the key on a wrapping element instead.");
      }
    } else {
      var slotTarget = getBindingAttr(el, 'slot');
      if (slotTarget) {
        el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      }
      if (el.tag === 'template') {
        el.slotScope = getAndRemoveAttr(el, 'scope');
      }
    }
  }

  function processComponent(el) {
    var binding;
    if (binding = getBindingAttr(el, 'is')) {
      el.component = binding;
    }
    if (getAndRemoveAttr(el, 'inline-template') != null) {
      el.inlineTemplate = true;
    }
  }

  function processAttrs(el) {
    var list = el.attrsList;
    var i, l, name, rawName, value, modifiers, isProp;
    for (i = 0, l = list.length; i < l; i++) {
      name = rawName = list[i].name;
      value = list[i].value;
      if (dirRE.test(name)) {
        // mark element as dynamic
        el.hasBindings = true;
        // modifiers
        modifiers = parseModifiers(name);
        if (modifiers) {
          name = name.replace(modifierRE, '');
        }
        if (bindRE.test(name)) {
          // v-bind
          name = name.replace(bindRE, '');
          value = parseFilters(value);
          isProp = false;
          if (modifiers) {
            if (modifiers.prop) {
              isProp = true;
              name = camelize(name);
              if (name === 'innerHtml') {
                name = 'innerHTML';
              }
            }
            if (modifiers.camel) {
              name = camelize(name);
            }
            if (modifiers.sync) {
              addHandler(el, "update:" + camelize(name), genAssignmentCode(value, "$event"));
            }
          }
          if (isProp || !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)) {
            addProp(el, name, value);
          } else {
            addAttr(el, name, value);
          }
        } else if (onRE.test(name)) {
          // v-on
          name = name.replace(onRE, '');
          addHandler(el, name, value, modifiers, false, warn$2);
        } else {
          // normal directives
          name = name.replace(dirRE, '');
          // parse arg
          var argMatch = name.match(argRE);
          var arg = argMatch && argMatch[1];
          if (arg) {
            name = name.slice(0, -(arg.length + 1));
          }
          addDirective(el, name, rawName, value, arg, modifiers);
          if ("development" !== 'production' && name === 'model') {
            checkForAliasModel(el, value);
          }
        }
      } else {
        // literal attribute
        {
          var expression = parseText(value, delimiters);
          if (expression) {
            warn$2(name + "=\"" + value + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div id="{{ val }}">, use <div :id="val">.');
          }
        }
        addAttr(el, name, JSON.stringify(value));
      }
    }
  }

  function checkInFor(el) {
    var parent = el;
    while (parent) {
      if (parent.for !== undefined) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  function parseModifiers(name) {
    var match = name.match(modifierRE);
    if (match) {
      var ret = {};
      match.forEach(function (m) {
        ret[m.slice(1)] = true;
      });
      return ret;
    }
  }

  function makeAttrsMap(attrs) {
    var map = {};
    for (var i = 0, l = attrs.length; i < l; i++) {
      if ("development" !== 'production' && map[attrs[i].name] && !isIE && !isEdge) {
        warn$2('duplicate attribute: ' + attrs[i].name);
      }
      map[attrs[i].name] = attrs[i].value;
    }
    return map;
  }

  // for script (e.g. type="x/template") or style, do not decode content
  function isTextTag(el) {
    return el.tag === 'script' || el.tag === 'style';
  }

  function isForbiddenTag(el) {
    return el.tag === 'style' || el.tag === 'script' && (!el.attrsMap.type || el.attrsMap.type === 'text/javascript');
  }

  var ieNSBug = /^xmlns:NS\d+/;
  var ieNSPrefix = /^NS\d+:/;

  /* istanbul ignore next */
  function guardIESVGBug(attrs) {
    var res = [];
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (!ieNSBug.test(attr.name)) {
        attr.name = attr.name.replace(ieNSPrefix, '');
        res.push(attr);
      }
    }
    return res;
  }

  function checkForAliasModel(el, value) {
    var _el = el;
    while (_el) {
      if (_el.for && _el.alias === value) {
        warn$2("<" + el.tag + " v-model=\"" + value + "\">: " + "You are binding v-model directly to a v-for iteration alias. " + "This will not be able to modify the v-for source array because " + "writing to the alias is like modifying a function local variable. " + "Consider using an array of objects and use v-model on an object property instead.");
      }
      _el = _el.parent;
    }
  }

  /*  */

  var isStaticKey;
  var isPlatformReservedTag;

  var genStaticKeysCached = cached(genStaticKeys$1);

  /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  function optimize(root, options) {
    if (!root) {
      return;
    }
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // first pass: mark all non-static nodes.
    markStatic$1(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
  }

  function genStaticKeys$1(keys) {
    return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs' + (keys ? ',' + keys : ''));
  }

  function markStatic$1(node) {
    node.static = isStatic(node);
    if (node.type === 1) {
      // do not make component slot content static. this avoids
      // 1. components not able to mutate slot nodes
      // 2. static slot content fails for hot-reloading
      if (!isPlatformReservedTag(node.tag) && node.tag !== 'slot' && node.attrsMap['inline-template'] == null) {
        return;
      }
      for (var i = 0, l = node.children.length; i < l; i++) {
        var child = node.children[i];
        markStatic$1(child);
        if (!child.static) {
          node.static = false;
        }
      }
      if (node.ifConditions) {
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          var block = node.ifConditions[i$1].block;
          markStatic$1(block);
          if (!block.static) {
            node.static = false;
          }
        }
      }
    }
  }

  function markStaticRoots(node, isInFor) {
    if (node.type === 1) {
      if (node.static || node.once) {
        node.staticInFor = isInFor;
      }
      // For a node to qualify as a static root, it should have children that
      // are not just static text. Otherwise the cost of hoisting out will
      // outweigh the benefits and it's better off to just always render it fresh.
      if (node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
        node.staticRoot = true;
        return;
      } else {
        node.staticRoot = false;
      }
      if (node.children) {
        for (var i = 0, l = node.children.length; i < l; i++) {
          markStaticRoots(node.children[i], isInFor || !!node.for);
        }
      }
      if (node.ifConditions) {
        for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
          markStaticRoots(node.ifConditions[i$1].block, isInFor);
        }
      }
    }
  }

  function isStatic(node) {
    if (node.type === 2) {
      // expression
      return false;
    }
    if (node.type === 3) {
      // text
      return true;
    }
    return !!(node.pre || !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) && Object.keys(node).every(isStaticKey));
  }

  function isDirectChildOfTemplateFor(node) {
    while (node.parent) {
      node = node.parent;
      if (node.tag !== 'template') {
        return false;
      }
      if (node.for) {
        return true;
      }
    }
    return false;
  }

  /*  */

  var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
  var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

  // keyCode aliases
  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    'delete': [8, 46]
  };

  // #4868: modifiers that prevent the execution of the listener
  // need to explicitly return null so that we can determine whether to remove
  // the listener for .once
  var genGuard = function (condition) {
    return "if(" + condition + ")return null;";
  };

  var modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: genGuard("$event.target !== $event.currentTarget"),
    ctrl: genGuard("!$event.ctrlKey"),
    shift: genGuard("!$event.shiftKey"),
    alt: genGuard("!$event.altKey"),
    meta: genGuard("!$event.metaKey"),
    left: genGuard("'button' in $event && $event.button !== 0"),
    middle: genGuard("'button' in $event && $event.button !== 1"),
    right: genGuard("'button' in $event && $event.button !== 2")
  };

  function genHandlers(events, isNative, warn) {
    var res = isNative ? 'nativeOn:{' : 'on:{';
    for (var name in events) {
      var handler = events[name];
      // #5330: warn click.right, since right clicks do not actually fire click events.
      if ("development" !== 'production' && name === 'click' && handler && handler.modifiers && handler.modifiers.right) {
        warn("Use \"contextmenu\" instead of \"click.right\" since right clicks " + "do not actually fire \"click\" events.");
      }
      res += "\"" + name + "\":" + genHandler(name, handler) + ",";
    }
    return res.slice(0, -1) + '}';
  }

  function genHandler(name, handler) {
    if (!handler) {
      return 'function(){}';
    }

    if (Array.isArray(handler)) {
      return "[" + handler.map(function (handler) {
        return genHandler(name, handler);
      }).join(',') + "]";
    }

    var isMethodPath = simplePathRE.test(handler.value);
    var isFunctionExpression = fnExpRE.test(handler.value);

    if (!handler.modifiers) {
      return isMethodPath || isFunctionExpression ? handler.value : "function($event){" + handler.value + "}"; // inline statement
    } else {
      var code = '';
      var genModifierCode = '';
      var keys = [];
      for (var key in handler.modifiers) {
        if (modifierCode[key]) {
          genModifierCode += modifierCode[key];
          // left/right
          if (keyCodes[key]) {
            keys.push(key);
          }
        } else {
          keys.push(key);
        }
      }
      if (keys.length) {
        code += genKeyFilter(keys);
      }
      // Make sure modifiers like prevent and stop get executed after key filtering
      if (genModifierCode) {
        code += genModifierCode;
      }
      var handlerCode = isMethodPath ? handler.value + '($event)' : isFunctionExpression ? "(" + handler.value + ")($event)" : handler.value;
      return "function($event){" + code + handlerCode + "}";
    }
  }

  function genKeyFilter(keys) {
    return "if(!('button' in $event)&&" + keys.map(genFilterCode).join('&&') + ")return null;";
  }

  function genFilterCode(key) {
    var keyVal = parseInt(key, 10);
    if (keyVal) {
      return "$event.keyCode!==" + keyVal;
    }
    var alias = keyCodes[key];
    return "_k($event.keyCode," + JSON.stringify(key) + (alias ? ',' + JSON.stringify(alias) : '') + ")";
  }

  /*  */

  function on(el, dir) {
    if ("development" !== 'production' && dir.modifiers) {
      warn("v-on without argument does not support modifiers.");
    }
    el.wrapListeners = function (code) {
      return "_g(" + code + "," + dir.value + ")";
    };
  }

  /*  */

  function bind$1(el, dir) {
    el.wrapData = function (code) {
      return "_b(" + code + ",'" + el.tag + "'," + dir.value + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")";
    };
  }

  /*  */

  var baseDirectives = {
    on: on,
    bind: bind$1,
    cloak: noop
  };

  /*  */

  var CodegenState = function CodegenState(options) {
    this.options = options;
    this.warn = options.warn || baseWarn;
    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
    this.directives = extend(extend({}, baseDirectives), options.directives);
    var isReservedTag = options.isReservedTag || no;
    this.maybeComponent = function (el) {
      return !isReservedTag(el.tag);
    };
    this.onceId = 0;
    this.staticRenderFns = [];
  };

  function generate(ast, options) {
    var state = new CodegenState(options);
    var code = ast ? genElement(ast, state) : '_c("div")';
    return {
      render: "with(this){return " + code + "}",
      staticRenderFns: state.staticRenderFns
    };
  }

  function genElement(el, state) {
    if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el, state);
    } else if (el.once && !el.onceProcessed) {
      return genOnce(el, state);
    } else if (el.for && !el.forProcessed) {
      return genFor(el, state);
    } else if (el.if && !el.ifProcessed) {
      return genIf(el, state);
    } else if (el.tag === 'template' && !el.slotTarget) {
      return genChildren(el, state) || 'void 0';
    } else if (el.tag === 'slot') {
      return genSlot(el, state);
    } else {
      // component or element
      var code;
      if (el.component) {
        code = genComponent(el.component, el, state);
      } else {
        var data = el.plain ? undefined : genData$2(el, state);

        var children = el.inlineTemplate ? null : genChildren(el, state, true);
        code = "_c('" + el.tag + "'" + (data ? "," + data : '') + (children ? "," + children : '') + ")";
      }
      // module transforms
      for (var i = 0; i < state.transforms.length; i++) {
        code = state.transforms[i](el, code);
      }
      return code;
    }
  }

  // hoist static sub-trees out
  function genStatic(el, state) {
    el.staticProcessed = true;
    state.staticRenderFns.push("with(this){return " + genElement(el, state) + "}");
    return "_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")";
  }

  // v-once
  function genOnce(el, state) {
    el.onceProcessed = true;
    if (el.if && !el.ifProcessed) {
      return genIf(el, state);
    } else if (el.staticInFor) {
      var key = '';
      var parent = el.parent;
      while (parent) {
        if (parent.for) {
          key = parent.key;
          break;
        }
        parent = parent.parent;
      }
      if (!key) {
        "development" !== 'production' && state.warn("v-once can only be used inside v-for that is keyed. ");
        return genElement(el, state);
      }
      return "_o(" + genElement(el, state) + "," + state.onceId++ + (key ? "," + key : "") + ")";
    } else {
      return genStatic(el, state);
    }
  }

  function genIf(el, state, altGen, altEmpty) {
    el.ifProcessed = true; // avoid recursion
    return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty);
  }

  function genIfConditions(conditions, state, altGen, altEmpty) {
    if (!conditions.length) {
      return altEmpty || '_e()';
    }

    var condition = conditions.shift();
    if (condition.exp) {
      return "(" + condition.exp + ")?" + genTernaryExp(condition.block) + ":" + genIfConditions(conditions, state, altGen, altEmpty);
    } else {
      return "" + genTernaryExp(condition.block);
    }

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp(el) {
      return altGen ? altGen(el, state) : el.once ? genOnce(el, state) : genElement(el, state);
    }
  }

  function genFor(el, state, altGen, altHelper) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
    var iterator2 = el.iterator2 ? "," + el.iterator2 : '';

    if ("development" !== 'production' && state.maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key) {
      state.warn("<" + el.tag + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " + "v-for should have explicit keys. " + "See https://vuejs.org/guide/list.html#key for more info.", true /* tip */
      );
    }

    el.forProcessed = true; // avoid recursion
    return (altHelper || '_l') + "((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + (altGen || genElement)(el, state) + '})';
  }

  function genData$2(el, state) {
    var data = '{';

    // directives first.
    // directives may mutate the el's other properties before they are generated.
    var dirs = genDirectives(el, state);
    if (dirs) {
      data += dirs + ',';
    }

    // key
    if (el.key) {
      data += "key:" + el.key + ",";
    }
    // ref
    if (el.ref) {
      data += "ref:" + el.ref + ",";
    }
    if (el.refInFor) {
      data += "refInFor:true,";
    }
    // pre
    if (el.pre) {
      data += "pre:true,";
    }
    // record original tag name for components using "is" attribute
    if (el.component) {
      data += "tag:\"" + el.tag + "\",";
    }
    // module data generation functions
    for (var i = 0; i < state.dataGenFns.length; i++) {
      data += state.dataGenFns[i](el);
    }
    // attributes
    if (el.attrs) {
      data += "attrs:{" + genProps(el.attrs) + "},";
    }
    // DOM props
    if (el.props) {
      data += "domProps:{" + genProps(el.props) + "},";
    }
    // event handlers
    if (el.events) {
      data += genHandlers(el.events, false, state.warn) + ",";
    }
    if (el.nativeEvents) {
      data += genHandlers(el.nativeEvents, true, state.warn) + ",";
    }
    // slot target
    if (el.slotTarget) {
      data += "slot:" + el.slotTarget + ",";
    }
    // scoped slots
    if (el.scopedSlots) {
      data += genScopedSlots(el.scopedSlots, state) + ",";
    }
    // component v-model
    if (el.model) {
      data += "model:{value:" + el.model.value + ",callback:" + el.model.callback + ",expression:" + el.model.expression + "},";
    }
    // inline-template
    if (el.inlineTemplate) {
      var inlineTemplate = genInlineTemplate(el, state);
      if (inlineTemplate) {
        data += inlineTemplate + ",";
      }
    }
    data = data.replace(/,$/, '') + '}';
    // v-bind data wrap
    if (el.wrapData) {
      data = el.wrapData(data);
    }
    // v-on data wrap
    if (el.wrapListeners) {
      data = el.wrapListeners(data);
    }
    return data;
  }

  function genDirectives(el, state) {
    var dirs = el.directives;
    if (!dirs) {
      return;
    }
    var res = 'directives:[';
    var hasRuntime = false;
    var i, l, dir, needRuntime;
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i];
      needRuntime = true;
      var gen = state.directives[dir.name];
      if (gen) {
        // compile-time directive that manipulates AST.
        // returns true if it also needs a runtime counterpart.
        needRuntime = !!gen(el, dir, state.warn);
      }
      if (needRuntime) {
        hasRuntime = true;
        res += "{name:\"" + dir.name + "\",rawName:\"" + dir.rawName + "\"" + (dir.value ? ",value:(" + dir.value + "),expression:" + JSON.stringify(dir.value) : '') + (dir.arg ? ",arg:\"" + dir.arg + "\"" : '') + (dir.modifiers ? ",modifiers:" + JSON.stringify(dir.modifiers) : '') + "},";
      }
    }
    if (hasRuntime) {
      return res.slice(0, -1) + ']';
    }
  }

  function genInlineTemplate(el, state) {
    var ast = el.children[0];
    if ("development" !== 'production' && (el.children.length > 1 || ast.type !== 1)) {
      state.warn('Inline-template components must have exactly one child element.');
    }
    if (ast.type === 1) {
      var inlineRenderFns = generate(ast, state.options);
      return "inlineTemplate:{render:function(){" + inlineRenderFns.render + "},staticRenderFns:[" + inlineRenderFns.staticRenderFns.map(function (code) {
        return "function(){" + code + "}";
      }).join(',') + "]}";
    }
  }

  function genScopedSlots(slots, state) {
    return "scopedSlots:_u([" + Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state);
    }).join(',') + "])";
  }

  function genScopedSlot(key, el, state) {
    if (el.for && !el.forProcessed) {
      return genForScopedSlot(key, el, state);
    }
    return "{key:" + key + ",fn:function(" + String(el.attrsMap.scope) + "){" + "return " + (el.tag === 'template' ? genChildren(el, state) || 'void 0' : genElement(el, state)) + "}}";
  }

  function genForScopedSlot(key, el, state) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
    var iterator2 = el.iterator2 ? "," + el.iterator2 : '';
    el.forProcessed = true; // avoid recursion
    return "_l((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + genScopedSlot(key, el, state) + '})';
  }

  function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
    var children = el.children;
    if (children.length) {
      var el$1 = children[0];
      // optimize single v-for
      if (children.length === 1 && el$1.for && el$1.tag !== 'template' && el$1.tag !== 'slot') {
        return (altGenElement || genElement)(el$1, state);
      }
      var normalizationType = checkSkip ? getNormalizationType(children, state.maybeComponent) : 0;
      var gen = altGenNode || genNode;
      return "[" + children.map(function (c) {
        return gen(c, state);
      }).join(',') + "]" + (normalizationType ? "," + normalizationType : '');
    }
  }

  // determine the normalization needed for the children array.
  // 0: no normalization needed
  // 1: simple normalization needed (possible 1-level deep nested array)
  // 2: full normalization needed
  function getNormalizationType(children, maybeComponent) {
    var res = 0;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (el.type !== 1) {
        continue;
      }
      if (needsNormalization(el) || el.ifConditions && el.ifConditions.some(function (c) {
        return needsNormalization(c.block);
      })) {
        res = 2;
        break;
      }
      if (maybeComponent(el) || el.ifConditions && el.ifConditions.some(function (c) {
        return maybeComponent(c.block);
      })) {
        res = 1;
      }
    }
    return res;
  }

  function needsNormalization(el) {
    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot';
  }

  function genNode(node, state) {
    if (node.type === 1) {
      return genElement(node, state);
    }if (node.type === 3 && node.isComment) {
      return genComment(node);
    } else {
      return genText(node);
    }
  }

  function genText(text) {
    return "_v(" + (text.type === 2 ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")";
  }

  function genComment(comment) {
    return "_e(" + JSON.stringify(comment.text) + ")";
  }

  function genSlot(el, state) {
    var slotName = el.slotName || '"default"';
    var children = genChildren(el, state);
    var res = "_t(" + slotName + (children ? "," + children : '');
    var attrs = el.attrs && "{" + el.attrs.map(function (a) {
      return camelize(a.name) + ":" + a.value;
    }).join(',') + "}";
    var bind$$1 = el.attrsMap['v-bind'];
    if ((attrs || bind$$1) && !children) {
      res += ",null";
    }
    if (attrs) {
      res += "," + attrs;
    }
    if (bind$$1) {
      res += (attrs ? '' : ',null') + "," + bind$$1;
    }
    return res + ')';
  }

  // componentName is el.component, take it as argument to shun flow's pessimistic refinement
  function genComponent(componentName, el, state) {
    var children = el.inlineTemplate ? null : genChildren(el, state, true);
    return "_c(" + componentName + "," + genData$2(el, state) + (children ? "," + children : '') + ")";
  }

  function genProps(props) {
    var res = '';
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      res += "\"" + prop.name + "\":" + transformSpecialNewlines(prop.value) + ",";
    }
    return res.slice(0, -1);
  }

  // #3895, #4268
  function transformSpecialNewlines(text) {
    return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  }

  /*  */

  // these keywords should not appear inside expressions, but operators like
  // typeof, instanceof and in are allowed
  var prohibitedKeywordRE = new RegExp('\\b' + ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' + 'super,throw,while,yield,delete,export,import,return,switch,default,' + 'extends,finally,continue,debugger,function,arguments').split(',').join('\\b|\\b') + '\\b');

  // these unary operators should not be used as property/method names
  var unaryOperatorsRE = new RegExp('\\b' + 'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

  // check valid identifier for v-for
  var identRE = /[A-Za-z_$][\w$]*/;

  // strip strings in expressions
  var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

  // detect problematic expressions in a template
  function detectErrors(ast) {
    var errors = [];
    if (ast) {
      checkNode(ast, errors);
    }
    return errors;
  }

  function checkNode(node, errors) {
    if (node.type === 1) {
      for (var name in node.attrsMap) {
        if (dirRE.test(name)) {
          var value = node.attrsMap[name];
          if (value) {
            if (name === 'v-for') {
              checkFor(node, "v-for=\"" + value + "\"", errors);
            } else if (onRE.test(name)) {
              checkEvent(value, name + "=\"" + value + "\"", errors);
            } else {
              checkExpression(value, name + "=\"" + value + "\"", errors);
            }
          }
        }
      }
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          checkNode(node.children[i], errors);
        }
      }
    } else if (node.type === 2) {
      checkExpression(node.expression, node.text, errors);
    }
  }

  function checkEvent(exp, text, errors) {
    var stipped = exp.replace(stripStringRE, '');
    var keywordMatch = stipped.match(unaryOperatorsRE);
    if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
      errors.push("avoid using JavaScript unary operator as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim());
    }
    checkExpression(exp, text, errors);
  }

  function checkFor(node, text, errors) {
    checkExpression(node.for || '', text, errors);
    checkIdentifier(node.alias, 'v-for alias', text, errors);
    checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
    checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
  }

  function checkIdentifier(ident, type, text, errors) {
    if (typeof ident === 'string' && !identRE.test(ident)) {
      errors.push("invalid " + type + " \"" + ident + "\" in expression: " + text.trim());
    }
  }

  function checkExpression(exp, text, errors) {
    try {
      new Function("return " + exp);
    } catch (e) {
      var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
      if (keywordMatch) {
        errors.push("avoid using JavaScript keyword as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim());
      } else {
        errors.push("invalid expression: " + text.trim());
      }
    }
  }

  /*  */

  function createFunction(code, errors) {
    try {
      return new Function(code);
    } catch (err) {
      errors.push({ err: err, code: code });
      return noop;
    }
  }

  function createCompileToFunctionFn(compile) {
    var cache = Object.create(null);

    return function compileToFunctions(template, options, vm) {
      options = options || {};

      /* istanbul ignore if */
      {
        // detect possible CSP restriction
        try {
          new Function('return 1');
        } catch (e) {
          if (e.toString().match(/unsafe-eval|CSP/)) {
            warn('It seems you are using the standalone build of Vue.js in an ' + 'environment with Content Security Policy that prohibits unsafe-eval. ' + 'The template compiler cannot work in this environment. Consider ' + 'relaxing the policy to allow unsafe-eval or pre-compiling your ' + 'templates into render functions.');
          }
        }
      }

      // check cache
      var key = options.delimiters ? String(options.delimiters) + template : template;
      if (cache[key]) {
        return cache[key];
      }

      // compile
      var compiled = compile(template, options);

      // check compilation errors/tips
      {
        if (compiled.errors && compiled.errors.length) {
          warn("Error compiling template:\n\n" + template + "\n\n" + compiled.errors.map(function (e) {
            return "- " + e;
          }).join('\n') + '\n', vm);
        }
        if (compiled.tips && compiled.tips.length) {
          compiled.tips.forEach(function (msg) {
            return tip(msg, vm);
          });
        }
      }

      // turn code into functions
      var res = {};
      var fnGenErrors = [];
      res.render = createFunction(compiled.render, fnGenErrors);
      res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
        return createFunction(code, fnGenErrors);
      });

      // check function generation errors.
      // this should only happen if there is a bug in the compiler itself.
      // mostly for codegen development use
      /* istanbul ignore if */
      {
        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
          warn("Failed to generate render function:\n\n" + fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return err.toString() + " in\n\n" + code + "\n";
          }).join('\n'), vm);
        }
      }

      return cache[key] = res;
    };
  }

  /*  */

  function createCompilerCreator(baseCompile) {
    return function createCompiler(baseOptions) {
      function compile(template, options) {
        var finalOptions = Object.create(baseOptions);
        var errors = [];
        var tips = [];
        finalOptions.warn = function (msg, tip) {
          (tip ? tips : errors).push(msg);
        };

        if (options) {
          // merge custom modules
          if (options.modules) {
            finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
          }
          // merge custom directives
          if (options.directives) {
            finalOptions.directives = extend(Object.create(baseOptions.directives), options.directives);
          }
          // copy other options
          for (var key in options) {
            if (key !== 'modules' && key !== 'directives') {
              finalOptions[key] = options[key];
            }
          }
        }

        var compiled = baseCompile(template, finalOptions);
        {
          errors.push.apply(errors, detectErrors(compiled.ast));
        }
        compiled.errors = errors;
        compiled.tips = tips;
        return compiled;
      }

      return {
        compile: compile,
        compileToFunctions: createCompileToFunctionFn(compile)
      };
    };
  }

  /*  */

  // `createCompilerCreator` allows creating compilers that use alternative
  // parser/optimizer/codegen, e.g the SSR optimizing compiler.
  // Here we just export a default compiler using the default parts.
  var createCompiler = createCompilerCreator(function baseCompile(template, options) {
    var ast = parse(template.trim(), options);
    optimize(ast, options);
    var code = generate(ast, options);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    };
  });

  /*  */

  var ref$1 = createCompiler(baseOptions);
  var compileToFunctions = ref$1.compileToFunctions;

  /*  */

  var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML;
  });

  var mount = Vue$3.prototype.$mount;
  Vue$3.prototype.$mount = function (el, hydrating) {
    el = el && query(el);

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
      "development" !== 'production' && warn("Do not mount Vue to <html> or <body> - mount to normal elements instead.");
      return this;
    }

    var options = this.$options;
    // resolve template/el and convert to render function
    if (!options.render) {
      var template = options.template;
      if (template) {
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            template = idToTemplate(template);
            /* istanbul ignore if */
            if ("development" !== 'production' && !template) {
              warn("Template element not found or is empty: " + options.template, this);
            }
          }
        } else if (template.nodeType) {
          template = template.innerHTML;
        } else {
          {
            warn('invalid template option:' + template, this);
          }
          return this;
        }
      } else if (el) {
        template = getOuterHTML(el);
      }
      if (template) {
        /* istanbul ignore if */
        if ("development" !== 'production' && config.performance && mark) {
          mark('compile');
        }

        var ref = compileToFunctions(template, {
          shouldDecodeNewlines: shouldDecodeNewlines,
          delimiters: options.delimiters,
          comments: options.comments
        }, this);
        var render = ref.render;
        var staticRenderFns = ref.staticRenderFns;
        options.render = render;
        options.staticRenderFns = staticRenderFns;

        /* istanbul ignore if */
        if ("development" !== 'production' && config.performance && mark) {
          mark('compile end');
          measure(this._name + " compile", 'compile', 'compile end');
        }
      }
    }
    return mount.call(this, el, hydrating);
  };

  /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */
  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    } else {
      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
  }

  Vue$3.compile = compileToFunctions;

  return Vue$3;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_app_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_router__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_resource__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_muse_ui__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_muse_ui___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_muse_ui__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_muse_ui_dist_muse_ui_css__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_muse_ui_dist_muse_ui_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_muse_ui_dist_muse_ui_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_muse_ui_dist_theme_teal_css__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_muse_ui_dist_theme_teal_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_muse_ui_dist_theme_teal_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__vue_home_vue__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__vue_square_vue__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__vue_me_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__vue_new_vue__ = __webpack_require__(28);
/*
* @Author: ChengLin
* @Date:   2017-07-26 11:11:06
* @Last Modified by:   ChengLin
* @Last Modified time: 2017-07-31 17:21:18
*/






//请求数据的模块，类似于ajax

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_3_vue_resource__["a" /* default */]);



 // 使用 teal 主题
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_4_muse_ui___default.a);
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.config.productionTip = false;

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vue_router__["a" /* default */]);






//实例化VueRouter
const router = new __WEBPACK_IMPORTED_MODULE_2_vue_router__["a" /* default */]({
	routes: [{
		path: '/',
		name: 'Home',
		component: __WEBPACK_IMPORTED_MODULE_7__vue_home_vue__["a" /* default */]
	}, {
		path: '/square',
		name: 'Square',
		component: __WEBPACK_IMPORTED_MODULE_8__vue_square_vue__["a" /* default */]
	}, {
		path: '/me',
		name: 'Me',
		component: __WEBPACK_IMPORTED_MODULE_9__vue_me_vue__["a" /* default */]
	}, {
		path: '/new',
		name: 'New',
		component: __WEBPACK_IMPORTED_MODULE_10__vue_new_vue__["a" /* default */]
	}]
});

var vm = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a({
	el: "#app",
	router,
	template: '<app></app>',
	components: {
		App: __WEBPACK_IMPORTED_MODULE_1__vue_app_vue__["a" /* default */]
	}
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3b6e276c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__ = __webpack_require__(8);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(6)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3b6e276c_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\vue\\app.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] app.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3b6e276c", Component.options)
  } else {
    hotAPI.reload("data-v-3b6e276c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			bottomNav: 'recents'
		};
	},
	methods: {
		handleChange(val) {
			this.bottomNav = val;
		}
	}
});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "page"
    }
  }, [_c('mu-appbar', {
    attrs: {
      "title": "Title"
    }
  }, [_c('mu-icon-button', {
    attrs: {
      "icon": "menu"
    },
    slot: "left"
  }), _vm._v(" "), _c('mu-flat-button', {
    attrs: {
      "label": "expand_more"
    },
    slot: "right"
  }), _vm._v(" "), _c('mu-icon-button', {
    attrs: {
      "icon": "expand_more"
    },
    slot: "right"
  })], 1), _vm._v(" "), _c('router-view'), _vm._v(" "), _c('div', {
    staticClass: "bottom"
  }, [_c('mu-paper', [_c('mu-bottom-nav', {
    attrs: {
      "value": _vm.bottomNav
    },
    on: {
      "change": _vm.handleChange
    }
  }, [_c('mu-bottom-nav-item', {
    attrs: {
      "value": "recents",
      "title": "主页",
      "icon": "restore",
      "to": "/"
    }
  }), _vm._v(" "), _c('mu-bottom-nav-item', {
    attrs: {
      "value": "favorites",
      "title": "广场",
      "icon": "favorite",
      "to": "/square"
    }
  }), _vm._v(" "), _c('mu-bottom-nav-item', {
    attrs: {
      "value": "nearby",
      "title": "我",
      "icon": "location_on",
      "to": "/me"
    }
  })], 1)], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3b6e276c", esExports)
  }
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v2.7.0
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert(condition, message) {
  if (!condition) {
    throw new Error("[vue-router] " + message);
  }
}

function warn(condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn("[vue-router] " + message);
  }
}

function isError(err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1;
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render(_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children);
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h();
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (val && current !== vm || !val && current === vm) {
        matched.instances[name] = val;
      }
    }

    // also regiseter instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    data.props = resolveProps(route, matched.props && matched.props[name]);

    return h(component, data, children);
  }
};

function resolveProps(route, config) {
  switch (typeof config) {
    case 'undefined':
      return;
    case 'object':
      return config;
    case 'function':
      return config(route);
    case 'boolean':
      return config ? route.params : undefined;
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(false, "props in \"" + route.path + "\" is a " + typeof config + ", " + "expecting an object, function or boolean.");
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) {
  return '%' + c.charCodeAt(0).toString(16);
};
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) {
  return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
};

var decode = decodeURIComponent;

function resolveQuery(query, extraQuery, _parseQuery) {
  if (extraQuery === void 0) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    var val = extraQuery[key];
    parsedQuery[key] = Array.isArray(val) ? val.slice() : val;
  }
  return parsedQuery;
}

function parseQuery(query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res;
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0 ? decode(parts.join('=')) : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res;
}

function stringifyQuery(obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return '';
    }

    if (val === null) {
      return encode(key);
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return;
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&');
    }

    return encode(key) + '=' + encode(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : null;
  return res ? "?" + res : '';
}

/*  */

var trailingSlashRE = /\/?$/;

function createRoute(record, location, redirectedFrom, router) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;
  var route = {
    name: location.name || record && record.name,
    meta: record && record.meta || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route);
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch(record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res;
}

function getFullPath(ref, _stringifyQuery) {
  var path = ref.path;
  var query = ref.query;if (query === void 0) query = {};
  var hash = ref.hash;if (hash === void 0) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash;
}

function isSameRoute(a, b) {
  if (b === START) {
    return a === b;
  } else if (!b) {
    return false;
  } else if (a.path && b.path) {
    return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') && a.hash === b.hash && isObjectEqual(a.query, b.query);
  } else if (a.name && b.name) {
    return a.name === b.name && a.hash === b.hash && isObjectEqual(a.query, b.query) && isObjectEqual(a.params, b.params);
  } else {
    return false;
  }
}

function isObjectEqual(a, b) {
  if (a === void 0) a = {};
  if (b === void 0) b = {};

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal);
    }
    return String(aVal) === String(bVal);
  });
}

function isIncludedRoute(current, target) {
  return current.path.replace(trailingSlashRE, '/').indexOf(target.path.replace(trailingSlashRE, '/')) === 0 && (!target.hash || current.hash === target.hash) && queryIncludes(current.query, target.query);
}

function queryIncludes(current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false;
    }
  }
  return true;
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render(h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null ? 'router-link-active' : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null ? 'router-link-exact-active' : globalExactActiveClass;
    var activeClass = this.activeClass == null ? activeClassFallback : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null ? exactActiveClassFallback : this.exactActiveClass;
    var compareTarget = location.path ? createRoute(null, location, null, router) : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact ? classes[exactActiveClass] : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) {
        on[e] = handler;
      });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default);
  }
};

function guardEvent(e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
    return;
  }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) {
    return;
  }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) {
    return;
  }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) {
      return;
    }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true;
}

function findAnchor(children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child;
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child;
      }
    }
  }
}

var _Vue;

function install(Vue) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) {
    return v !== undefined;
  };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed() {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get() {
      return this._routerRoot._router;
    }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get() {
      return this._routerRoot._route;
    }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath(relative, base, append) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative;
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative;
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/');
}

function parsePath(path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  };
}

function cleanPath(path) {
  return path.replace(/\/\//g, '/');
}

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
// Match escaped characters that would otherwise appear in future matches.
// This allows the user to escape special characters that won't transform.
'(\\\\.)',
// Match Express-style parameters and un-named parameters with a prefix
// and optional suffixes. Matches appear as:
//
// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse(str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue;
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile(str, options) {
  return tokensToFunction(parse(str, options));
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty(str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk(str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue;
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue;
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined');
        }
      }

      if (index$1(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
        }

        if (value.length === 0) {
          if (token.optional) {
            continue;
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty');
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue;
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
      }

      path += token.prefix + segment;
    }

    return path;
  };
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup(group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys(re, keys) {
  re.keys = keys;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags(options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp(path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp(path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys);
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp(path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options);
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp(tokens, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp(path, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */keys);
  }

  if (index$1(path)) {
    return arrayToRegexp( /** @type {!Array} */path, /** @type {!Array} */keys, options);
  }

  return stringToRegexp( /** @type {string} */path, /** @type {!Array} */keys, options);
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

var regexpCompileCache = Object.create(null);

function fillParams(path, params, routeMsg) {
  try {
    var filler = regexpCompileCache[path] || (regexpCompileCache[path] = index.compile(path));
    return filler(params || {}, { pretty: true });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, "missing param for " + routeMsg + ": " + e.message);
    }
    return '';
  }
}

/*  */

function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  var pathMap = oldPathMap || Object.create(null);
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  };
}

function addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(typeof route.component !== 'string', "route config \"component\" for path: " + String(path || name) + " cannot be a " + "string id. Use an actual component instead.");
  }

  var normalizedPath = normalizePath(path, parent);
  var pathToRegexpOptions = route.pathToRegexpOptions || {};

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null ? {} : route.components ? route.props : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) {
        return (/^\/?$/.test(child.path)
        );
      })) {
        warn(false, "Named Route '" + route.name + "' has a default child route. " + "When navigating to this named route (:to=\"{name: '" + route.name + "'\"), " + "the default child route will not be rendered. Remove the name from " + "this route and use the name of the default child route for named " + "links instead.");
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs ? cleanPath(matchAs + "/" + child.path) : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(false, "Duplicate named routes definition: " + "{ name: \"" + name + "\", path: \"" + record.path + "\" }");
    }
  }
}

function compileRouteRegex(path, pathToRegexpOptions) {
  var regex = index(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = {};
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], "Duplicate param keys in route with path: \"" + path + "\"");
      keys[key.name] = true;
    });
  }
  return regex;
}

function normalizePath(path, parent) {
  path = path.replace(/\/$/, '');
  if (path[0] === '/') {
    return path;
  }
  if (parent == null) {
    return path;
  }
  return cleanPath(parent.path + "/" + path);
}

/*  */

function normalizeLocation(raw, current, append, router) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next;
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, "path " + current.path);
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next;
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = current && current.path || '/';
  var path = parsedPath.path ? resolvePath(parsedPath.path, basePath, append || next.append) : basePath;

  var query = resolveQuery(parsedPath.query, next.query, router && router.options.parseQuery);

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  };
}

function assign(a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a;
}

/*  */

function createMatcher(routes, router) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match(raw, currentRoute, redirectedFrom) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, "Route with name '" + name + "' does not exist");
      }
      if (!record) {
        return _createRoute(null, location);
      }
      var paramNames = record.regex.keys.filter(function (key) {
        return !key.optional;
      }).map(function (key) {
        return key.name;
      });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, "named route \"" + name + "\"");
        return _createRoute(record, location, redirectedFrom);
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom);
        }
      }
    }
    // no match
    return _createRoute(null, location);
  }

  function redirect(record, location) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function' ? originalRedirect(createRoute(record, location, null, router)) : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, "invalid redirect option: " + JSON.stringify(redirect));
      }
      return _createRoute(null, location);
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, "redirect failed: named route \"" + name + "\" not found.");
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location);
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, "redirect route with path \"" + rawPath + "\"");
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location);
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, "invalid redirect option: " + JSON.stringify(redirect));
      }
      return _createRoute(null, location);
    }
  }

  function alias(record, location, matchAs) {
    var aliasedPath = fillParams(matchAs, location.params, "aliased route with path \"" + matchAs + "\"");
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location);
    }
    return _createRoute(null, location);
  }

  function _createRoute(record, location, redirectedFrom) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location);
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs);
    }
    return createRoute(record, location, redirectedFrom, router);
  }

  return {
    match: match,
    addRoutes: addRoutes
  };
}

function matchRoute(regex, path, params) {
  var m = path.match(regex);

  if (!m) {
    return false;
  } else if (!params) {
    return true;
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true;
}

function resolveRecordPath(path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true);
}

/*  */

var positionStore = Object.create(null);

function setupScroll() {
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll(router, to, from, isPop) {
  if (!router.app) {
    return;
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);
    if (!shouldScroll) {
      return;
    }
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      var el = document.querySelector(shouldScroll.selector);
      if (el) {
        var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
        offset = normalizeOffset(offset);
        position = getElementPosition(el, offset);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  });
}

function saveScrollPosition() {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition() {
  var key = getStateKey();
  if (key) {
    return positionStore[key];
  }
}

function getElementPosition(el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  };
}

function isValidPosition(obj) {
  return isNumber(obj.x) || isNumber(obj.y);
}

function normalizePosition(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  };
}

function normalizeOffset(obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  };
}

function isNumber(v) {
  return typeof v === 'number';
}

/*  */

var supportsPushState = inBrowser && function () {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }

  return window.history && 'pushState' in window.history;
}();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now ? window.performance : Date;

var _key = genKey();

function genKey() {
  return Time.now().toFixed(3);
}

function getStateKey() {
  return _key;
}

function setStateKey(key) {
  _key = key;
}

function pushState(url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState(url) {
  pushState(url, true);
}

/*  */

function runQueue(queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents(matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (resolvedDef.__esModule && resolvedDef.default) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function' ? resolvedDef : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason) ? reason : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) {
      next();
    }
  };
}

function flatMapComponents(matched, fn) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return fn(m.components[key], m.instances[key], m, key);
    });
  }));
}

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once(fn) {
  var called = false;
  return function () {
    var args = [],
        len = arguments.length;
    while (len--) args[len] = arguments[len];

    if (called) {
      return;
    }
    called = true;
    return fn.apply(this, args);
  };
}

/*  */

var History = function History(router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen(cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady(cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError(errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo(location, onComplete, onAbort) {
  var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) {
        cb(route);
      });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) {
        cb(err);
      });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition(route, onComplete, onAbort) {
  var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) {
          cb(err);
        });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (isSameRoute(route, current) &&
  // in the case the route map has been dynamically appended to
  route.matched.length === current.matched.length) {
    this.ensureURL();
    return abort();
  }

  var ref = resolveQueue(this.current.matched, route.matched);
  var updated = ref.updated;
  var deactivated = ref.deactivated;
  var activated = ref.activated;

  var queue = [].concat(
  // in-component leave guards
  extractLeaveGuards(deactivated),
  // global before hooks
  this.router.beforeHooks,
  // in-component update hooks
  extractUpdateHooks(updated),
  // in-config enter guards
  activated.map(function (m) {
    return m.beforeEnter;
  }),
  // async components
  resolveAsyncComponents(activated));

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort();
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (typeof to === 'string' || typeof to === 'object' && (typeof to.path === 'string' || typeof to.name === 'string')) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () {
      return this$1.current === route;
    };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort();
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) {
            cb();
          });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute(route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase(base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = baseEl && baseEl.getAttribute('href') || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '');
}

function resolveQueue(current, next) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break;
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  };
}

function extractGuards(records, name, bind, reverse) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard) ? guard.map(function (guard) {
        return bind(guard, instance, match, key);
      }) : bind(guard, instance, match, key);
    }
  });
  return flatten(reverse ? guards.reverse() : guards);
}

function extractGuard(def, key) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key];
}

function extractLeaveGuards(deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true);
}

function extractUpdateHooks(updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard);
}

function bindGuard(guard, instance) {
  if (instance) {
    return function boundRouteGuard() {
      return guard.apply(instance, arguments);
    };
  }
}

function extractEnterGuards(activated, cbs, isValid) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid);
  });
}

function bindEnterGuard(guard, match, key, cbs, isValid) {
  return function routeEnterGuard(to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    });
  };
}

function poll(cb, // somehow flow cannot infer this is a function
instances, key, isValid) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */

var HTML5History = function (History$$1) {
  function HTML5History(router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    window.addEventListener('popstate', function (e) {
      var current = this$1.current;
      this$1.transitionTo(getLocation(this$1.base), function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if (History$$1) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create(History$$1 && History$$1.prototype);
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go(n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push(location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace(location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL(push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation() {
    return getLocation(this.base);
  };

  return HTML5History;
}(History);

function getLocation(base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash;
}

/*  */

var HashHistory = function (History$$1) {
  function HashHistory(router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return;
    }
    ensureSlash();
  }

  if (History$$1) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create(History$$1 && History$$1.prototype);
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners() {
    var this$1 = this;

    window.addEventListener('hashchange', function () {
      if (!ensureSlash()) {
        return;
      }
      this$1.transitionTo(getHash(), function (route) {
        replaceHash(route.fullPath);
      });
    });
  };

  HashHistory.prototype.push = function push(location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace(location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go(n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL(push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation() {
    return getHash();
  };

  return HashHistory;
}(History);

function checkFallback(base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(cleanPath(base + '/#' + location));
    return true;
  }
}

function ensureSlash() {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true;
  }
  replaceHash('/' + path);
  return false;
}

function getHash() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1);
}

function pushHash(path) {
  window.location.hash = path;
}

function replaceHash(path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  window.location.replace(base + "#" + path);
}

/*  */

var AbstractHistory = function (History$$1) {
  function AbstractHistory(router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if (History$$1) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create(History$$1 && History$$1.prototype);
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push(location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace(location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go(n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return;
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation() {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/';
  };

  AbstractHistory.prototype.ensureURL = function ensureURL() {
    // noop
  };

  return AbstractHistory;
}(History);

/*  */

var VueRouter = function VueRouter(options) {
  if (options === void 0) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break;
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break;
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break;
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, "invalid mode: " + mode);
      }
  }
};

var prototypeAccessors = { currentRoute: {} };

VueRouter.prototype.match = function match(raw, current, redirectedFrom) {
  return this.matcher.match(raw, current, redirectedFrom);
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current;
};

VueRouter.prototype.init = function init(app /* Vue component instance */) {
  var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(install.installed, "not installed. Make sure to call `Vue.use(VueRouter)` " + "before creating root instance.");

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return;
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(history.getCurrentLocation(), setupHashListener, setupHashListener);
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach(fn) {
  return registerHook(this.beforeHooks, fn);
};

VueRouter.prototype.beforeResolve = function beforeResolve(fn) {
  return registerHook(this.resolveHooks, fn);
};

VueRouter.prototype.afterEach = function afterEach(fn) {
  return registerHook(this.afterHooks, fn);
};

VueRouter.prototype.onReady = function onReady(cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError(errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push(location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace(location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go(n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back() {
  this.go(-1);
};

VueRouter.prototype.forward = function forward() {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents(to) {
  var route = to ? to.matched ? to : this.resolve(to).route : this.currentRoute;
  if (!route) {
    return [];
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key];
    });
  }));
};

VueRouter.prototype.resolve = function resolve(to, current, append) {
  var location = normalizeLocation(to, current || this.history.current, append, this);
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  };
};

VueRouter.prototype.addRoutes = function addRoutes(routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties(VueRouter.prototype, prototypeAccessors);

function registerHook(list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) {
      list.splice(i, 1);
    }
  };
}

function createHref(base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path;
}

VueRouter.install = install;
VueRouter.version = '2.7.0';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(10)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Url */
/* unused harmony export Http */
/* unused harmony export Resource */
/*!
 * vue-resource v1.3.4
 * https://github.com/pagekit/vue-resource
 * Released under the MIT License.
 */

/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

var RESOLVED = 0;
var REJECTED = 1;
var PENDING = 2;

function Promise$1(executor) {

    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    var promise = this;

    try {
        executor(function (x) {
            promise.resolve(x);
        }, function (r) {
            promise.reject(r);
        });
    } catch (e) {
        promise.reject(e);
    }
}

Promise$1.reject = function (r) {
    return new Promise$1(function (resolve, reject) {
        reject(r);
    });
};

Promise$1.resolve = function (x) {
    return new Promise$1(function (resolve, reject) {
        resolve(x);
    });
};

Promise$1.all = function all(iterable) {
    return new Promise$1(function (resolve, reject) {
        var count = 0,
            result = [];

        if (iterable.length === 0) {
            resolve(result);
        }

        function resolver(i) {
            return function (x) {
                result[i] = x;
                count += 1;

                if (count === iterable.length) {
                    resolve(result);
                }
            };
        }

        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolver(i), reject);
        }
    });
};

Promise$1.race = function race(iterable) {
    return new Promise$1(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolve, reject);
        }
    });
};

var p$1 = Promise$1.prototype;

p$1.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === PENDING) {
        if (x === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        var called = false;

        try {
            var then = x && x['then'];

            if (x !== null && typeof x === 'object' && typeof then === 'function') {
                then.call(x, function (x) {
                    if (!called) {
                        promise.resolve(x);
                    }
                    called = true;
                }, function (r) {
                    if (!called) {
                        promise.reject(r);
                    }
                    called = true;
                });
                return;
            }
        } catch (e) {
            if (!called) {
                promise.reject(e);
            }
            return;
        }

        promise.state = RESOLVED;
        promise.value = x;
        promise.notify();
    }
};

p$1.reject = function reject(reason) {
    var promise = this;

    if (promise.state === PENDING) {
        if (reason === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
    }
};

p$1.notify = function notify() {
    var promise = this;

    nextTick(function () {
        if (promise.state !== PENDING) {
            while (promise.deferred.length) {
                var deferred = promise.deferred.shift(),
                    onResolved = deferred[0],
                    onRejected = deferred[1],
                    resolve = deferred[2],
                    reject = deferred[3];

                try {
                    if (promise.state === RESOLVED) {
                        if (typeof onResolved === 'function') {
                            resolve(onResolved.call(undefined, promise.value));
                        } else {
                            resolve(promise.value);
                        }
                    } else if (promise.state === REJECTED) {
                        if (typeof onRejected === 'function') {
                            resolve(onRejected.call(undefined, promise.value));
                        } else {
                            reject(promise.value);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            }
        }
    });
};

p$1.then = function then(onResolved, onRejected) {
    var promise = this;

    return new Promise$1(function (resolve, reject) {
        promise.deferred.push([onResolved, onRejected, resolve, reject]);
        promise.notify();
    });
};

p$1.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

/**
 * Promise adapter.
 */

if (typeof Promise === 'undefined') {
    window.Promise = Promise$1;
}

function PromiseObj(executor, context) {

    if (executor instanceof Promise) {
        this.promise = executor;
    } else {
        this.promise = new Promise(executor.bind(context));
    }

    this.context = context;
}

PromiseObj.all = function (iterable, context) {
    return new PromiseObj(Promise.all(iterable), context);
};

PromiseObj.resolve = function (value, context) {
    return new PromiseObj(Promise.resolve(value), context);
};

PromiseObj.reject = function (reason, context) {
    return new PromiseObj(Promise.reject(reason), context);
};

PromiseObj.race = function (iterable, context) {
    return new PromiseObj(Promise.race(iterable), context);
};

var p = PromiseObj.prototype;

p.bind = function (context) {
    this.context = context;
    return this;
};

p.then = function (fulfilled, rejected) {

    if (fulfilled && fulfilled.bind && this.context) {
        fulfilled = fulfilled.bind(this.context);
    }

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
};

p.catch = function (rejected) {

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.catch(rejected), this.context);
};

p.finally = function (callback) {

    return this.then(function (value) {
        callback.call(this);
        return value;
    }, function (reason) {
        callback.call(this);
        return Promise.reject(reason);
    });
};

/**
 * Utility functions.
 */

var ref = {};
var hasOwnProperty = ref.hasOwnProperty;

var ref$1 = [];
var slice = ref$1.slice;
var debug = false;
var ntick;

var inBrowser = typeof window !== 'undefined';

var Util = function (ref) {
    var config = ref.config;
    var nextTick = ref.nextTick;

    ntick = nextTick;
    debug = config.debug || !config.silent;
};

function warn(msg) {
    if (typeof console !== 'undefined' && debug) {
        console.warn('[VueResource warn]: ' + msg);
    }
}

function error(msg) {
    if (typeof console !== 'undefined') {
        console.error(msg);
    }
}

function nextTick(cb, ctx) {
    return ntick(cb, ctx);
}

function trim(str) {
    return str ? str.replace(/^\s*|\s*$/g, '') : '';
}

function trimEnd(str, chars) {

    if (str && chars === undefined) {
        return str.replace(/\s+$/, '');
    }

    if (!str || !chars) {
        return str;
    }

    return str.replace(new RegExp("[" + chars + "]+$"), '');
}

function toLower(str) {
    return str ? str.toLowerCase() : '';
}

function toUpper(str) {
    return str ? str.toUpperCase() : '';
}

var isArray = Array.isArray;

function isString(val) {
    return typeof val === 'string';
}

function isFunction(val) {
    return typeof val === 'function';
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function isBlob(obj) {
    return typeof Blob !== 'undefined' && obj instanceof Blob;
}

function isFormData(obj) {
    return typeof FormData !== 'undefined' && obj instanceof FormData;
}

function when(value, fulfilled, rejected) {

    var promise = PromiseObj.resolve(value);

    if (arguments.length < 2) {
        return promise;
    }

    return promise.then(fulfilled, rejected);
}

function options(fn, obj, opts) {

    opts = opts || {};

    if (isFunction(opts)) {
        opts = opts.call(obj);
    }

    return merge(fn.bind({ $vm: obj, $options: opts }), fn, { $options: opts });
}

function each(obj, iterator) {

    var i, key;

    if (isArray(obj)) {
        for (i = 0; i < obj.length; i++) {
            iterator.call(obj[i], obj[i], i);
        }
    } else if (isObject(obj)) {
        for (key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                iterator.call(obj[key], obj[key], key);
            }
        }
    }

    return obj;
}

var assign = Object.assign || _assign;

function merge(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source, true);
    });

    return target;
}

function defaults(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {

        for (var key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }
    });

    return target;
}

function _assign(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source);
    });

    return target;
}

function _merge(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                target[key] = {};
            }
            if (isArray(source[key]) && !isArray(target[key])) {
                target[key] = [];
            }
            _merge(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}

/**
 * Root Prefix Transform.
 */

var root = function (options$$1, next) {

    var url = next(options$$1);

    if (isString(options$$1.root) && !/^(https?:)?\//.test(url)) {
        url = trimEnd(options$$1.root, '/') + '/' + url;
    }

    return url;
};

/**
 * Query Parameter Transform.
 */

var query = function (options$$1, next) {

    var urlParams = Object.keys(Url.options.params),
        query = {},
        url = next(options$$1);

    each(options$$1.params, function (value, key) {
        if (urlParams.indexOf(key) === -1) {
            query[key] = value;
        }
    });

    query = Url.params(query);

    if (query) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
    }

    return url;
};

/**
 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
 */

function expand(url, params, variables) {

    var tmpl = parse(url),
        expanded = tmpl.expand(params);

    if (variables) {
        variables.push.apply(variables, tmpl.vars);
    }

    return expanded;
}

function parse(template) {

    var operators = ['+', '#', '.', '/', ';', '?', '&'],
        variables = [];

    return {
        vars: variables,
        expand: function expand(context) {
            return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
                if (expression) {

                    var operator = null,
                        values = [];

                    if (operators.indexOf(expression.charAt(0)) !== -1) {
                        operator = expression.charAt(0);
                        expression = expression.substr(1);
                    }

                    expression.split(/,/g).forEach(function (variable) {
                        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                        values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
                        variables.push(tmp[1]);
                    });

                    if (operator && operator !== '+') {

                        var separator = ',';

                        if (operator === '?') {
                            separator = '&';
                        } else if (operator !== '#') {
                            separator = operator;
                        }

                        return (values.length !== 0 ? operator : '') + values.join(separator);
                    } else {
                        return values.join(',');
                    }
                } else {
                    return encodeReserved(literal);
                }
            });
        }
    };
}

function getValues(context, operator, key, modifier) {

    var value = context[key],
        result = [];

    if (isDefined(value) && value !== '') {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            value = value.toString();

            if (modifier && modifier !== '*') {
                value = value.substring(0, parseInt(modifier, 10));
            }

            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
        } else {
            if (modifier === '*') {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            } else {
                var tmp = [];

                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeURIComponent(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }

                if (isKeyOperator(operator)) {
                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
                } else if (tmp.length !== 0) {
                    result.push(tmp.join(','));
                }
            }
        }
    } else {
        if (operator === ';') {
            result.push(encodeURIComponent(key));
        } else if (value === '' && (operator === '&' || operator === '?')) {
            result.push(encodeURIComponent(key) + '=');
        } else if (value === '') {
            result.push('');
        }
    }

    return result;
}

function isDefined(value) {
    return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
    return operator === ';' || operator === '&' || operator === '?';
}

function encodeValue(operator, value, key) {

    value = operator === '+' || operator === '#' ? encodeReserved(value) : encodeURIComponent(value);

    if (key) {
        return encodeURIComponent(key) + '=' + value;
    } else {
        return value;
    }
}

function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part);
        }
        return part;
    }).join('');
}

/**
 * URL Template (RFC 6570) Transform.
 */

var template = function (options) {

    var variables = [],
        url = expand(options.url, options.params, variables);

    variables.forEach(function (key) {
        delete options.params[key];
    });

    return url;
};

/**
 * Service for URL templating.
 */

function Url(url, params) {

    var self = this || {},
        options$$1 = url,
        transform;

    if (isString(url)) {
        options$$1 = { url: url, params: params };
    }

    options$$1 = merge({}, Url.options, self.$options, options$$1);

    Url.transforms.forEach(function (handler) {

        if (isString(handler)) {
            handler = Url.transform[handler];
        }

        if (isFunction(handler)) {
            transform = factory(handler, transform, self.$vm);
        }
    });

    return transform(options$$1);
}

/**
 * Url options.
 */

Url.options = {
    url: '',
    root: null,
    params: {}
};

/**
 * Url transforms.
 */

Url.transform = { template: template, query: query, root: root };
Url.transforms = ['template', 'query', 'root'];

/**
 * Encodes a Url parameter string.
 *
 * @param {Object} obj
 */

Url.params = function (obj) {

    var params = [],
        escape = encodeURIComponent;

    params.add = function (key, value) {

        if (isFunction(value)) {
            value = value();
        }

        if (value === null) {
            value = '';
        }

        this.push(escape(key) + '=' + escape(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
};

/**
 * Parse a URL and return its components.
 *
 * @param {String} url
 */

Url.parse = function (url) {

    var el = document.createElement('a');

    if (document.documentMode) {
        el.href = url;
        url = el.href;
    }

    el.href = url;

    return {
        href: el.href,
        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
        port: el.port,
        host: el.host,
        hostname: el.hostname,
        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
        search: el.search ? el.search.replace(/^\?/, '') : '',
        hash: el.hash ? el.hash.replace(/^#/, '') : ''
    };
};

function factory(handler, next, vm) {
    return function (options$$1) {
        return handler.call(vm, options$$1, next);
    };
}

function serialize(params, obj, scope) {

    var array = isArray(obj),
        plain = isPlainObject(obj),
        hash;

    each(obj, function (value, key) {

        hash = isObject(value) || isArray(value);

        if (scope) {
            key = scope + '[' + (plain || hash ? key : '') + ']';
        }

        if (!scope && array) {
            params.add(value.name, value.value);
        } else if (hash) {
            serialize(params, value, key);
        } else {
            params.add(key, value);
        }
    });
}

/**
 * XDomain client (Internet Explorer).
 */

var xdrClient = function (request) {
    return new PromiseObj(function (resolve) {

        var xdr = new XDomainRequest(),
            handler = function (ref) {
            var type = ref.type;

            var status = 0;

            if (type === 'load') {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            resolve(request.respondWith(xdr.responseText, { status: status }));
        };

        request.abort = function () {
            return xdr.abort();
        };

        xdr.open(request.method, request.getUrl());

        if (request.timeout) {
            xdr.timeout = request.timeout;
        }

        xdr.onload = handler;
        xdr.onabort = handler;
        xdr.onerror = handler;
        xdr.ontimeout = handler;
        xdr.onprogress = function () {};
        xdr.send(request.getBody());
    });
};

/**
 * CORS Interceptor.
 */

var SUPPORTS_CORS = inBrowser && 'withCredentials' in new XMLHttpRequest();

var cors = function (request, next) {

    if (inBrowser) {

        var orgUrl = Url.parse(location.href);
        var reqUrl = Url.parse(request.getUrl());

        if (reqUrl.protocol !== orgUrl.protocol || reqUrl.host !== orgUrl.host) {

            request.crossOrigin = true;
            request.emulateHTTP = false;

            if (!SUPPORTS_CORS) {
                request.client = xdrClient;
            }
        }
    }

    next();
};

/**
 * Form data Interceptor.
 */

var form = function (request, next) {

    if (isFormData(request.body)) {

        request.headers.delete('Content-Type');
    } else if (isObject(request.body) && request.emulateJSON) {

        request.body = Url.params(request.body);
        request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    next();
};

/**
 * JSON Interceptor.
 */

var json = function (request, next) {

    var type = request.headers.get('Content-Type') || '';

    if (isObject(request.body) && type.indexOf('application/json') === 0) {
        request.body = JSON.stringify(request.body);
    }

    next(function (response) {

        return response.bodyText ? when(response.text(), function (text) {

            type = response.headers.get('Content-Type') || '';

            if (type.indexOf('application/json') === 0 || isJson(text)) {

                try {
                    response.body = JSON.parse(text);
                } catch (e) {
                    response.body = null;
                }
            } else {
                response.body = text;
            }

            return response;
        }) : response;
    });
};

function isJson(str) {

    var start = str.match(/^\[|^\{(?!\{)/),
        end = { '[': /]$/, '{': /}$/ };

    return start && end[start[0]].test(str);
}

/**
 * JSONP client (Browser).
 */

var jsonpClient = function (request) {
    return new PromiseObj(function (resolve) {

        var name = request.jsonp || 'callback',
            callback = request.jsonpCallback || '_jsonp' + Math.random().toString(36).substr(2),
            body = null,
            handler,
            script;

        handler = function (ref) {
            var type = ref.type;

            var status = 0;

            if (type === 'load' && body !== null) {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            if (status && window[callback]) {
                delete window[callback];
                document.body.removeChild(script);
            }

            resolve(request.respondWith(body, { status: status }));
        };

        window[callback] = function (result) {
            body = JSON.stringify(result);
        };

        request.abort = function () {
            handler({ type: 'abort' });
        };

        request.params[name] = callback;

        if (request.timeout) {
            setTimeout(request.abort, request.timeout);
        }

        script = document.createElement('script');
        script.src = request.getUrl();
        script.type = 'text/javascript';
        script.async = true;
        script.onload = handler;
        script.onerror = handler;

        document.body.appendChild(script);
    });
};

/**
 * JSONP Interceptor.
 */

var jsonp = function (request, next) {

    if (request.method == 'JSONP') {
        request.client = jsonpClient;
    }

    next();
};

/**
 * Before Interceptor.
 */

var before = function (request, next) {

    if (isFunction(request.before)) {
        request.before.call(this, request);
    }

    next();
};

/**
 * HTTP method override Interceptor.
 */

var method = function (request, next) {

    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
        request.headers.set('X-HTTP-Method-Override', request.method);
        request.method = 'POST';
    }

    next();
};

/**
 * Header Interceptor.
 */

var header = function (request, next) {

    var headers = assign({}, Http.headers.common, !request.crossOrigin ? Http.headers.custom : {}, Http.headers[toLower(request.method)]);

    each(headers, function (value, name) {
        if (!request.headers.has(name)) {
            request.headers.set(name, value);
        }
    });

    next();
};

/**
 * XMLHttp client (Browser).
 */

var xhrClient = function (request) {
    return new PromiseObj(function (resolve) {

        var xhr = new XMLHttpRequest(),
            handler = function (event) {

            var response = request.respondWith('response' in xhr ? xhr.response : xhr.responseText, {
                status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
                statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
            });

            each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
                response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
            });

            resolve(response);
        };

        request.abort = function () {
            return xhr.abort();
        };

        if (request.progress) {
            if (request.method === 'GET') {
                xhr.addEventListener('progress', request.progress);
            } else if (/^(POST|PUT)$/i.test(request.method)) {
                xhr.upload.addEventListener('progress', request.progress);
            }
        }

        xhr.open(request.method, request.getUrl(), true);

        if (request.timeout) {
            xhr.timeout = request.timeout;
        }

        if (request.responseType && 'responseType' in xhr) {
            xhr.responseType = request.responseType;
        }

        if (request.withCredentials || request.credentials) {
            xhr.withCredentials = true;
        }

        if (!request.crossOrigin) {
            request.headers.set('X-Requested-With', 'XMLHttpRequest');
        }

        request.headers.forEach(function (value, name) {
            xhr.setRequestHeader(name, value);
        });

        xhr.onload = handler;
        xhr.onabort = handler;
        xhr.onerror = handler;
        xhr.ontimeout = handler;
        xhr.send(request.getBody());
    });
};

/**
 * Http client (Node).
 */

var nodeClient = function (request) {

    var client = __webpack_require__(12);

    return new PromiseObj(function (resolve) {

        var url = request.getUrl();
        var body = request.getBody();
        var method = request.method;
        var headers = {},
            handler;

        request.headers.forEach(function (value, name) {
            headers[name] = value;
        });

        client(url, { body: body, method: method, headers: headers }).then(handler = function (resp) {

            var response = request.respondWith(resp.body, {
                status: resp.statusCode,
                statusText: trim(resp.statusMessage)
            });

            each(resp.headers, function (value, name) {
                response.headers.set(name, value);
            });

            resolve(response);
        }, function (error$$1) {
            return handler(error$$1.response);
        });
    });
};

/**
 * Base client.
 */

var Client = function (context) {

    var reqHandlers = [sendRequest],
        resHandlers = [],
        handler;

    if (!isObject(context)) {
        context = null;
    }

    function Client(request) {
        return new PromiseObj(function (resolve, reject) {

            function exec() {

                handler = reqHandlers.pop();

                if (isFunction(handler)) {
                    handler.call(context, request, next);
                } else {
                    warn("Invalid interceptor of type " + typeof handler + ", must be a function");
                    next();
                }
            }

            function next(response) {

                if (isFunction(response)) {

                    resHandlers.unshift(response);
                } else if (isObject(response)) {

                    resHandlers.forEach(function (handler) {
                        response = when(response, function (response) {
                            return handler.call(context, response) || response;
                        }, reject);
                    });

                    when(response, resolve, reject);

                    return;
                }

                exec();
            }

            exec();
        }, context);
    }

    Client.use = function (handler) {
        reqHandlers.push(handler);
    };

    return Client;
};

function sendRequest(request, resolve) {

    var client = request.client || (inBrowser ? xhrClient : nodeClient);

    resolve(client(request));
}

/**
 * HTTP Headers.
 */

var Headers = function Headers(headers) {
    var this$1 = this;

    this.map = {};

    each(headers, function (value, name) {
        return this$1.append(name, value);
    });
};

Headers.prototype.has = function has(name) {
    return getName(this.map, name) !== null;
};

Headers.prototype.get = function get(name) {

    var list = this.map[getName(this.map, name)];

    return list ? list.join() : null;
};

Headers.prototype.getAll = function getAll(name) {
    return this.map[getName(this.map, name)] || [];
};

Headers.prototype.set = function set(name, value) {
    this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
};

Headers.prototype.append = function append(name, value) {

    var list = this.map[getName(this.map, name)];

    if (list) {
        list.push(trim(value));
    } else {
        this.set(name, value);
    }
};

Headers.prototype.delete = function delete$1(name) {
    delete this.map[getName(this.map, name)];
};

Headers.prototype.deleteAll = function deleteAll() {
    this.map = {};
};

Headers.prototype.forEach = function forEach(callback, thisArg) {
    var this$1 = this;

    each(this.map, function (list, name) {
        each(list, function (value) {
            return callback.call(thisArg, value, name, this$1);
        });
    });
};

function getName(map, name) {
    return Object.keys(map).reduce(function (prev, curr) {
        return toLower(name) === toLower(curr) ? curr : prev;
    }, null);
}

function normalizeName(name) {

    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }

    return trim(name);
}

/**
 * HTTP Response.
 */

var Response = function Response(body, ref) {
    var url = ref.url;
    var headers = ref.headers;
    var status = ref.status;
    var statusText = ref.statusText;

    this.url = url;
    this.ok = status >= 200 && status < 300;
    this.status = status || 0;
    this.statusText = statusText || '';
    this.headers = new Headers(headers);
    this.body = body;

    if (isString(body)) {

        this.bodyText = body;
    } else if (isBlob(body)) {

        this.bodyBlob = body;

        if (isBlobText(body)) {
            this.bodyText = blobText(body);
        }
    }
};

Response.prototype.blob = function blob() {
    return when(this.bodyBlob);
};

Response.prototype.text = function text() {
    return when(this.bodyText);
};

Response.prototype.json = function json() {
    return when(this.text(), function (text) {
        return JSON.parse(text);
    });
};

Object.defineProperty(Response.prototype, 'data', {

    get: function get() {
        return this.body;
    },

    set: function set(body) {
        this.body = body;
    }

});

function blobText(body) {
    return new PromiseObj(function (resolve) {

        var reader = new FileReader();

        reader.readAsText(body);
        reader.onload = function () {
            resolve(reader.result);
        };
    });
}

function isBlobText(body) {
    return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
}

/**
 * HTTP Request.
 */

var Request = function Request(options$$1) {

    this.body = null;
    this.params = {};

    assign(this, options$$1, {
        method: toUpper(options$$1.method || 'GET')
    });

    if (!(this.headers instanceof Headers)) {
        this.headers = new Headers(this.headers);
    }
};

Request.prototype.getUrl = function getUrl() {
    return Url(this);
};

Request.prototype.getBody = function getBody() {
    return this.body;
};

Request.prototype.respondWith = function respondWith(body, options$$1) {
    return new Response(body, assign(options$$1 || {}, { url: this.getUrl() }));
};

/**
 * Service for sending network requests.
 */

var COMMON_HEADERS = { 'Accept': 'application/json, text/plain, */*' };
var JSON_CONTENT_TYPE = { 'Content-Type': 'application/json;charset=utf-8' };

function Http(options$$1) {

    var self = this || {},
        client = Client(self.$vm);

    defaults(options$$1 || {}, self.$options, Http.options);

    Http.interceptors.forEach(function (handler) {

        if (isString(handler)) {
            handler = Http.interceptor[handler];
        }

        if (isFunction(handler)) {
            client.use(handler);
        }
    });

    return client(new Request(options$$1)).then(function (response) {

        return response.ok ? response : PromiseObj.reject(response);
    }, function (response) {

        if (response instanceof Error) {
            error(response);
        }

        return PromiseObj.reject(response);
    });
}

Http.options = {};

Http.headers = {
    put: JSON_CONTENT_TYPE,
    post: JSON_CONTENT_TYPE,
    patch: JSON_CONTENT_TYPE,
    delete: JSON_CONTENT_TYPE,
    common: COMMON_HEADERS,
    custom: {}
};

Http.interceptor = { before: before, method: method, jsonp: jsonp, json: json, form: form, header: header, cors: cors };
Http.interceptors = ['before', 'method', 'jsonp', 'json', 'form', 'header', 'cors'];

['get', 'delete', 'head', 'jsonp'].forEach(function (method$$1) {

    Http[method$$1] = function (url, options$$1) {
        return this(assign(options$$1 || {}, { url: url, method: method$$1 }));
    };
});

['post', 'put', 'patch'].forEach(function (method$$1) {

    Http[method$$1] = function (url, body, options$$1) {
        return this(assign(options$$1 || {}, { url: url, method: method$$1, body: body }));
    };
});

/**
 * Service for interacting with RESTful services.
 */

function Resource(url, params, actions, options$$1) {

    var self = this || {},
        resource = {};

    actions = assign({}, Resource.actions, actions);

    each(actions, function (action, name) {

        action = merge({ url: url, params: assign({}, params) }, options$$1, action);

        resource[name] = function () {
            return (self.$http || Http)(opts(action, arguments));
        };
    });

    return resource;
}

function opts(action, args) {

    var options$$1 = assign({}, action),
        params = {},
        body;

    switch (args.length) {

        case 2:

            params = args[0];
            body = args[1];

            break;

        case 1:

            if (/^(POST|PUT|PATCH)$/i.test(options$$1.method)) {
                body = args[0];
            } else {
                params = args[0];
            }

            break;

        case 0:

            break;

        default:

            throw 'Expected up to 2 arguments [params, body], got ' + args.length + ' arguments';
    }

    options$$1.body = body;
    options$$1.params = assign({}, options$$1.params, params);

    return options$$1;
}

Resource.actions = {

    get: { method: 'GET' },
    save: { method: 'POST' },
    query: { method: 'GET' },
    update: { method: 'PUT' },
    remove: { method: 'DELETE' },
    delete: { method: 'DELETE' }

};

/**
 * Install plugin.
 */

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Util(Vue);

    Vue.url = Url;
    Vue.http = Http;
    Vue.resource = Resource;
    Vue.Promise = PromiseObj;

    Object.defineProperties(Vue.prototype, {

        $url: {
            get: function get() {
                return options(Vue.url, this, this.$options.url);
            }
        },

        $http: {
            get: function get() {
                return options(Vue.http, this, this.$options.http);
            }
        },

        $resource: {
            get: function get() {
                return Vue.resource.bind(this);
            }
        },

        $promise: {
            get: function get() {
                var this$1 = this;

                return function (executor) {
                    return new Vue.Promise(executor, this$1);
                };
            }
        }

    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

/* harmony default export */ __webpack_exports__["a"] = (plugin);


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Muse UI v2.1.0 (https://github.com/myronliu347/vue-carbon)
 * (c) 2017 Myron Liu 
 * Released under the MIT License.
 */
!function (t, e) {
   true ? module.exports = e(__webpack_require__(1)) : "function" == typeof define && define.amd ? define(["vue"], e) : "object" == typeof exports ? exports.MuseUI = e(require("vue")) : t.MuseUI = e(t.Vue);
}(this, function (t) {
  return function (t) {
    function e(i) {
      if (n[i]) return n[i].exports;var r = n[i] = { i: i, l: !1, exports: {} };return t[i].call(r.exports, r, r.exports, e), r.l = !0, r.exports;
    }var n = {};return e.m = t, e.c = n, e.i = function (t) {
      return t;
    }, e.d = function (t, n, i) {
      e.o(t, n) || Object.defineProperty(t, n, { configurable: !1, enumerable: !0, get: i });
    }, e.n = function (t) {
      var n = t && t.__esModule ? function () {
        return t.default;
      } : function () {
        return t;
      };return e.d(n, "a", n), n;
    }, e.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }, e.p = "", e(e.s = 583);
  }([function (t, e) {
    t.exports = function (t, e, n, i) {
      var r,
          a = t = t || {},
          o = typeof t.default;"object" !== o && "function" !== o || (r = t, a = t.default);var s = "function" == typeof a ? a.options : a;if (e && (s.render = e.render, s.staticRenderFns = e.staticRenderFns), n && (s._scopeId = n), i) {
        var l = Object.create(s.computed || null);Object.keys(i).forEach(function (t) {
          var e = i[t];l[t] = function () {
            return e;
          };
        }), s.computed = l;
      }return { esModule: r, exports: a, options: s };
    };
  }, function (t, e, n) {
    "use strict";
    function i(t) {
      return void 0 !== t && null !== t;
    }function r(t) {
      return void 0 === t || null === t;
    }function a(t) {
      for (var e = 1, n = arguments.length; e < n; e++) {
        var i = arguments[e];for (var r in i) if (i.hasOwnProperty(r)) {
          var a = i[r];void 0 !== a && (t[r] = a);
        }
      }return t;
    }function o(t) {
      var e = String(t);return e && e.indexOf("%") === -1 && e.indexOf("px") === -1 && (e += "px"), e;
    }function s() {
      for (var t = "undefined" != typeof navigator ? navigator.userAgent : "", e = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"], n = !0, i = 0; i < e.length; i++) if (t.indexOf(e[i]) > 0) {
        n = !1;break;
      }return n;
    }function l() {
      if (!s()) {
        var t = [],
            e = void 0 !== ("undefined" == typeof window ? "undefined" : d()(window)) && window.devicePixelRatio || 1;t.push("pixel-ratio-" + Math.floor(e)), e >= 2 && t.push("retina");var n = document.getElementsByTagName("html")[0];t.forEach(function (t) {
          return n.classList.add(t);
        });
      }
    }function u(t) {
      var e = [];if (!t) return e;if (t instanceof Array) e = e.concat(t);else if (t instanceof Object) for (var n in t) t[n] && e.push(n);else e = e.concat(t.split(" "));return e;
    }var c = n(76),
        d = n.n(c),
        f = n(68),
        h = n.n(f),
        p = n(142);n.d(e, "d", function () {
      return v;
    }), e.c = i, e.h = r, e.b = a, e.e = o, e.g = s, e.a = l, e.f = u;var m = h()(p),
        v = function (t) {
      return t ? m.indexOf(t) !== -1 ? p[t] : t : "";
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(438),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e) {
    var n = t.exports = { version: "2.4.0" };"number" == typeof __e && (__e = n);
  }, function (t, e, n) {
    var i = n(56)("wks"),
        r = n(35),
        a = n(7).Symbol,
        o = "function" == typeof a;(t.exports = function (t) {
      return i[t] || (i[t] = o && a[t] || (o ? a : r)("Symbol." + t));
    }).store = i;
  }, function (t, e, n) {
    "use strict";
    function i() {
      v || ("undefined" != typeof window && window.addEventListener("keydown", function (t) {
        m = "tab" === d()(t);
      }), v = !0);
    }var r = n(254),
        a = n.n(r),
        o = n(38),
        s = n.n(o),
        l = n(90),
        u = n.n(l),
        c = n(21),
        d = n.n(c),
        f = n(1),
        h = n(64),
        p = n(9),
        m = !1,
        v = !1;e.a = { mixins: [p.a], props: { href: { type: String, default: "" }, disabled: { type: Boolean, default: !1 }, disableFocusRipple: { type: Boolean, default: !1 }, disableKeyboardFocus: { type: Boolean, default: !1 }, disableTouchRipple: { type: Boolean, default: !1 }, rippleColor: { type: String, default: "" }, rippleOpacity: { type: Number }, centerRipple: { type: Boolean, default: !0 }, wrapperClass: { type: String, default: "" }, wrapperStyle: { type: [String, Object] }, containerElement: { type: String }, tabIndex: { type: Number, default: 0 }, type: { type: String, default: "button" }, keyboardFocused: { type: Boolean, default: !1 } }, data: function () {
        return { hover: !1, isKeyboardFocused: !1 };
      }, computed: { buttonClass: function () {
          var t = [];return this.disabled && t.push("disabled"), this.disabled || !this.hover && !this.isKeyboardFocused || t.push("hover"), t.join(" ");
        } }, beforeMount: function () {
        var t = this.disabled,
            e = this.disableKeyboardFocus,
            n = this.keyboardFocused;t || !n || e || (this.isKeyboardFocused = !0);
      }, mounted: function () {
        i(), this.isKeyboardFocused && (this.$el.focus(), this.$emit("keyboardFocus", !0));
      }, beforeUpdate: function () {
        (this.disabled || this.disableKeyboardFocus) && this.isKeyboardFocused && (this.isKeyboardFocused = !1, this.$emit("keyboardFocus", !1));
      }, beforeDestory: function () {
        this.cancelFocusTimeout();
      }, methods: { handleHover: function (t) {
          !this.disabled && n.i(f.g)() && (this.hover = !0, this.$emit("hover", t));
        }, handleOut: function (t) {
          !this.disabled && n.i(f.g)() && (this.hover = !1, this.$emit("hoverExit", t));
        }, removeKeyboardFocus: function (t) {
          this.isKeyboardFocused && (this.isKeyboardFocused = !1, this.$emit("KeyboardFocus", !1));
        }, setKeyboardFocus: function (t) {
          this.isKeyboardFocused || (this.isKeyboardFocused = !0, this.$emit("KeyboardFocus", !0));
        }, cancelFocusTimeout: function () {
          this.focusTimeout && (clearTimeout(this.focusTimeout), this.focusTimeout = null);
        }, handleKeydown: function (t) {
          this.disabled || this.disableKeyboardFocus || ("enter" === d()(t) && this.isKeyboardFocused && this.$el.click(), "esc" === d()(t) && this.isKeyboardFocused && this.removeKeyboardFocus(t));
        }, handleKeyup: function (t) {
          this.disabled || this.disableKeyboardFocus || "space" === d()(t) && this.isKeyboardFocused;
        }, handleFocus: function (t) {
          var e = this;this.disabled || this.disableKeyboardFocus || (this.focusTimeout = setTimeout(function () {
            m && (e.setKeyboardFocus(t), m = !1);
          }, 150));
        }, handleBlur: function (t) {
          this.cancelFocusTimeout(), this.removeKeyboardFocus(t);
        }, handleClick: function (t) {
          this.disabled || (m = !1, this.$el.blur(), this.removeKeyboardFocus(t), this.$emit("click", t));
        }, getTagName: function () {
          var t = "undefined" != typeof navigator && navigator.userAgent.toLowerCase().indexOf("firefox") !== -1,
              e = t ? "span" : "button";switch (!0) {case !!this.to:
              return "router-link";case !!this.href:
              return "a";case !!this.containerElement:
              return this.containerElement;default:
              return e;}
        }, createButtonChildren: function (t) {
          var e = this.isKeyboardFocused,
              n = this.disabled,
              i = this.disableFocusRipple,
              r = this.disableKeyboardFocus,
              a = this.rippleColor,
              o = this.rippleOpacity,
              l = this.disableTouchRipple,
              c = [];c = c.concat(this.$slots.default);var d = !e || h.a.disableFocusRipple || n || i || r ? void 0 : t(u.a, { color: a, opacity: o });return c = n || l || h.a.disableTouchRipple ? [t("div", { class: this.wrapperClass, style: this.wrapperStyle }, this.$slots.default)] : [t(s.a, { class: this.wrapperClass, style: this.wrapperStyle, props: { color: this.rippleColor, centerRipple: this.centerRipple, opacity: this.rippleOpacity } }, this.$slots.default)], c.unshift(d), c;
        } }, watch: { disabled: function (t) {
          t || (this.hover = !1);
        } }, render: function (t) {
        var e = { disabled: this.disabled, type: this.type },
            n = this.to ? { to: this.to, tag: this.tag, activeClass: this.activeClass, event: this.event, exact: this.exact, append: this.append, replace: this.replace } : {};this.href && (e.href = this.disabled ? "javascript:;" : this.href), this.disabled || (e.tabIndex = this.tabIndex);var i = this.getTagName();return t(i, a()({ class: this.buttonClass, domProps: e, props: n, style: { "user-select": this.disabled ? "" : "none", "-webkit-user-select": this.disabled ? "" : "none", outline: "none", cursor: this.disabled ? "" : "pointer", appearance: "none" } }, "router-link" === i ? "nativeOn" : "on", { mouseenter: this.handleHover, mouseleave: this.handleOut, touchend: this.handleOut, touchcancel: this.handleOut, click: this.handleClick, focus: this.handleFocus, blur: this.handleBlur, keydown: this.handleKeydown, keyup: this.handleKeyup }), this.createButtonChildren(t));
      } };
  }, function (t, e, n) {
    t.exports = !n(14)(function () {
      return 7 != Object.defineProperty({}, "a", { get: function () {
          return 7;
        } }).a;
    });
  }, function (t, e) {
    var n = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();"number" == typeof __g && (__g = n);
  }, function (t, e, n) {
    var i = n(12),
        r = n(79),
        a = n(59),
        o = Object.defineProperty;e.f = n(6) ? Object.defineProperty : function (t, e, n) {
      if (i(t), e = a(e, !0), i(n), r) try {
        return o(t, e, n);
      } catch (t) {}if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");return "value" in n && (t[e] = n.value), t;
    };
  }, function (t, e, n) {
    "use strict";
    e.a = { props: { to: { type: [String, Object] }, tag: { type: String, default: "a" }, activeClass: { type: String, default: "router-link-active" }, event: { type: [String, Array], default: "click" }, exact: Boolean, append: Boolean, replace: Boolean } };
  }, function (t, e, n) {
    var i = n(8),
        r = n(32);t.exports = n(6) ? function (t, e, n) {
      return i.f(t, e, r(1, n));
    } : function (t, e, n) {
      return t[e] = n, t;
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(450),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    var i = n(18);t.exports = function (t) {
      if (!i(t)) throw TypeError(t + " is not an object!");return t;
    };
  }, function (t, e, n) {
    var i = n(7),
        r = n(3),
        a = n(29),
        o = n(10),
        s = "prototype",
        l = function (t, e, n) {
      var u,
          c,
          d,
          f = t & l.F,
          h = t & l.G,
          p = t & l.S,
          m = t & l.P,
          v = t & l.B,
          y = t & l.W,
          g = h ? r : r[e] || (r[e] = {}),
          b = g[s],
          x = h ? i : p ? i[e] : (i[e] || {})[s];h && (n = e);for (u in n) (c = !f && x && void 0 !== x[u]) && u in g || (d = c ? x[u] : n[u], g[u] = h && "function" != typeof x[u] ? n[u] : v && c ? a(d, i) : y && x[u] == d ? function (t) {
        var e = function (e, n, i) {
          if (this instanceof t) {
            switch (arguments.length) {case 0:
                return new t();case 1:
                return new t(e);case 2:
                return new t(e, n);}return new t(e, n, i);
          }return t.apply(this, arguments);
        };return e[s] = t[s], e;
      }(d) : m && "function" == typeof d ? a(Function.call, d) : d, m && ((g.virtual || (g.virtual = {}))[u] = d, t & l.R && b && !b[u] && o(b, u, d)));
    };l.F = 1, l.G = 2, l.S = 4, l.P = 8, l.B = 16, l.W = 32, l.U = 64, l.R = 128, t.exports = l;
  }, function (t, e) {
    t.exports = function (t) {
      try {
        return !!t();
      } catch (t) {
        return !0;
      }
    };
  }, function (t, e) {
    var n = {}.hasOwnProperty;t.exports = function (t, e) {
      return n.call(t, e);
    };
  }, function (t, e, n) {
    var i = n(49),
        r = n(30);t.exports = function (t) {
      return i(r(t));
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(473),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e) {
    t.exports = function (t) {
      return "object" == typeof t ? null !== t : "function" == typeof t;
    };
  }, function (t, e) {
    t.exports = {};
  }, function (t, e, n) {
    var i = n(83),
        r = n(47);t.exports = Object.keys || function (t) {
      return i(t, r);
    };
  }, function (t, e) {
    e = t.exports = function (t) {
      if (t && "object" == typeof t) {
        var e = t.which || t.keyCode || t.charCode;e && (t = e);
      }if ("number" == typeof t) return a[t];var r = String(t),
          o = n[r.toLowerCase()];if (o) return o;var o = i[r.toLowerCase()];return o ? o : 1 === r.length ? r.charCodeAt(0) : void 0;
    };var n = e.code = e.codes = { backspace: 8, tab: 9, enter: 13, shift: 16, ctrl: 17, alt: 18, "pause/break": 19, "caps lock": 20, esc: 27, space: 32, "page up": 33, "page down": 34, end: 35, home: 36, left: 37, up: 38, right: 39, down: 40, insert: 45, delete: 46, command: 91, "left command": 91, "right command": 93, "numpad *": 106, "numpad +": 107, "numpad -": 109, "numpad .": 110, "numpad /": 111, "num lock": 144, "scroll lock": 145, "my computer": 182, "my calculator": 183, ";": 186, "=": 187, ",": 188, "-": 189, ".": 190, "/": 191, "`": 192, "[": 219, "\\": 220, "]": 221, "'": 222 },
        i = e.aliases = { windows: 91, "⇧": 16, "⌥": 18, "⌃": 17, "⌘": 91, ctl: 17, control: 17, option: 18, pause: 19, break: 19, caps: 20, return: 13, escape: 27, spc: 32, pgup: 33, pgdn: 34, ins: 45, del: 46, cmd: 91 }; /*!
                                                                                                                                                                                                                               * Programatically add the following
                                                                                                                                                                                                                               */
    for (r = 97; r < 123; r++) n[String.fromCharCode(r)] = r - 32;for (var r = 48; r < 58; r++) n[r - 48] = r;for (r = 1; r < 13; r++) n["f" + r] = r + 111;for (r = 0; r < 10; r++) n["numpad " + r] = r + 96;var a = e.names = e.title = {};for (r in n) a[n[r]] = r;for (var o in i) n[o] = i[o];
  }, function (t, e, n) {
    "use strict";
    function i(t) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "ampm",
          n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];if (!t) return "";var i = t.getHours(),
          r = t.getMinutes().toString();if ("ampm" === e) {
        var a = i < 12;i %= 12;var o = a ? " am" : " pm";return i = (i || 12).toString(), r.length < 2 && (r = "0" + r), n && "12" === i && "00" === r ? " pm" === o ? "12 noon" : "12 midnight" : i + ("00" === r ? "" : ":" + r) + o;
      }return i = i.toString(), i.length < 2 && (i = "0" + i), r.length < 2 && (r = "0" + r), i + ":" + r;
    }function r(t) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "ampm",
          n = (arguments.length > 2 && void 0 !== arguments[2] && arguments[2], new Date());if (!t) return n;var i = "",
          r = -1;"ampm" === e && (r = t.indexOf("am"), r === -1 && (r = t.indexOf("midnight")), r !== -1 ? i = "am" : (i = "pm", (r = t.indexOf("pm")) === -1 && (r = t.indexOf("noon")))), r !== -1 && (t = t.substring(0, r).trim());var a = t.split(":"),
          o = Number(a[0].trim());"pm" === i && (o += 12), o >= 24 && (o = 0);var s = a.length > 1 ? Number(a[1]) : 0;return n.setMinutes(s), n.setHours(o), n;
    }function a(t) {
      return 57.29577951308232 * t;
    }function o(t) {
      var e = t.target,
          n = e.getBoundingClientRect();return { offsetX: t.clientX - n.left, offsetY: t.clientY - n.top };
    }function s(t) {
      return "hour" === t.type && (t.value < 1 || t.value > 12);
    }e.b = i, e.a = r, e.d = a, e.c = o, e.e = s;
  }, function (t, e, n) {
    "use strict";
    var i = n(430),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(439),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(92),
        r = n.n(i);n.d(e, "menu", function () {
      return r.a;
    });var a = n(93),
        o = n.n(a);n.d(e, "menuItem", function () {
      return o.a;
    });
  }, function (t, e, n) {
    "use strict";
    function i(t) {
      var e = r(t);return e.setMonth(e.getMonth() + 1), e.setDate(e.getDate() - 1), e.getDate();
    }function r(t) {
      return new Date(t.getFullYear(), t.getMonth(), 1);
    }function a(t, e) {
      for (var n = [], r = i(t), a = [], o = [], s = 1; s <= r; s++) n.push(new Date(t.getFullYear(), t.getMonth(), s));var l = function (t) {
        for (var e = 7 - t.length, n = 0; n < e; ++n) t[a.length ? "push" : "unshift"](null);a.push(t);
      };return n.forEach(function (t) {
        o.length > 0 && t.getDay() === e && (l(o), o = []), o.push(t), n.indexOf(t) === n.length - 1 && l(o);
      }), a;
    }function o(t, e) {
      var n = u(t);return n.setDate(t.getDate() + e), n;
    }function s(t, e) {
      var n = u(t);return n.setMonth(t.getMonth() + e), n;
    }function l(t, e) {
      var n = u(t);return n.setFullYear(t.getFullYear() + e), n;
    }function u(t) {
      return new Date(t.getTime());
    }function c(t) {
      var e = u(t);return e.setHours(0, 0, 0, 0), e;
    }function d(t, e) {
      var n = c(t),
          i = c(e);return n.getTime() < i.getTime();
    }function f(t, e) {
      var n = c(t),
          i = c(e);return n.getTime() > i.getTime();
    }function h(t, e, n) {
      return !d(t, e) && !f(t, n);
    }function p(t, e) {
      return t && e && t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
    }function m(t, e) {
      var n = void 0;return n = 12 * (t.getFullYear() - e.getFullYear()), n += t.getMonth(), n -= e.getMonth();
    }function v(t, e) {
      e = e || "yyyy-MM-dd", t = t || new Date();var n = e;return n = n.replace(/yyyy|YYYY/, t.getFullYear()), n = n.replace(/yy|YY/, t.getYear() % 100 > 9 ? (t.getYear() % 100).toString() : "0" + t.getYear() % 100), n = n.replace(/MM/, x(t.getMonth() + 1)), n = n.replace(/M/g, t.getMonth() + 1), n = n.replace(/w|W/g, C.dayAbbreviation[t.getDay()]), n = n.replace(/dd|DD/, x(t.getDate())), n = n.replace(/d|D/g, t.getDate()), n = n.replace(/hh|HH/, x(t.getHours())), n = n.replace(/h|H/g, t.getHours()), n = n.replace(/mm/, x(t.getMinutes())), n = n.replace(/m/g, t.getMinutes()), n = n.replace(/ss|SS/, x(t.getSeconds())), n = n.replace(/s|S/g, t.getSeconds());
    }function y(t, e) {
      for (var n, i, r = 0, a = 0, o = "", s = "", l = new Date(), u = l.getFullYear(), c = l.getMonth() + 1, d = 1, f = l.getHours(), h = l.getMinutes(), p = l.getSeconds(), m = ""; a < e.length;) {
        for (o = e.charAt(a), s = ""; e.charAt(a) === o && a < e.length;) s += e.charAt(a++);if ("yyyy" === s || "YYYY" === s || "yy" === s || "YY" === s || "y" === s || "Y" === s) {
          if ("yyyy" !== s && "YYYY" !== s || (n = 4, i = 4), "yy" !== s && "YY" !== s || (n = 2, i = 2), "y" !== s && "Y" !== s || (n = 2, i = 4), null == (u = g(t, r, n, i))) return 0;r += u.length, 2 === u.length && (u = u > 70 ? u - 0 + 1900 : u - 0 + 2e3);
        } else if ("MMM" === s || "NNN" === s) {
          c = 0;for (var v = 0; v < S.length; v++) {
            var y = S[v];if (t.substring(r, r + y.length).toLowerCase() === y.toLowerCase() && ("MMM" === s || "NNN" === s && v > 11)) {
              c = v + 1, c > 12 && (c -= 12), r += y.length;break;
            }
          }if (c < 1 || c > 12) return 0;
        } else if ("EE" === s || "E" === s) for (var b = 0; b < w.length; b++) {
          var x = w[b];if (t.substring(r, r + x.length).toLowerCase() === x.toLowerCase()) {
            r += x.length;break;
          }
        } else if ("MM" === s || "M" === s) {
          if (null == (c = g(t, r, s.length, 2)) || c < 1 || c > 12) return 0;r += c.length;
        } else if ("dd" === s || "d" === s || "DD" === s || "D" === s) {
          if (null === (d = g(t, r, s.length, 2)) || d < 1 || d > 31) return 0;r += d.length;
        } else if ("hh" === s || "h" === s) {
          if (null == (f = g(t, r, s.length, 2)) || f < 1 || f > 12) return 0;r += f.length;
        } else if ("HH" === s || "H" === s) {
          if (null == (f = g(t, r, s.length, 2)) || f < 0 || f > 23) return 0;r += f.length;
        } else if ("KK" === s || "K" === s) {
          if (null == (f = g(t, r, s.length, 2)) || f < 0 || f > 11) return 0;r += f.length;
        } else if ("kk" === s || "k" === s) {
          if (null == (f = g(t, r, s.length, 2)) || f < 1 || f > 24) return 0;r += f.length, f--;
        } else if ("mm" === s || "m" === s) {
          if (null == (h = g(t, r, s.length, 2)) || h < 0 || h > 59) return 0;r += h.length;
        } else if ("ss" === s || "s" === s || "SS" === s || "s" === s) {
          if (null == (p = g(t, r, s.length, 2)) || p < 0 || p > 59) return 0;r += p.length;
        } else if ("u" === s) {
          var C = g(t, r, s.length, 3);if (null == C || C < 0 || C > 999) return 0;r += C.length;
        } else if ("a" === s) {
          if ("am" === t.substring(r, r + 2).toLowerCase()) m = "AM";else {
            if ("pm" !== t.substring(r, r + 2).toLowerCase()) return 0;m = "PM";
          }r += 2;
        } else {
          if (t.substring(r, r + s.length) !== s) return 0;r += s.length;
        }
      }if (2 === c) if (u % 4 == 0 && u % 100 != 0 || u % 400 == 0) {
        if (d > 29) return 0;
      } else if (d > 28) return 0;return (4 === c || 6 === c || 9 === c || 11 === c) && d > 30 ? 0 : (f < 12 && "PM" === m ? f = f - 0 + 12 : f > 11 && "AM" === m && (f -= 12), new Date(u, c - 1, d, f, h, p));
    }function g(t, e, n, i) {
      for (var r = i; r >= n; r--) {
        var a = t.substring(e, e + r);if (a.length < n) return null;if (b(a)) return a;
      }return null;
    }function b(t) {
      return new RegExp(/^\d+$/).test(t);
    }function x(t) {
      return t > 9 ? t : "0" + t;
    }n.d(e, "a", function () {
      return _;
    }), e.j = a, e.i = o, e.g = s, e.d = l, e.e = u, e.h = c, e.l = h, e.k = p, e.f = m, e.c = v, e.b = y;var C = { dayAbbreviation: ["日", "一", "二", "三", "四", "五", "六"], dayList: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], monthList: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"], monthLongList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"] },
        _ = { formatDisplay: function (t) {
        var e = t.getDate();return C.monthList[t.getMonth()] + "-" + (e > 9 ? e : "0" + e) + " " + C.dayList[t.getDay()];
      }, formatMonth: function (t) {
        return t.getFullYear() + " " + C.monthLongList[t.getMonth()];
      }, getWeekDayArray: function (t) {
        for (var e = [], n = [], i = C.dayAbbreviation, r = 0; r < i.length; r++) r < t ? n.push(i[r]) : e.push(i[r]);return e.concat(n);
      } },
        S = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        w = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }, function (t, e, n) {
    "use strict";
    var i = n(43),
        r = n(28);e.a = { props: { open: { type: Boolean, default: !1 }, overlay: { type: Boolean, default: !0 }, overlayOpacity: { type: Number, default: .4 }, overlayColor: { type: String, default: "#000" }, escPressClose: { type: Boolean, default: !0 }, appendBody: { type: Boolean, default: !0 } }, data: function () {
        return { overlayZIndex: n.i(r.a)(), zIndex: n.i(r.a)() };
      }, methods: { overlayClick: function (t) {
          this.overlay && this.$emit("close", "overlay");
        }, escPress: function (t) {
          this.escPressClose && this.$emit("close", "esc");
        }, clickOutSide: function (t) {
          this.$emit("clickOutSide", t);
        }, setZIndex: function () {
          var t = this.$el;this.zIndex || (this.zIndex = n.i(r.a)()), t && (t.style.zIndex = this.zIndex);
        }, bindClickOutSide: function () {
          var t = this;this._handleClickOutSide || (this._handleClickOutSide = function (e) {
            var n = t.popupEl();n && n.contains(e.target) || t.clickOutSide(e);
          }), setTimeout(function () {
            window.addEventListener("click", t._handleClickOutSide);
          }, 0);
        }, unBindClickOutSide: function () {
          window.removeEventListener("click", this._handleClickOutSide);
        }, resetZIndex: function () {
          this.overlayZIndex = n.i(r.a)(), this.zIndex = n.i(r.a)();
        }, popupEl: function () {
          return this.appendBody ? this.$refs.popup : this.$el;
        }, appendPopupElToBody: function () {
          var t = this;this.appendBody && this.$nextTick(function () {
            var e = t.popupEl();if (!e) return void console.warn("必须有一个 ref=‘popup’ 的元素");document.body.appendChild(e);
          });
        } }, mounted: function () {
        this.open && (i.a.open(this), this.bindClickOutSide(), this.appendPopupElToBody());
      }, updated: function () {
        this.overlay || this.setZIndex();
      }, beforeDestroy: function () {
        if (i.a.close(this), this.unBindClickOutSide(), this.appendBody) {
          var t = this.popupEl();if (!t) return;document.body.removeChild(t);
        }
      }, watch: { open: function (t, e) {
          t !== e && (t ? (this.bindClickOutSide(), this.resetZIndex(), i.a.open(this), this.appendPopupElToBody()) : (this.unBindClickOutSide(), i.a.close(this)));
        } } };
  }, function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return r;
    });var i = 20141223,
        r = function () {
      return i++;
    };
  }, function (t, e, n) {
    var i = n(264);t.exports = function (t, e, n) {
      if (i(t), void 0 === e) return t;switch (n) {case 1:
          return function (n) {
            return t.call(e, n);
          };case 2:
          return function (n, i) {
            return t.call(e, n, i);
          };case 3:
          return function (n, i, r) {
            return t.call(e, n, i, r);
          };}return function () {
        return t.apply(e, arguments);
      };
    };
  }, function (t, e) {
    t.exports = function (t) {
      if (void 0 == t) throw TypeError("Can't call method on  " + t);return t;
    };
  }, function (t, e) {
    e.f = {}.propertyIsEnumerable;
  }, function (t, e) {
    t.exports = function (t, e) {
      return { enumerable: !(1 & t), configurable: !(2 & t), writable: !(4 & t), value: e };
    };
  }, function (t, e, n) {
    var i = n(8).f,
        r = n(15),
        a = n(4)("toStringTag");t.exports = function (t, e, n) {
      t && !r(t = n ? t : t.prototype, a) && i(t, a, { configurable: !0, value: e });
    };
  }, function (t, e, n) {
    var i = n(30);t.exports = function (t) {
      return Object(i(t));
    };
  }, function (t, e) {
    var n = 0,
        i = Math.random();t.exports = function (t) {
      return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++n + i).toString(36));
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(287)(!0);n(50)(String, "String", function (t) {
      this._t = String(t), this._i = 0;
    }, function () {
      var t,
          e = this._t,
          n = this._i;return n >= e.length ? { value: void 0, done: !0 } : (t = i(e, n), this._i += t.length, { value: t, done: !1 });
    });
  }, function (t, e, n) {
    n(291);for (var i = n(7), r = n(10), a = n(19), o = n(4)("toStringTag"), s = ["NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList"], l = 0; l < 5; l++) {
      var u = s[l],
          c = i[u],
          d = c && c.prototype;d && !d[o] && r(d, o, u), a[u] = a.Array;
    }
  }, function (t, e, n) {
    n(322);var i = n(0)(n(194), n(508), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    "use strict";
    var i = n(426),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(486),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    function i(t) {
      return t && t.__esModule ? t : { default: t };
    }e.__esModule = !0;var r = n(74),
        a = i(r);e.default = a.default || function (t) {
      for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
      }return t;
    };
  }, function (t, e, n) {
    "use strict";
    var i = "@@clickoutsideContext";e.a = { bind: function (t, e, n) {
        var r = function (r) {
          n.context && !t.contains(r.target) && (e.expression ? n.context[t[i].methodName](r) : t[i].bindingFn(r));
        };t[i] = { documentHandler: r, methodName: e.expression, bindingFn: e.value }, setTimeout(function () {
          document.addEventListener("click", r);
        }, 0);
      }, update: function (t, e) {
        t[i].methodName = e.expression, t[i].bindingFn = e.value;
      }, unbind: function (t) {
        document.removeEventListener("click", t[i].documentHandler);
      } };
  }, function (t, e, n) {
    "use strict";
    var i = n(99),
        r = n.n(i),
        a = n(21),
        o = n.n(a),
        s = n(69),
        l = n.n(s),
        u = r.a.extend(l.a),
        c = { instances: [], overlay: !1, open: function (t) {
        t && this.instances.indexOf(t) === -1 && (!this.overlay && t.overlay && this.showOverlay(t), this.instances.push(t), this.changeOverlayStyle());
      }, close: function (t) {
        var e = this,
            n = this.instances.indexOf(t);n !== -1 && (this.instances.splice(n, 1), r.a.nextTick(function () {
          0 === e.instances.length && e.closeOverlay(), e.changeOverlayStyle();
        }));
      }, showOverlay: function (t) {
        var e = this.overlay = new u({ el: document.createElement("div") });e.fixed = !0, e.color = t.overlayColor, e.opacity = t.overlayOpacity, e.zIndex = t.overlayZIndex, e.onClick = this.handleOverlayClick.bind(this), document.body.appendChild(e.$el), this.preventScrolling(), r.a.nextTick(function () {
          e.show = !0;
        });
      }, preventScrolling: function () {
        if (!this.locked) {
          var t = document.getElementsByTagName("body")[0],
              e = document.getElementsByTagName("html")[0];this.bodyOverflow = t.style.overflow, this.htmlOverflow = e.style.overflow, t.style.overflow = "hidden", e.style.overflow = "hidden", this.locked = !0;
        }
      }, allowScrolling: function () {
        var t = document.getElementsByTagName("body")[0],
            e = document.getElementsByTagName("html")[0];t.style.overflow = this.bodyOverflow || "", e.style.overflow = this.htmlOverflow || "", this.bodyOverflow = null, this.htmlOverflow = null, this.locked = !1;
      }, closeOverlay: function () {
        if (this.overlay) {
          this.allowScrolling();var t = this.overlay;t.show = !1, this.overlay = null, setTimeout(function () {
            t.$el.remove(), t.$destroy();
          }, 450);
        }
      }, changeOverlayStyle: function () {
        var t = this.instances[this.instances.length - 1];this.overlay && 0 !== this.instances.length && t.overlay && (this.overlay.color = t.overlayColor, this.overlay.opacity = t.overlayOpacity, this.overlay.zIndex = t.overlayZIndex);
      }, handleOverlayClick: function () {
        if (0 !== this.instances.length) {
          var t = this.instances[this.instances.length - 1];t.overlayClick && t.overlayClick();
        }
      } };"undefined" != typeof window && window.addEventListener("keydown", function (t) {
      if (0 !== c.instances.length && "esc" === o()(t)) {
        var e = c.instances[c.instances.length - 1];e.escPress && e.escPress();
      }
    }), e.a = c;
  }, function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return i;
    }), n.d(e, "b", function () {
      return r;
    });var i = function (t) {
      var e = t.getBoundingClientRect(),
          n = document.body,
          i = t.clientTop || n.clientTop || 0,
          r = t.clientLeft || n.clientLeft || 0,
          a = window.pageYOffset || t.scrollTop,
          o = window.pageXOffset || t.scrollLeft;return { top: e.top + a - i, left: e.left + o - r };
    },
        r = function (t, e) {
      var n = ["msTransitionEnd", "mozTransitionEnd", "oTransitionEnd", "webkitTransitionEnd", "transitionend"],
          i = { handleEvent: function (r) {
          n.forEach(function (e) {
            t.removeEventListener(e, i, !1);
          }), e.apply(t, arguments);
        } };n.forEach(function (e) {
        t.addEventListener(e, i, !1);
      });
    };
  }, function (t, e, n) {
    var i = n(46),
        r = n(4)("toStringTag"),
        a = "Arguments" == i(function () {
      return arguments;
    }()),
        o = function (t, e) {
      try {
        return t[e];
      } catch (t) {}
    };t.exports = function (t) {
      var e, n, s;return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof (n = o(e = Object(t), r)) ? n : a ? i(e) : "Object" == (s = i(e)) && "function" == typeof e.callee ? "Arguments" : s;
    };
  }, function (t, e) {
    var n = {}.toString;t.exports = function (t) {
      return n.call(t).slice(8, -1);
    };
  }, function (t, e) {
    t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
  }, function (t, e, n) {
    var i = n(29),
        r = n(277),
        a = n(276),
        o = n(12),
        s = n(58),
        l = n(86),
        u = {},
        c = {},
        e = t.exports = function (t, e, n, d, f) {
      var h,
          p,
          m,
          v,
          y = f ? function () {
        return t;
      } : l(t),
          g = i(n, d, e ? 2 : 1),
          b = 0;if ("function" != typeof y) throw TypeError(t + " is not iterable!");if (a(y)) {
        for (h = s(t.length); h > b; b++) if ((v = e ? g(o(p = t[b])[0], p[1]) : g(t[b])) === u || v === c) return v;
      } else for (m = y.call(t); !(p = m.next()).done;) if ((v = r(m, g, p.value, e)) === u || v === c) return v;
    };e.BREAK = u, e.RETURN = c;
  }, function (t, e, n) {
    var i = n(46);t.exports = Object("z").propertyIsEnumerable(0) ? Object : function (t) {
      return "String" == i(t) ? t.split("") : Object(t);
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(51),
        r = n(13),
        a = n(85),
        o = n(10),
        s = n(15),
        l = n(19),
        u = n(278),
        c = n(33),
        d = n(284),
        f = n(4)("iterator"),
        h = !([].keys && "next" in [].keys()),
        p = "keys",
        m = "values",
        v = function () {
      return this;
    };t.exports = function (t, e, n, y, g, b, x) {
      u(n, e, y);var C,
          _,
          S,
          w = function (t) {
        if (!h && t in T) return T[t];switch (t) {case p:
            return function () {
              return new n(this, t);
            };case m:
            return function () {
              return new n(this, t);
            };}return function () {
          return new n(this, t);
        };
      },
          k = e + " Iterator",
          $ = g == m,
          O = !1,
          T = t.prototype,
          M = T[f] || T["@@iterator"] || g && T[g],
          D = M || w(g),
          F = g ? $ ? w("entries") : D : void 0,
          E = "Array" == e ? T.entries || M : M;if (E && (S = d(E.call(new t()))) !== Object.prototype && (c(S, k, !0), i || s(S, f) || o(S, f, v)), $ && M && M.name !== m && (O = !0, D = function () {
        return M.call(this);
      }), i && !x || !h && !O && T[f] || o(T, f, D), l[e] = D, l[k] = v, g) if (C = { values: $ ? D : w(m), keys: b ? D : w(p), entries: F }, x) for (_ in C) _ in T || a(T, _, C[_]);else r(r.P + r.F * (h || O), e, C);return C;
    };
  }, function (t, e) {
    t.exports = !0;
  }, function (t, e, n) {
    var i = n(35)("meta"),
        r = n(18),
        a = n(15),
        o = n(8).f,
        s = 0,
        l = Object.isExtensible || function () {
      return !0;
    },
        u = !n(14)(function () {
      return l(Object.preventExtensions({}));
    }),
        c = function (t) {
      o(t, i, { value: { i: "O" + ++s, w: {} } });
    },
        d = function (t, e) {
      if (!r(t)) return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;if (!a(t, i)) {
        if (!l(t)) return "F";if (!e) return "E";c(t);
      }return t[i].i;
    },
        f = function (t, e) {
      if (!a(t, i)) {
        if (!l(t)) return !0;if (!e) return !1;c(t);
      }return t[i].w;
    },
        h = function (t) {
      return u && p.NEED && l(t) && !a(t, i) && c(t), t;
    },
        p = t.exports = { KEY: i, NEED: !1, fastKey: d, getWeak: f, onFreeze: h };
  }, function (t, e, n) {
    var i = n(12),
        r = n(281),
        a = n(47),
        o = n(55)("IE_PROTO"),
        s = function () {},
        l = "prototype",
        u = function () {
      var t,
          e = n(78)("iframe"),
          i = a.length,
          r = "<",
          o = ">";for (e.style.display = "none", n(275).appendChild(e), e.src = "javascript:", t = e.contentWindow.document, t.open(), t.write(r + "script" + o + "document.F=Object" + r + "/script" + o), t.close(), u = t.F; i--;) delete u[l][a[i]];return u();
    };t.exports = Object.create || function (t, e) {
      var n;return null !== t ? (s[l] = i(t), n = new s(), s[l] = null, n[o] = t) : n = u(), void 0 === e ? n : r(n, e);
    };
  }, function (t, e) {
    e.f = Object.getOwnPropertySymbols;
  }, function (t, e, n) {
    var i = n(56)("keys"),
        r = n(35);t.exports = function (t) {
      return i[t] || (i[t] = r(t));
    };
  }, function (t, e, n) {
    var i = n(7),
        r = "__core-js_shared__",
        a = i[r] || (i[r] = {});t.exports = function (t) {
      return a[t] || (a[t] = {});
    };
  }, function (t, e) {
    var n = Math.ceil,
        i = Math.floor;t.exports = function (t) {
      return isNaN(t = +t) ? 0 : (t > 0 ? i : n)(t);
    };
  }, function (t, e, n) {
    var i = n(57),
        r = Math.min;t.exports = function (t) {
      return t > 0 ? r(i(t), 9007199254740991) : 0;
    };
  }, function (t, e, n) {
    var i = n(18);t.exports = function (t, e) {
      if (!i(t)) return t;var n, r;if (e && "function" == typeof (n = t.toString) && !i(r = n.call(t))) return r;if ("function" == typeof (n = t.valueOf) && !i(r = n.call(t))) return r;if (!e && "function" == typeof (n = t.toString) && !i(r = n.call(t))) return r;throw TypeError("Can't convert object to primitive value");
    };
  }, function (t, e, n) {
    var i = n(7),
        r = n(3),
        a = n(51),
        o = n(61),
        s = n(8).f;t.exports = function (t) {
      var e = r.Symbol || (r.Symbol = a ? {} : i.Symbol || {});"_" == t.charAt(0) || t in e || s(e, t, { value: o.f(t) });
    };
  }, function (t, e, n) {
    e.f = n(4);
  }, function (t, e, n) {
    n(369);var i = n(0)(n(190), n(551), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    "use strict";
    var i = n(413),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    function i(t) {
      t && n.i(r.b)(i, t);
    }var r = n(1);n.i(r.b)(i, { disableTouchRipple: !1, disableFocusRipple: !1 }), e.a = i;
  }, function (t, e, n) {
    "use strict";
    var i = n(429),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(447),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(455),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    t.exports = { default: n(260), __esModule: !0 };
  }, function (t, e, n) {
    n(340);var i = n(0)(n(193), n(526), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    "use strict";
    e.a = { mounted: function () {
        this.$bindResize();
      }, methods: { $bindResize: function () {
          var t = this;this._handleResize = function (e) {
            t.onResize && t.onResize();
          }, "undefined" != typeof window && window.addEventListener("resize", this._handleResize);
        }, $unBindResize: function () {
          this._handleResize && window.removeEventListener("resize", this._handleResize);
        } }, beforeDestroy: function () {
        this.$unBindResize();
      } };
  }, function (t, e, n) {
    "use strict";
    e.a = { props: { scroller: {} }, mounted: function () {
        this.$bindScroll();
      }, methods: { $bindScroll: function () {
          var t = this,
              e = this.scroller || window;this._handleScroll = function (e) {
            t.onScroll && t.onScroll();
          }, e.addEventListener("scroll", this._handleScroll);
        }, $unbindScroll: function (t) {
          t = t || this.scroller || window, this._handleScroll && t.removeEventListener("scroll", this._handleScroll);
        } }, beforeDestroy: function () {
        this.$unbindScroll();
      }, watch: { scroller: function (t, e) {
          t !== e && (this.$unbindScroll(e), this.$bindScroll(t));
        } } };
  }, function (t, e, n) {
    "use strict";
    var i = n(249),
        r = n.n(i);n.d(e, "a", function () {
      return a;
    });var a = function (t, e) {
      return !!new r.a(e).has(t);
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(252),
        r = n.n(i),
        a = n(253),
        o = n.n(a),
        s = "undefined" != typeof window && ("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
        l = function () {
      function t(e) {
        r()(this, t), this.el = e, this.startPos = {}, this.endPos = {}, this.starts = [], this.drags = [], this.ends = [], s ? this.el.addEventListener("touchstart", this, !1) : this.el.addEventListener("mousedown", this, !1);
      }return o()(t, [{ key: "handleEvent", value: function (t) {
          switch (t.type) {case "touchstart":
              this.touchStart(t);break;case "touchmove":
              this.touchMove(t);break;case "touchcancel":case "touchend":
              this.touchEnd(t);break;case "mousedown":
              this.mouseStart(t);break;case "mousemove":
              this.mouseMove(t);break;case "mouseleave":case "mouseup":
              this.mouseEnd(t);}
        } }, { key: "touchStart", value: function (t) {
          var e = this,
              n = t.touches[0];this.startPos = { x: n.pageX, y: n.pageY, time: new Date().getTime() }, this.endPos = {}, this.el.addEventListener("touchmove", this, !1), this.el.addEventListener("touchend", this, !1), this.starts.map(function (n) {
            n.call(e, e.startPos, t);
          });
        } }, { key: "touchMove", value: function (t) {
          var e = this;if (!(t.touches.length > 1 || t.scale && 1 !== t.scale)) {
            var n = t.touches[0];this.endPos = { x: n.pageX - this.startPos.x, y: n.pageY - this.startPos.y, time: new Date().getTime() - this.startPos.time }, this.drags.map(function (n) {
              n.call(e, e.endPos, t);
            });
          }
        } }, { key: "touchEnd", value: function (t) {
          var e = this;this.endPos.time = new Date().getTime() - this.startPos.time, this.el.removeEventListener("touchmove", this, !1), this.el.removeEventListener("touchend", this, !1), this.ends.map(function (n) {
            n.call(e, e.endPos, t);
          });
        } }, { key: "mouseStart", value: function (t) {
          var e = this;this.startPos = { x: t.clientX, y: t.clientY, time: new Date().getTime() }, this.endPos = {}, this.el.addEventListener("mousemove", this, !1), this.el.addEventListener("mouseup", this, !1), this.starts.map(function (n) {
            n.call(e, e.startPos, t);
          });
        } }, { key: "mouseMove", value: function (t) {
          var e = this;this.endPos = { x: t.clientX - this.startPos.x, y: t.clientY - this.startPos.y }, this.drags.map(function (n) {
            n.call(e, e.endPos, t);
          });
        } }, { key: "mouseEnd", value: function (t) {
          var e = this;this.el.removeEventListener("mousemove", this, !1), this.el.removeEventListener("mouseup", this, !1), this.endPos.time = new Date().getTime() - this.startPos.time, this.ends.map(function (n) {
            n.call(e, e.endPos, t);
          });
        } }, { key: "start", value: function (t) {
          return this.starts.push(t), this;
        } }, { key: "end", value: function (t) {
          return this.ends.push(t), this;
        } }, { key: "drag", value: function (t) {
          return this.drags.push(t), this;
        } }, { key: "reset", value: function (t) {
          var e = t.touches ? t.touches[0] : {};this.startPos = { x: e.pageX || t.clientX, y: e.pageY || t.clientY, time: new Date().getTime() }, this.endPos = { x: 0, y: 0 };
        } }, { key: "destory", value: function () {
          s ? this.el.removeEventListener("touchstart", this, !1) : this.el.removeEventListener("mousedown", this, !1);
        } }]), t;
    }();e.a = l;
  }, function (t, e, n) {
    t.exports = { default: n(258), __esModule: !0 };
  }, function (t, e, n) {
    t.exports = { default: n(259), __esModule: !0 };
  }, function (t, e, n) {
    "use strict";
    function i(t) {
      return t && t.__esModule ? t : { default: t };
    }e.__esModule = !0;var r = n(251),
        a = i(r),
        o = n(250),
        s = i(o),
        l = "function" == typeof s.default && "symbol" == typeof a.default ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof s.default && t.constructor === s.default && t !== s.default.prototype ? "symbol" : typeof t;
    };e.default = "function" == typeof s.default && "symbol" === l(a.default) ? function (t) {
      return void 0 === t ? "undefined" : l(t);
    } : function (t) {
      return t && "function" == typeof s.default && t.constructor === s.default && t !== s.default.prototype ? "symbol" : void 0 === t ? "undefined" : l(t);
    };
  }, function (t, e) {
    t.exports = function (t, e, n, i) {
      if (!(t instanceof e) || void 0 !== i && i in t) throw TypeError(n + ": incorrect invocation!");return t;
    };
  }, function (t, e, n) {
    var i = n(18),
        r = n(7).document,
        a = i(r) && i(r.createElement);t.exports = function (t) {
      return a ? r.createElement(t) : {};
    };
  }, function (t, e, n) {
    t.exports = !n(6) && !n(14)(function () {
      return 7 != Object.defineProperty(n(78)("div"), "a", { get: function () {
          return 7;
        } }).a;
    });
  }, function (t, e, n) {
    var i = n(46);t.exports = Array.isArray || function (t) {
      return "Array" == i(t);
    };
  }, function (t, e) {
    t.exports = function (t, e) {
      return { value: e, done: !!t };
    };
  }, function (t, e, n) {
    var i = n(83),
        r = n(47).concat("length", "prototype");e.f = Object.getOwnPropertyNames || function (t) {
      return i(t, r);
    };
  }, function (t, e, n) {
    var i = n(15),
        r = n(16),
        a = n(267)(!1),
        o = n(55)("IE_PROTO");t.exports = function (t, e) {
      var n,
          s = r(t),
          l = 0,
          u = [];for (n in s) n != o && i(s, n) && u.push(n);for (; e.length > l;) i(s, n = e[l++]) && (~a(u, n) || u.push(n));return u;
    };
  }, function (t, e, n) {
    var i = n(10);t.exports = function (t, e, n) {
      for (var r in e) n && t[r] ? t[r] = e[r] : i(t, r, e[r]);return t;
    };
  }, function (t, e, n) {
    t.exports = n(10);
  }, function (t, e, n) {
    var i = n(45),
        r = n(4)("iterator"),
        a = n(19);t.exports = n(3).getIteratorMethod = function (t) {
      if (void 0 != t) return t[r] || t["@@iterator"] || a[i(t)];
    };
  }, function (t, e) {}, function (t, e, n) {
    (function (e) {
      function n(t) {
        if ("string" == typeof t) return t;if (r(t)) return v ? v.call(t) : "";var e = t + "";return "0" == e && 1 / t == -s ? "-0" : e;
      }function i(t) {
        return !!t && "object" == typeof t;
      }function r(t) {
        return "symbol" == typeof t || i(t) && h.call(t) == l;
      }function a(t) {
        return null == t ? "" : n(t);
      }function o(t) {
        return a(t).toLowerCase();
      }var s = 1 / 0,
          l = "[object Symbol]",
          u = "object" == typeof e && e && e.Object === Object && e,
          c = "object" == typeof self && self && self.Object === Object && self,
          d = u || c || Function("return this")(),
          f = Object.prototype,
          h = f.toString,
          p = d.Symbol,
          m = p ? p.prototype : void 0,
          v = m ? m.toString : void 0;t.exports = o;
    }).call(e, n(582));
  }, function (t, e, n) {
    n(305);var i = n(0)(n(191), n(491), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(362);var i = n(0)(n(192), n(545), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(372);var i = n(0)(n(196), n(554), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(328);var i = n(0)(n(198), n(515), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(319);var i = n(0)(n(199), n(506), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(390);var i = n(0)(n(217), n(575), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(388);var i = n(0)(n(223), n(571), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(386);var i = n(0)(n(225), n(569), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(343);var i = n(0)(n(240), n(529), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(356);var i = n(0)(n(241), null, null, null);t.exports = i.exports;
  }, function (e, n) {
    e.exports = t;
  }, function (t, e, n) {
    "use strict";
    var i = n(397),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(398),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(399),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(400),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(401),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(402),
        r = n.n(i);n.d(e, "bottomNav", function () {
      return r.a;
    });var a = n(403),
        o = n.n(a);n.d(e, "bottomNavItem", function () {
      return o.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(404),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(405),
        r = n.n(i);n.d(e, "breadCrumb", function () {
      return r.a;
    });var a = n(406),
        o = n.n(a);n.d(e, "breadCrumbItem", function () {
      return o.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(407),
        r = n.n(i);n.d(e, "card", function () {
      return r.a;
    });var a = n(409),
        o = n.n(a);n.d(e, "cardHeader", function () {
      return o.a;
    });var s = n(410),
        l = n.n(s);n.d(e, "cardMedia", function () {
      return l.a;
    });var u = n(412),
        c = n.n(u);n.d(e, "cardTitle", function () {
      return c.a;
    });var d = n(411),
        f = n.n(d);n.d(e, "cardText", function () {
      return f.a;
    });var h = n(408),
        p = n.n(h);n.d(e, "cardActions", function () {
      return p.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(414),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(415),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(416),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(422),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(427),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(428),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(431),
        r = n.n(i);n.d(e, "flexbox", function () {
      return r.a;
    });var a = n(432),
        o = n.n(a);n.d(e, "flexboxItem", function () {
      return o.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(433),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(300),
        r = (n.n(i), n(435)),
        a = n.n(r);n.d(e, "row", function () {
      return a.a;
    });var o = n(434),
        s = n.n(o);n.d(e, "col", function () {
      return s.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(436),
        r = n.n(i);n.d(e, "gridList", function () {
      return r.a;
    });var a = n(437),
        o = n.n(a);n.d(e, "gridTile", function () {
      return o.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(440),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(441),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(443),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(91),
        r = n.n(i);n.d(e, "list", function () {
      return r.a;
    });var a = n(444),
        o = n.n(a);n.d(e, "listItem", function () {
      return o.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(446),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(449),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(451),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(452),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(453),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(454),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(456),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(457),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(458),
        r = n.n(i);n.d(e, "step", function () {
      return r.a;
    });var a = n(459),
        o = n.n(a);n.d(e, "stepButton", function () {
      return o.a;
    });var s = n(461),
        l = n.n(s);n.d(e, "stepContent", function () {
      return l.a;
    });var u = n(94),
        c = n.n(u);n.d(e, "stepLabel", function () {
      return c.a;
    });var d = n(462),
        f = n.n(d);n.d(e, "stepper", function () {
      return f.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(463),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(464),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(465),
        r = n.n(i);n.d(e, "table", function () {
      return r.a;
    });var a = n(468),
        o = n.n(a);n.d(e, "thead", function () {
      return o.a;
    });var s = n(466),
        l = n.n(s);n.d(e, "tbody", function () {
      return l.a;
    });var u = n(467),
        c = n.n(u);n.d(e, "tfoot", function () {
      return c.a;
    });var d = n(469),
        f = n.n(d);n.d(e, "tr", function () {
      return f.a;
    });var h = n(96),
        p = n.n(h);n.d(e, "th", function () {
      return p.a;
    });var m = n(95),
        v = n.n(m);n.d(e, "td", function () {
      return v.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(471),
        r = n.n(i);n.d(e, "tabs", function () {
      return r.a;
    });var a = n(470),
        o = n.n(a);n.d(e, "tab", function () {
      return o.a;
    });
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(477),
        r = n.n(i);n.d(e, "timeline", function () {
      return r.a;
    });var a = n(478),
        o = n.n(a);n.d(e, "timelineItem", function () {
      return o.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(483),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(485),
        r = n.n(i);n.d(e, "a", function () {
      return r.a;
    });
  }, function (t, e) {}, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(88),
        r = n.n(i);n.d(e, "levenshteinDistance", function () {
      return a;
    }), n.d(e, "noFilter", function () {
      return o;
    }), n.d(e, "caseSensitiveFilter", function () {
      return s;
    }), n.d(e, "caseInsensitiveFilter", function () {
      return l;
    }), n.d(e, "levenshteinDistanceFilter", function () {
      return u;
    }), n.d(e, "fuzzyFilter", function () {
      return c;
    });var a = function (t, e) {
      for (var n = [], i = void 0, r = void 0, a = 0; a <= e.length; a++) for (var o = 0; o <= t.length; o++) r = a && o ? t.charAt(o - 1) === e.charAt(a - 1) ? i : Math.min(n[o], n[o - 1], i) + 1 : a + o, i = n[o], n[o] = r;return n.pop();
    },
        o = function () {
      return !0;
    },
        s = function (t, e) {
      return "" !== t && e.indexOf(t) !== -1;
    },
        l = function (t, e) {
      return r()(e).indexOf(t.toLowerCase()) !== -1;
    },
        u = function (t) {
      if (void 0 === t) return a;if ("number" != typeof t) throw "Error: levenshteinDistanceFilter is a filter generator, not a filter!";return function (e, n) {
        return a(e, n) < t;
      };
    },
        c = function (t, e) {
      var n = r()(e);t = r()(t);for (var i = 0, a = 0; a < e.length; a++) n[a] === t[i] && (i += 1);return i === t.length;
    };
  }, function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return i;
    });var i = function (t) {
      for (var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0, n = document.getElementsByTagName("body")[0], i = n.scrollTop, r = 60; r >= 0; r--) setTimeout(function (t) {
        return function () {
          n.scrollTop = i * t / 60, 0 === t && "function" == typeof e && e();
        };
      }(r), t * (1 - r / 60));
    };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), n.d(e, "red50", function () {
      return i;
    }), n.d(e, "red100", function () {
      return r;
    }), n.d(e, "red200", function () {
      return a;
    }), n.d(e, "red300", function () {
      return o;
    }), n.d(e, "red400", function () {
      return s;
    }), n.d(e, "red500", function () {
      return l;
    }), n.d(e, "red600", function () {
      return u;
    }), n.d(e, "red700", function () {
      return c;
    }), n.d(e, "red800", function () {
      return d;
    }), n.d(e, "red900", function () {
      return f;
    }), n.d(e, "redA100", function () {
      return h;
    }), n.d(e, "redA200", function () {
      return p;
    }), n.d(e, "redA400", function () {
      return m;
    }), n.d(e, "redA700", function () {
      return v;
    }), n.d(e, "red", function () {
      return y;
    }), n.d(e, "pink50", function () {
      return g;
    }), n.d(e, "pink100", function () {
      return b;
    }), n.d(e, "pink200", function () {
      return x;
    }), n.d(e, "pink300", function () {
      return C;
    }), n.d(e, "pink400", function () {
      return _;
    }), n.d(e, "pink500", function () {
      return S;
    }), n.d(e, "pink600", function () {
      return w;
    }), n.d(e, "pink700", function () {
      return k;
    }), n.d(e, "pink800", function () {
      return $;
    }), n.d(e, "pink900", function () {
      return O;
    }), n.d(e, "pinkA100", function () {
      return T;
    }), n.d(e, "pinkA200", function () {
      return M;
    }), n.d(e, "pinkA400", function () {
      return D;
    }), n.d(e, "pinkA700", function () {
      return F;
    }), n.d(e, "pink", function () {
      return E;
    }), n.d(e, "purple50", function () {
      return P;
    }), n.d(e, "purple100", function () {
      return A;
    }), n.d(e, "purple200", function () {
      return j;
    }), n.d(e, "purple300", function () {
      return B;
    }), n.d(e, "purple400", function () {
      return R;
    }), n.d(e, "purple500", function () {
      return I;
    }), n.d(e, "purple600", function () {
      return L;
    }), n.d(e, "purple700", function () {
      return z;
    }), n.d(e, "purple800", function () {
      return N;
    }), n.d(e, "purple900", function () {
      return H;
    }), n.d(e, "purpleA100", function () {
      return W;
    }), n.d(e, "purpleA200", function () {
      return V;
    }), n.d(e, "purpleA400", function () {
      return Y;
    }), n.d(e, "purpleA700", function () {
      return K;
    }), n.d(e, "purple", function () {
      return G;
    }), n.d(e, "deepPurple50", function () {
      return X;
    }), n.d(e, "deepPurple100", function () {
      return U;
    }), n.d(e, "deepPurple200", function () {
      return q;
    }), n.d(e, "deepPurple300", function () {
      return Z;
    }), n.d(e, "deepPurple400", function () {
      return J;
    }), n.d(e, "deepPurple500", function () {
      return Q;
    }), n.d(e, "deepPurple600", function () {
      return tt;
    }), n.d(e, "deepPurple700", function () {
      return et;
    }), n.d(e, "deepPurple800", function () {
      return nt;
    }), n.d(e, "deepPurple900", function () {
      return it;
    }), n.d(e, "deepPurpleA100", function () {
      return rt;
    }), n.d(e, "deepPurpleA200", function () {
      return at;
    }), n.d(e, "deepPurpleA400", function () {
      return ot;
    }), n.d(e, "deepPurpleA700", function () {
      return st;
    }), n.d(e, "deepPurple", function () {
      return lt;
    }), n.d(e, "indigo50", function () {
      return ut;
    }), n.d(e, "indigo100", function () {
      return ct;
    }), n.d(e, "indigo200", function () {
      return dt;
    }), n.d(e, "indigo300", function () {
      return ft;
    }), n.d(e, "indigo400", function () {
      return ht;
    }), n.d(e, "indigo500", function () {
      return pt;
    }), n.d(e, "indigo600", function () {
      return mt;
    }), n.d(e, "indigo700", function () {
      return vt;
    }), n.d(e, "indigo800", function () {
      return yt;
    }), n.d(e, "indigo900", function () {
      return gt;
    }), n.d(e, "indigoA100", function () {
      return bt;
    }), n.d(e, "indigoA200", function () {
      return xt;
    }), n.d(e, "indigoA400", function () {
      return Ct;
    }), n.d(e, "indigoA700", function () {
      return _t;
    }), n.d(e, "indigo", function () {
      return St;
    }), n.d(e, "blue50", function () {
      return wt;
    }), n.d(e, "blue100", function () {
      return kt;
    }), n.d(e, "blue200", function () {
      return $t;
    }), n.d(e, "blue300", function () {
      return Ot;
    }), n.d(e, "blue400", function () {
      return Tt;
    }), n.d(e, "blue500", function () {
      return Mt;
    }), n.d(e, "blue600", function () {
      return Dt;
    }), n.d(e, "blue700", function () {
      return Ft;
    }), n.d(e, "blue800", function () {
      return Et;
    }), n.d(e, "blue900", function () {
      return Pt;
    }), n.d(e, "blueA100", function () {
      return At;
    }), n.d(e, "blueA200", function () {
      return jt;
    }), n.d(e, "blueA400", function () {
      return Bt;
    }), n.d(e, "blueA700", function () {
      return Rt;
    }), n.d(e, "blue", function () {
      return It;
    }), n.d(e, "lightBlue50", function () {
      return Lt;
    }), n.d(e, "lightBlue100", function () {
      return zt;
    }), n.d(e, "lightBlue200", function () {
      return Nt;
    }), n.d(e, "lightBlue300", function () {
      return Ht;
    }), n.d(e, "lightBlue400", function () {
      return Wt;
    }), n.d(e, "lightBlue500", function () {
      return Vt;
    }), n.d(e, "lightBlue600", function () {
      return Yt;
    }), n.d(e, "lightBlue700", function () {
      return Kt;
    }), n.d(e, "lightBlue800", function () {
      return Gt;
    }), n.d(e, "lightBlue900", function () {
      return Xt;
    }), n.d(e, "lightBlueA100", function () {
      return Ut;
    }), n.d(e, "lightBlueA200", function () {
      return qt;
    }), n.d(e, "lightBlueA400", function () {
      return Zt;
    }), n.d(e, "lightBlueA700", function () {
      return Jt;
    }), n.d(e, "lightBlue", function () {
      return Qt;
    }), n.d(e, "cyan50", function () {
      return te;
    }), n.d(e, "cyan100", function () {
      return ee;
    }), n.d(e, "cyan200", function () {
      return ne;
    }), n.d(e, "cyan300", function () {
      return ie;
    }), n.d(e, "cyan400", function () {
      return re;
    }), n.d(e, "cyan500", function () {
      return ae;
    }), n.d(e, "cyan600", function () {
      return oe;
    }), n.d(e, "cyan700", function () {
      return se;
    }), n.d(e, "cyan800", function () {
      return le;
    }), n.d(e, "cyan900", function () {
      return ue;
    }), n.d(e, "cyanA100", function () {
      return ce;
    }), n.d(e, "cyanA200", function () {
      return de;
    }), n.d(e, "cyanA400", function () {
      return fe;
    }), n.d(e, "cyanA700", function () {
      return he;
    }), n.d(e, "cyan", function () {
      return pe;
    }), n.d(e, "teal50", function () {
      return me;
    }), n.d(e, "teal100", function () {
      return ve;
    }), n.d(e, "teal200", function () {
      return ye;
    }), n.d(e, "teal300", function () {
      return ge;
    }), n.d(e, "teal400", function () {
      return be;
    }), n.d(e, "teal500", function () {
      return xe;
    }), n.d(e, "teal600", function () {
      return Ce;
    }), n.d(e, "teal700", function () {
      return _e;
    }), n.d(e, "teal800", function () {
      return Se;
    }), n.d(e, "teal900", function () {
      return we;
    }), n.d(e, "tealA100", function () {
      return ke;
    }), n.d(e, "tealA200", function () {
      return $e;
    }), n.d(e, "tealA400", function () {
      return Oe;
    }), n.d(e, "tealA700", function () {
      return Te;
    }), n.d(e, "teal", function () {
      return Me;
    }), n.d(e, "green50", function () {
      return De;
    }), n.d(e, "green100", function () {
      return Fe;
    }), n.d(e, "green200", function () {
      return Ee;
    }), n.d(e, "green300", function () {
      return Pe;
    }), n.d(e, "green400", function () {
      return Ae;
    }), n.d(e, "green500", function () {
      return je;
    }), n.d(e, "green600", function () {
      return Be;
    }), n.d(e, "green700", function () {
      return Re;
    }), n.d(e, "green800", function () {
      return Ie;
    }), n.d(e, "green900", function () {
      return Le;
    }), n.d(e, "greenA100", function () {
      return ze;
    }), n.d(e, "greenA200", function () {
      return Ne;
    }), n.d(e, "greenA400", function () {
      return He;
    }), n.d(e, "greenA700", function () {
      return We;
    }), n.d(e, "green", function () {
      return Ve;
    }), n.d(e, "lightGreen50", function () {
      return Ye;
    }), n.d(e, "lightGreen100", function () {
      return Ke;
    }), n.d(e, "lightGreen200", function () {
      return Ge;
    }), n.d(e, "lightGreen300", function () {
      return Xe;
    }), n.d(e, "lightGreen400", function () {
      return Ue;
    }), n.d(e, "lightGreen500", function () {
      return qe;
    }), n.d(e, "lightGreen600", function () {
      return Ze;
    }), n.d(e, "lightGreen700", function () {
      return Je;
    }), n.d(e, "lightGreen800", function () {
      return Qe;
    }), n.d(e, "lightGreen900", function () {
      return tn;
    }), n.d(e, "lightGreenA100", function () {
      return en;
    }), n.d(e, "lightGreenA200", function () {
      return nn;
    }), n.d(e, "lightGreenA400", function () {
      return rn;
    }), n.d(e, "lightGreenA700", function () {
      return an;
    }), n.d(e, "lightGreen", function () {
      return on;
    }), n.d(e, "lime50", function () {
      return sn;
    }), n.d(e, "lime100", function () {
      return ln;
    }), n.d(e, "lime200", function () {
      return un;
    }), n.d(e, "lime300", function () {
      return cn;
    }), n.d(e, "lime400", function () {
      return dn;
    }), n.d(e, "lime500", function () {
      return fn;
    }), n.d(e, "lime600", function () {
      return hn;
    }), n.d(e, "lime700", function () {
      return pn;
    }), n.d(e, "lime800", function () {
      return mn;
    }), n.d(e, "lime900", function () {
      return vn;
    }), n.d(e, "limeA100", function () {
      return yn;
    }), n.d(e, "limeA200", function () {
      return gn;
    }), n.d(e, "limeA400", function () {
      return bn;
    }), n.d(e, "limeA700", function () {
      return xn;
    }), n.d(e, "lime", function () {
      return Cn;
    }), n.d(e, "yellow50", function () {
      return _n;
    }), n.d(e, "yellow100", function () {
      return Sn;
    }), n.d(e, "yellow200", function () {
      return wn;
    }), n.d(e, "yellow300", function () {
      return kn;
    }), n.d(e, "yellow400", function () {
      return $n;
    }), n.d(e, "yellow500", function () {
      return On;
    }), n.d(e, "yellow600", function () {
      return Tn;
    }), n.d(e, "yellow700", function () {
      return Mn;
    }), n.d(e, "yellow800", function () {
      return Dn;
    }), n.d(e, "yellow900", function () {
      return Fn;
    }), n.d(e, "yellowA100", function () {
      return En;
    }), n.d(e, "yellowA200", function () {
      return Pn;
    }), n.d(e, "yellowA400", function () {
      return An;
    }), n.d(e, "yellowA700", function () {
      return jn;
    }), n.d(e, "yellow", function () {
      return Bn;
    }), n.d(e, "amber50", function () {
      return Rn;
    }), n.d(e, "amber100", function () {
      return In;
    }), n.d(e, "amber200", function () {
      return Ln;
    }), n.d(e, "amber300", function () {
      return zn;
    });n.d(e, "amber400", function () {
      return Nn;
    }), n.d(e, "amber500", function () {
      return Hn;
    }), n.d(e, "amber600", function () {
      return Wn;
    }), n.d(e, "amber700", function () {
      return Vn;
    }), n.d(e, "amber800", function () {
      return Yn;
    }), n.d(e, "amber900", function () {
      return Kn;
    }), n.d(e, "amberA100", function () {
      return Gn;
    }), n.d(e, "amberA200", function () {
      return Xn;
    }), n.d(e, "amberA400", function () {
      return Un;
    }), n.d(e, "amberA700", function () {
      return qn;
    }), n.d(e, "amber", function () {
      return Zn;
    }), n.d(e, "orange50", function () {
      return Jn;
    }), n.d(e, "orange100", function () {
      return Qn;
    }), n.d(e, "orange200", function () {
      return ti;
    }), n.d(e, "orange300", function () {
      return ei;
    }), n.d(e, "orange400", function () {
      return ni;
    }), n.d(e, "orange500", function () {
      return ii;
    }), n.d(e, "orange600", function () {
      return ri;
    }), n.d(e, "orange700", function () {
      return ai;
    }), n.d(e, "orange800", function () {
      return oi;
    }), n.d(e, "orange900", function () {
      return si;
    }), n.d(e, "orangeA100", function () {
      return li;
    }), n.d(e, "orangeA200", function () {
      return ui;
    }), n.d(e, "orangeA400", function () {
      return ci;
    }), n.d(e, "orangeA700", function () {
      return di;
    }), n.d(e, "orange", function () {
      return fi;
    }), n.d(e, "deepOrange50", function () {
      return hi;
    }), n.d(e, "deepOrange100", function () {
      return pi;
    }), n.d(e, "deepOrange200", function () {
      return mi;
    }), n.d(e, "deepOrange300", function () {
      return vi;
    }), n.d(e, "deepOrange400", function () {
      return yi;
    }), n.d(e, "deepOrange500", function () {
      return gi;
    }), n.d(e, "deepOrange600", function () {
      return bi;
    }), n.d(e, "deepOrange700", function () {
      return xi;
    }), n.d(e, "deepOrange800", function () {
      return Ci;
    }), n.d(e, "deepOrange900", function () {
      return _i;
    }), n.d(e, "deepOrangeA100", function () {
      return Si;
    }), n.d(e, "deepOrangeA200", function () {
      return wi;
    }), n.d(e, "deepOrangeA400", function () {
      return ki;
    }), n.d(e, "deepOrangeA700", function () {
      return $i;
    }), n.d(e, "deepOrange", function () {
      return Oi;
    }), n.d(e, "brown50", function () {
      return Ti;
    }), n.d(e, "brown100", function () {
      return Mi;
    }), n.d(e, "brown200", function () {
      return Di;
    }), n.d(e, "brown300", function () {
      return Fi;
    }), n.d(e, "brown400", function () {
      return Ei;
    }), n.d(e, "brown500", function () {
      return Pi;
    }), n.d(e, "brown600", function () {
      return Ai;
    }), n.d(e, "brown700", function () {
      return ji;
    }), n.d(e, "brown800", function () {
      return Bi;
    }), n.d(e, "brown900", function () {
      return Ri;
    }), n.d(e, "brown", function () {
      return Ii;
    }), n.d(e, "blueGrey50", function () {
      return Li;
    }), n.d(e, "blueGrey100", function () {
      return zi;
    }), n.d(e, "blueGrey200", function () {
      return Ni;
    }), n.d(e, "blueGrey300", function () {
      return Hi;
    }), n.d(e, "blueGrey400", function () {
      return Wi;
    }), n.d(e, "blueGrey500", function () {
      return Vi;
    }), n.d(e, "blueGrey600", function () {
      return Yi;
    }), n.d(e, "blueGrey700", function () {
      return Ki;
    }), n.d(e, "blueGrey800", function () {
      return Gi;
    }), n.d(e, "blueGrey900", function () {
      return Xi;
    }), n.d(e, "blueGrey", function () {
      return Ui;
    }), n.d(e, "grey50", function () {
      return qi;
    }), n.d(e, "grey100", function () {
      return Zi;
    }), n.d(e, "grey200", function () {
      return Ji;
    }), n.d(e, "grey300", function () {
      return Qi;
    }), n.d(e, "grey400", function () {
      return tr;
    }), n.d(e, "grey500", function () {
      return er;
    }), n.d(e, "grey600", function () {
      return nr;
    }), n.d(e, "grey700", function () {
      return ir;
    }), n.d(e, "grey800", function () {
      return rr;
    }), n.d(e, "grey900", function () {
      return ar;
    }), n.d(e, "grey", function () {
      return or;
    }), n.d(e, "black", function () {
      return sr;
    }), n.d(e, "white", function () {
      return lr;
    }), n.d(e, "transparent", function () {
      return ur;
    }), n.d(e, "fullBlack", function () {
      return cr;
    }), n.d(e, "darkBlack", function () {
      return dr;
    }), n.d(e, "lightBlack", function () {
      return fr;
    }), n.d(e, "minBlack", function () {
      return hr;
    }), n.d(e, "faintBlack", function () {
      return pr;
    }), n.d(e, "fullWhite", function () {
      return mr;
    }), n.d(e, "darkWhite", function () {
      return vr;
    }), n.d(e, "lightWhite", function () {
      return yr;
    });var i = "#ffebee",
        r = "#ffcdd2",
        a = "#ef9a9a",
        o = "#e57373",
        s = "#ef5350",
        l = "#f44336",
        u = "#e53935",
        c = "#d32f2f",
        d = "#c62828",
        f = "#b71c1c",
        h = "#ff8a80",
        p = "#ff5252",
        m = "#ff1744",
        v = "#d50000",
        y = l,
        g = "#fce4ec",
        b = "#f8bbd0",
        x = "#f48fb1",
        C = "#f06292",
        _ = "#ec407a",
        S = "#e91e63",
        w = "#d81b60",
        k = "#c2185b",
        $ = "#ad1457",
        O = "#880e4f",
        T = "#ff80ab",
        M = "#ff4081",
        D = "#f50057",
        F = "#c51162",
        E = S,
        P = "#f3e5f5",
        A = "#e1bee7",
        j = "#ce93d8",
        B = "#ba68c8",
        R = "#ab47bc",
        I = "#9c27b0",
        L = "#8e24aa",
        z = "#7b1fa2",
        N = "#6a1b9a",
        H = "#4a148c",
        W = "#ea80fc",
        V = "#e040fb",
        Y = "#d500f9",
        K = "#aa00ff",
        G = I,
        X = "#ede7f6",
        U = "#d1c4e9",
        q = "#b39ddb",
        Z = "#9575cd",
        J = "#7e57c2",
        Q = "#673ab7",
        tt = "#5e35b1",
        et = "#512da8",
        nt = "#4527a0",
        it = "#311b92",
        rt = "#b388ff",
        at = "#7c4dff",
        ot = "#651fff",
        st = "#6200ea",
        lt = Q,
        ut = "#e8eaf6",
        ct = "#c5cae9",
        dt = "#9fa8da",
        ft = "#7986cb",
        ht = "#5c6bc0",
        pt = "#3f51b5",
        mt = "#3949ab",
        vt = "#303f9f",
        yt = "#283593",
        gt = "#1a237e",
        bt = "#8c9eff",
        xt = "#536dfe",
        Ct = "#3d5afe",
        _t = "#304ffe",
        St = pt,
        wt = "#e3f2fd",
        kt = "#bbdefb",
        $t = "#90caf9",
        Ot = "#64b5f6",
        Tt = "#42a5f5",
        Mt = "#2196f3",
        Dt = "#1e88e5",
        Ft = "#1976d2",
        Et = "#1565c0",
        Pt = "#0d47a1",
        At = "#82b1ff",
        jt = "#448aff",
        Bt = "#2979ff",
        Rt = "#2962ff",
        It = Mt,
        Lt = "#e1f5fe",
        zt = "#b3e5fc",
        Nt = "#81d4fa",
        Ht = "#4fc3f7",
        Wt = "#29b6f6",
        Vt = "#03a9f4",
        Yt = "#039be5",
        Kt = "#0288d1",
        Gt = "#0277bd",
        Xt = "#01579b",
        Ut = "#80d8ff",
        qt = "#40c4ff",
        Zt = "#00b0ff",
        Jt = "#0091ea",
        Qt = Vt,
        te = "#e0f7fa",
        ee = "#b2ebf2",
        ne = "#80deea",
        ie = "#4dd0e1",
        re = "#26c6da",
        ae = "#00bcd4",
        oe = "#00acc1",
        se = "#0097a7",
        le = "#00838f",
        ue = "#006064",
        ce = "#84ffff",
        de = "#18ffff",
        fe = "#00e5ff",
        he = "#00b8d4",
        pe = ae,
        me = "#e0f2f1",
        ve = "#b2dfdb",
        ye = "#80cbc4",
        ge = "#4db6ac",
        be = "#26a69a",
        xe = "#009688",
        Ce = "#00897b",
        _e = "#00796b",
        Se = "#00695c",
        we = "#004d40",
        ke = "#a7ffeb",
        $e = "#64ffda",
        Oe = "#1de9b6",
        Te = "#00bfa5",
        Me = xe,
        De = "#e8f5e9",
        Fe = "#c8e6c9",
        Ee = "#a5d6a7",
        Pe = "#81c784",
        Ae = "#66bb6a",
        je = "#4caf50",
        Be = "#43a047",
        Re = "#388e3c",
        Ie = "#2e7d32",
        Le = "#1b5e20",
        ze = "#b9f6ca",
        Ne = "#69f0ae",
        He = "#00e676",
        We = "#00c853",
        Ve = je,
        Ye = "#f1f8e9",
        Ke = "#dcedc8",
        Ge = "#c5e1a5",
        Xe = "#aed581",
        Ue = "#9ccc65",
        qe = "#8bc34a",
        Ze = "#7cb342",
        Je = "#689f38",
        Qe = "#558b2f",
        tn = "#33691e",
        en = "#ccff90",
        nn = "#b2ff59",
        rn = "#76ff03",
        an = "#64dd17",
        on = qe,
        sn = "#f9fbe7",
        ln = "#f0f4c3",
        un = "#e6ee9c",
        cn = "#dce775",
        dn = "#d4e157",
        fn = "#cddc39",
        hn = "#c0ca33",
        pn = "#afb42b",
        mn = "#9e9d24",
        vn = "#827717",
        yn = "#f4ff81",
        gn = "#eeff41",
        bn = "#c6ff00",
        xn = "#aeea00",
        Cn = fn,
        _n = "#fffde7",
        Sn = "#fff9c4",
        wn = "#fff59d",
        kn = "#fff176",
        $n = "#ffee58",
        On = "#ffeb3b",
        Tn = "#fdd835",
        Mn = "#fbc02d",
        Dn = "#f9a825",
        Fn = "#f57f17",
        En = "#ffff8d",
        Pn = "#ffff00",
        An = "#ffea00",
        jn = "#ffd600",
        Bn = On,
        Rn = "#fff8e1",
        In = "#ffecb3",
        Ln = "#ffe082",
        zn = "#ffd54f",
        Nn = "#ffca28",
        Hn = "#ffc107",
        Wn = "#ffb300",
        Vn = "#ffa000",
        Yn = "#ff8f00",
        Kn = "#ff6f00",
        Gn = "#ffe57f",
        Xn = "#ffd740",
        Un = "#ffc400",
        qn = "#ffab00",
        Zn = Hn,
        Jn = "#fff3e0",
        Qn = "#ffe0b2",
        ti = "#ffcc80",
        ei = "#ffb74d",
        ni = "#ffa726",
        ii = "#ff9800",
        ri = "#fb8c00",
        ai = "#f57c00",
        oi = "#ef6c00",
        si = "#e65100",
        li = "#ffd180",
        ui = "#ffab40",
        ci = "#ff9100",
        di = "#ff6d00",
        fi = ii,
        hi = "#fbe9e7",
        pi = "#ffccbc",
        mi = "#ffab91",
        vi = "#ff8a65",
        yi = "#ff7043",
        gi = "#ff5722",
        bi = "#f4511e",
        xi = "#e64a19",
        Ci = "#d84315",
        _i = "#bf360c",
        Si = "#ff9e80",
        wi = "#ff6e40",
        ki = "#ff3d00",
        $i = "#dd2c00",
        Oi = gi,
        Ti = "#efebe9",
        Mi = "#d7ccc8",
        Di = "#bcaaa4",
        Fi = "#a1887f",
        Ei = "#8d6e63",
        Pi = "#795548",
        Ai = "#6d4c41",
        ji = "#5d4037",
        Bi = "#4e342e",
        Ri = "#3e2723",
        Ii = Pi,
        Li = "#eceff1",
        zi = "#cfd8dc",
        Ni = "#b0bec5",
        Hi = "#90a4ae",
        Wi = "#78909c",
        Vi = "#607d8b",
        Yi = "#546e7a",
        Ki = "#455a64",
        Gi = "#37474f",
        Xi = "#263238",
        Ui = Vi,
        qi = "#fafafa",
        Zi = "#f5f5f5",
        Ji = "#eeeeee",
        Qi = "#e0e0e0",
        tr = "#bdbdbd",
        er = "#9e9e9e",
        nr = "#757575",
        ir = "#616161",
        rr = "#424242",
        ar = "#212121",
        or = er,
        sr = "#000000",
        lr = "#ffffff",
        ur = "rgba(0, 0, 0, 0)",
        cr = "rgba(0, 0, 0, 1)",
        dr = "rgba(0, 0, 0, 0.87)",
        fr = "rgba(0, 0, 0, 0.54)",
        hr = "rgba(0, 0, 0, 0.26)",
        pr = "rgba(0, 0, 0, 0.12)",
        mr = "rgba(255, 255, 255, 1)",
        vr = "rgba(255, 255, 255, 0.87)",
        yr = "rgba(255, 255, 255, 0.54)";
  }, function (t, e, n) {
    "use strict";
    var i,
        r = n(88),
        a = n.n(r),
        o = "undefined" != typeof document ? document.documentElement.style : {},
        s = !1;i = "undefined" != typeof window && window.opera && "[object Opera]" === Object.prototype.toString.call(window.opera) ? "presto" : "MozAppearance" in o ? "gecko" : "WebkitAppearance" in o ? "webkit" : "undefined" != typeof navigator && "string" == typeof navigator.cpuClass ? "trident" : "node";var l = { trident: "-ms-", gecko: "-moz-", webkit: "-webkit-", presto: "-o-" }[i],
        u = { trident: "ms", gecko: "Moz", webkit: "Webkit", presto: "O" }[i],
        c = "undefined" != typeof document ? document.createElement("div") : {},
        d = u + "Perspective",
        f = u + "Transform",
        h = l + "transform",
        p = u + "Transition",
        m = l + "transition",
        v = a()(u) + "TransitionEnd";c.style && void 0 !== c.style[d] && (s = !0);var y = function (t) {
      var e = { left: 0, top: 0 };if (null === t || null === t.style) return e;var n = t.style[f],
          i = /translate\(\s*(-?\d+(\.?\d+?)?)px,\s*(-?\d+(\.\d+)?)px\)\s*translateZ\(0px\)/g.exec(n);return i && (e.left = +i[1], e.top = +i[3]), e;
    },
        g = function (t, e, n) {
      if ((null !== e || null !== n) && null !== t && null !== t.style && (t.style[f] || 0 !== e || 0 !== n)) {
        if (null === e || null === n) {
          var i = y(t);null === e && (e = i.left), null === n && (n = i.top);
        }b(t), t.style[f] += s ? " translate(" + (e ? e + "px" : "0px") + "," + (n ? n + "px" : "0px") + ") translateZ(0px)" : " translate(" + (e ? e + "px" : "0px") + "," + (n ? n + "px" : "0px") + ")";
      }
    },
        b = function (t) {
      if (null !== t && null !== t.style) {
        var e = t.style[f];e && (e = e.replace(/translate\(\s*(-?\d+(\.?\d+?)?)px,\s*(-?\d+(\.\d+)?)px\)\s*translateZ\(0px\)/g, ""), t.style[f] = e);
      }
    };e.a = { transformProperty: f, transformStyleName: h, transitionProperty: p, transitionStyleName: m, transitionEndProperty: v, getElementTranslate: y, translateElement: g, cancelTranslateElement: b };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-appbar", props: { title: { type: String, default: "" }, titleClass: { type: [String, Array, Object] }, zDepth: { type: Number, default: 1 } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(41),
        r = n.n(i),
        a = n(76),
        o = n.n(a),
        s = n(11),
        l = n(17),
        u = n(25),
        c = n(140),
        d = n(21),
        f = n.n(d);e.default = { name: "mu-auto-complete", props: { anchorOrigin: { type: Object, default: function () {
            return { vertical: "bottom", horizontal: "left" };
          } }, targetOrigin: { type: Object, default: function () {
            return { vertical: "top", horizontal: "left" };
          } }, scroller: {}, dataSource: { type: Array, default: function () {
            return [];
          } }, dataSourceConfig: { type: Object, default: function () {
            return { text: "text", value: "value" };
          } }, disableFocusRipple: { type: Boolean, default: !0 }, filter: { type: [String, Function], default: "caseSensitiveFilter" }, maxSearchResults: { type: Number }, openOnFocus: { type: Boolean, default: !1 }, menuCloseDelay: { type: Number, default: 300 }, label: { type: String }, labelFloat: { type: Boolean, default: !1 }, labelClass: { type: [String, Array, Object] }, labelFocusClass: { type: [String, Array, Object] }, disabled: { type: Boolean, default: !1 }, hintText: { type: String }, hintTextClass: { type: [String, Array, Object] }, helpText: { type: String }, helpTextClass: { type: [String, Array, Object] }, errorText: { type: String }, errorColor: { type: String }, icon: { type: String }, iconClass: { type: [String, Array, Object] }, inputClass: { type: [String, Array, Object] }, fullWidth: { type: Boolean, default: !1 }, menuWidth: { type: Number }, maxHeight: { type: Number }, underlineShow: { type: Boolean, default: !0 }, underlineClass: { type: [String, Array, Object] }, underlineFocusClass: { type: [String, Array, Object] }, value: { type: String } }, data: function () {
        return { anchorEl: null, focusTextField: !0, open: !1, searchText: this.value, inputWidth: null };
      }, computed: { list: function t() {
          var e = "string" == typeof this.filter ? c[this.filter] : this.filter,
              n = this.dataSourceConfig,
              i = this.maxSearchResults,
              a = this.searchText;if (!e) return void console.warn("not found filter:" + this.filter);var t = [];return this.dataSource.every(function (s, l) {
            switch (void 0 === s ? "undefined" : o()(s)) {case "string":
                e(a || "", s, s) && t.push({ text: s, value: s, index: l });break;case "object":
                if (s && "string" == typeof s[n.text]) {
                  var u = s[n.text];if (!e(a || "", u, s)) break;var c = s[n.value];t.push(r()({}, s, { text: u, value: c, index: l }));
                }}return !(i && i > 0 && t.length === i);
          }), t;
        } }, methods: { handleFocus: function (t) {
          !this.open && this.openOnFocus && (this.open = !0), this.focusTextField = !0, this.$emit("focus", t);
        }, handleBlur: function (t) {
          this.focusTextField && !this.timerTouchTapCloseId && this.close(), this.$emit("blur", t);
        }, handleClose: function (t) {
          this.focusTextField && "overflow" !== t || this.close();
        }, handleMouseDown: function (t) {
          t.preventDefault();
        }, handleItemClick: function (t) {
          var e = this,
              n = this.list,
              i = this.dataSource,
              r = this.setSearchText,
              a = this.$refs.menu.$children.indexOf(t),
              o = n[a].index,
              s = i[o],
              l = this.chosenRequestText(s);this.timerTouchTapCloseId = setTimeout(function () {
            e.timerTouchTapCloseId = null, r(l), e.close(), e.$emit("select", s, o), e.$emit("change", l);
          }, this.menuCloseDelay);
        }, chosenRequestText: function (t) {
          return "string" == typeof t ? t : t[this.dataSourceConfig.text];
        }, handleInput: function () {
          this.notInput ? this.notInput = !1 : this.open = !0;
        }, blur: function () {
          this.$refs.textField.$el.blur();
        }, focus: function () {
          this.$refs.textField.focus();
        }, close: function () {
          this.open = !1;
        }, handleKeyDown: function (t) {
          switch (this.$emit("keydown", t), f()(t)) {case "enter":
              if (!this.open) return;var e = this.searchText;this.$emit("change", e, -1), this.close();break;case "esc":
              this.close();break;case "down":
              t.preventDefault(), this.open = !0, this.focusTextField = !1;}
        }, setSearchText: function (t) {
          this.notInput = !0, this.searchText = t;
        }, setInputWidth: function () {
          this.$el && (this.inputWidth = this.$el.offsetWidth);
        } }, mounted: function () {
        this.anchorEl = this.$refs.textField.$el, this.setInputWidth();
      }, updated: function () {
        this.setInputWidth();
      }, watch: { value: function (t) {
          t !== this.searchText && this.setSearchText(t);
        }, searchText: function (t) {
          this.$emit("input", t);
        } }, components: { popover: s.a, "text-field": l.a, "mu-menu": u.menu, "menu-item": u.menuItem } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(2),
        r = n(1);e.default = { name: "mu-avatar", props: { backgroundColor: { type: String, default: "" }, color: { type: String, default: "" }, icon: { type: String, default: "" }, iconClass: { type: [String, Object, Array] }, src: { type: String, default: "" }, imgClass: { type: [String, Object, Array] }, size: { type: Number }, iconSize: { type: Number } }, computed: { avatarStyle: function () {
          return { width: this.size ? this.size + "px" : "", height: this.size ? this.size + "px" : "", color: n.i(r.d)(this.color), "background-color": n.i(r.d)(this.backgroundColor) };
        } }, methods: { handleClick: function () {
          this.$emit("click");
        } }, created: function () {
        this._isAvatar = !0;
      }, components: { icon: i.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(141),
        r = n(2);e.default = { name: "mu-back-top", data: function () {
        return { backShow: !1 };
      }, components: { icon: r.a }, props: { height: { type: Number, default: 200 }, bottom: { type: Number, default: 30 }, right: { type: Number, default: 30 }, durations: { type: Number, default: 500 }, callBack: { type: Function, default: function () {} } }, computed: { propsStyle: function () {
          return { right: this.right + "px", bottom: this.bottom + "px" };
        } }, methods: { moveTop: function () {
          n.i(i.a)(this.durations, this.callBack);
        }, scrollListener: function () {
          this.backShow = document.getElementsByTagName("body")[0].scrollTop >= this.height;
        } }, mounted: function () {
        window.addEventListener("scroll", this.scrollListener, !1), window.addEventListener("resize", this.scrollListener, !1);
      }, beforeDestroy: function () {
        window.removeEventListener("scroll", this.handleScroll, !1), window.removeEventListener("resize", this.handleScroll, !1);
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { name: "mu-badge", props: { content: { type: String, default: "" }, color: { type: String, default: "" }, primary: { type: Boolean, default: !1 }, secondary: { type: Boolean, default: !1 }, circle: { type: Boolean, default: !1 }, badgeClass: { type: [String, Object, Array] } }, computed: { badgeStyle: function () {
          return { "background-color": n.i(i.d)(this.color) };
        }, badgeInternalClass: function () {
          var t = this.circle,
              e = this.primary,
              r = this.secondary,
              a = this.badgeClass,
              o = this.$slots && this.$slots.default && this.$slots.default.length > 0,
              s = [];return t && s.push("mu-badge-circle"), e && s.push("mu-badge-primary"), r && s.push("mu-badge-secondary"), o && s.push("mu-badge-float"), s.concat(n.i(i.f)(a));
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5);e.default = { name: "mu-bottom-nav", props: { shift: { type: Boolean, default: !1 }, value: {} }, methods: { handleItemClick: function (t, e) {
          t !== this.value && this.$emit("change", t), this.$emit("itemClick", e), this.$emit("item-click", e);
        }, setChildrenInstance: function () {
          var t = this;this.$slots.default.forEach(function (e) {
            e && e.child && e.child.isBottomNavItem && (e.child.bottomNav = t);
          });
        } }, mounted: function () {
        this.setChildrenInstance();
      }, updated: function () {
        var t = this;this.$slots.default.forEach(function (e) {
          e && e.child && e.child.isBottomNavItem && (e.child.bottomNav = t);
        });
      }, render: function (t) {
        return t(i.a, { class: ["mu-bottom-nav", this.shift ? "mu-bottom-nav-shift" : void 0], props: { disableTouchRipple: !this.shift, centerRipple: !1, wrapperClass: "mu-bottom-nav-shift-wrapper", containerElement: "div", rippleOpacity: .3 } }, this.$slots.default);
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5),
        r = n(9),
        a = n(2),
        o = n(1);e.default = { name: "mu-bottom-nav-item", mixins: [r.a], props: { icon: { type: String, default: "" }, iconClass: { type: [String, Object, Array] }, title: { type: String, default: "" }, titleClass: { type: [String, Object, Array] }, href: { type: String }, value: {} }, data: function () {
        return { bottomNav: null };
      }, created: function () {
        this.isBottomNavItem = !0;
      }, computed: { active: function () {
          return this.bottomNav && n.i(o.c)(this.value) && this.bottomNav.value === this.value;
        }, shift: function () {
          return this.bottomNav && this.bottomNav.shift;
        } }, methods: { handleClick: function () {
          this.bottomNav && this.bottomNav.handleItemClick && this.bottomNav.handleItemClick(this.value);
        } }, mounted: function () {
        for (var t = this.$parent.$children, e = 0; e < t.length; e++) if (t[e].$el === this.$el) {
          this.index = e;break;
        }
      }, components: { "abstract-button": i.a, icon: a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(27);e.default = { name: "mu-bottom-sheet", mixins: [i.a], props: { sheetClass: { type: [String, Object, Array] } }, methods: { show: function () {
          this.$emit("show");
        }, hide: function () {
          this.$emit("hide");
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-breadcrumb", props: { separator: { type: String, default: "/" } }, methods: { updateChildren: function () {
          var t = this;this.$children.forEach(function (e) {
            e.separator = t.separator;
          });
        } }, mounted: function () {
        this.updateChildren();
      }, updated: function () {
        var t = this;this.$nextTick(function () {
          t.updateChildren();
        });
      }, watch: { separator: function () {
          this.updateChildren();
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = "mu-breadcrumb-item";e.default = { name: "mu-breadcrumb-item", data: function () {
        return { separator: "" };
      }, props: { href: { type: String, default: "" } }, computed: { separatorClass: function () {
          return i + "-separator";
        }, linkClass: function () {
          return i + "-link";
        }, currentClass: function () {
          return i + "-current";
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-card" };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-card-actions" };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-card-header", props: { title: { type: String }, titleClass: { type: [String, Array, Object] }, subTitle: { type: String }, subTitleClass: { type: [String, Array, Object] } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-card-media", props: { title: { type: String }, titleClass: { type: [String, Array, Object] }, subTitle: { type: String }, subTitleClass: { type: [String, Array, Object] } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-card-text" };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-card-title", props: { title: { type: String }, titleClass: { type: [String, Array, Object] }, subTitle: { type: String }, subTitleClass: { type: [String, Array, Object] } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(2),
        r = n(38),
        a = n.n(r);e.default = { name: "mu-checkbox", props: { name: { type: String }, value: {}, nativeValue: { type: String }, label: { type: String, default: "" }, labelLeft: { type: Boolean, default: !1 }, labelClass: { type: [String, Object, Array] }, disabled: { type: Boolean, default: !1 }, uncheckIcon: { type: String, default: "" }, checkedIcon: { type: String, default: "" }, iconClass: { type: [String, Object, Array] } }, data: function () {
        return { inputValue: this.value };
      }, watch: { value: function (t) {
          this.inputValue = t;
        }, inputValue: function (t) {
          this.$emit("input", t);
        } }, methods: { handleClick: function () {}, handleMouseDown: function (t) {
          this.disabled || 0 === t.button && this.$children[0].start(t);
        }, handleMouseUp: function () {
          this.disabled || this.$children[0].end();
        }, handleMouseLeave: function () {
          this.disabled || this.$children[0].end();
        }, handleTouchStart: function (t) {
          this.disabled || this.$children[0].start(t);
        }, handleTouchEnd: function () {
          this.disabled || this.$children[0].end();
        }, handleChange: function () {
          this.$emit("change", this.inputValue);
        } }, components: { icon: i.a, "touch-ripple": a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { name: "mu-chip", props: { showDelete: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 }, deleteIconClass: { type: [Array, String, Object] }, backgroundColor: { type: String }, color: { type: String } }, data: function () {
        return { focus: !1, hover: !1 };
      }, computed: { classNames: function () {
          return this.disabled ? null : this.focus ? ["hover", "active"] : this.hover ? ["hover"] : null;
        }, style: function () {
          return { "background-color": n.i(i.d)(this.backgroundColor), color: n.i(i.d)(this.color) };
        } }, methods: { onMouseenter: function () {
          n.i(i.g)() && (this.hover = !0);
        }, onMouseleave: function () {
          n.i(i.g)() && (this.hover = !1);
        }, onMousedown: function () {
          this.focus = !0;
        }, onMouseup: function () {
          this.focus = !1;
        }, onTouchstart: function () {
          this.focus = !0;
        }, onTouchend: function () {
          this.focus = !1;
        }, handleDelete: function () {
          this.$emit("delete");
        }, handleClick: function (t) {
          this.disabled || this.$emit("click", t);
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(62),
        r = n.n(i),
        a = n(1);e.default = { name: "mu-circular-progress", props: { max: { type: Number, default: 100 }, min: { type: Number, default: 0 }, mode: { type: String, default: "indeterminate", validator: function (t) {
            return ["indeterminate", "determinate"].indexOf(t) !== -1;
          } }, value: { type: Number, default: 0 }, color: { type: String }, size: { type: Number, default: 24 }, strokeWidth: { type: Number, default: 3 } }, computed: { radius: function () {
          return (this.size - this.strokeWidth) / 2;
        }, circularSvgStyle: function () {
          return { width: this.size, height: this.size };
        }, circularPathStyle: function () {
          var t = this.getRelativeValue();return { stroke: n.i(a.d)(this.color), "stroke-dasharray": this.getArcLength(t) + ", " + this.getArcLength(1) };
        } }, methods: { getArcLength: function (t) {
          return t * Math.PI * (this.size - this.strokeWidth);
        }, getRelativeValue: function () {
          var t = this.value,
              e = this.min,
              n = this.max;return Math.min(Math.max(e, t), n) / (n - e);
        } }, components: { circular: r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-content-block" };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(421),
        r = n.n(i),
        a = n(419),
        o = n.n(a),
        s = n(23),
        l = n(418),
        u = n.n(l),
        c = n(26),
        d = n(420),
        f = n.n(d),
        h = n(21),
        p = n.n(h);e.default = { props: { dateTimeFormat: { type: Object, default: function () {
            return c.a;
          } }, autoOk: { type: Boolean, default: !1 }, okLabel: { type: String, default: "确定" }, cancelLabel: { type: String, default: "取消" }, disableYearSelection: { type: Boolean, default: !1 }, firstDayOfWeek: { type: Number, default: 1 }, initialDate: { type: Date, default: function () {
            return new Date();
          } }, maxDate: { type: Date, default: function () {
            return c.d(new Date(), 100);
          } }, minDate: { type: Date, default: function () {
            return c.d(new Date(), -100);
          } }, mode: { type: String, default: "portrait", validator: function (t) {
            return t && ["portrait", "landscape"].indexOf(t) !== -1;
          } }, shouldDisableDate: { type: Function } }, data: function () {
        var t = c.e(this.initialDate);return t.setDate(1), { weekTexts: this.dateTimeFormat.getWeekDayArray(this.firstDayOfWeek), displayDates: [t], selectedDate: this.initialDate, slideType: "next", displayMonthDay: !0 };
      }, computed: { prevMonth: function () {
          return this.displayDates && c.f(this.displayDates[0], this.minDate) > 0;
        }, nextMonth: function () {
          return this.displayDates && c.f(this.displayDates[0], this.maxDate) < 0;
        } }, methods: { handleMonthChange: function (t) {
          var e = c.g(this.displayDates[0], t);this.changeDislayDate(e), this.$emit("monthChange", e);
        }, handleYearChange: function (t) {
          if (this.selectedDate.getFullYear() !== t) {
            var e = c.h(this.selectedDate);e.setFullYear(t), this.setSelected(e), this.selectMonth(), this.$emit("yearChange", e);
          }
        }, handleSelected: function (t) {
          this.setSelected(t), this.autoOk && this.handleOk();
        }, handleCancel: function () {
          this.$emit("dismiss");
        }, handleOk: function () {
          var t = this.selectedDate,
              e = this.maxDate,
              n = this.minDate;t.getTime() > e.getTime() && (this.selectedDate = new Date(e.getTime())), t.getTime() < n.getTime() && (this.selectedDate = new Date(n.getTime())), this.$emit("accept", this.selectedDate);
        }, setSelected: function (t) {
          this.selectedDate = t, this.changeDislayDate(t);
        }, changeDislayDate: function (t) {
          var e = this.displayDates[0];if (t.getFullYear() !== e.getFullYear() || t.getMonth() !== e.getMonth()) {
            this.slideType = t.getTime() > e.getTime() ? "next" : "prev";var n = c.e(t);n.setDate(1), this.displayDates.push(n), this.displayDates.splice(0, 1);
          }
        }, selectYear: function () {
          this.displayMonthDay = !1;
        }, selectMonth: function () {
          this.displayMonthDay = !0;
        }, addSelectedDays: function (t) {
          this.setSelected(c.i(this.selectedDate, t));
        }, addSelectedMonths: function (t) {
          this.setSelected(c.g(this.selectedDate, t));
        }, addSelectedYears: function (t) {
          this.setSelected(c.d(this.selectedDate, t));
        }, handleKeyDown: function (t) {
          switch (p()(t)) {case "up":
              t.altKey && t.shiftKey ? this.addSelectedYears(-1) : t.shiftKey ? this.addSelectedMonths(-1) : this.addSelectedDays(-7);break;case "down":
              t.altKey && t.shiftKey ? this.addSelectedYears(1) : t.shiftKey ? this.addSelectedMonths(1) : this.addSelectedDays(7);break;case "right":
              t.altKey && t.shiftKey ? this.addSelectedYears(1) : t.shiftKey ? this.addSelectedMonths(1) : this.addSelectedDays(1);break;case "left":
              t.altKey && t.shiftKey ? this.addSelectedYears(-1) : t.shiftKey ? this.addSelectedMonths(-1) : this.addSelectedDays(-1);}
        } }, mounted: function () {
        var t = this;this.handleWindowKeyDown = function (e) {
          t.handleKeyDown(e);
        }, "undefined" != typeof window && window.addEventListener("keydown", this.handleWindowKeyDown);
      }, beforeDestory: function () {
        window.removeEventListener("keydown", this.handleWindowKeyDown);
      }, watch: { initialDate: function (t) {
          this.selectedDate = t;
        } }, components: { "date-display": r.a, "calendar-toolbar": o.a, "flat-button": s.a, "calendar-month": u.a, "calendar-year": f.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(424),
        r = n.n(i),
        a = n(26);e.default = { props: { displayDate: { type: Date }, firstDayOfWeek: { type: Number, default: 1 }, maxDate: { type: Date }, minDate: { type: Date }, selectedDate: { type: Date }, shouldDisableDate: { type: Function } }, data: function () {
        return { weeksArray: a.j(this.displayDate || new Date(), this.firstDayOfWeek) };
      }, methods: { equalsDate: function (t) {
          return a.k(t, this.selectedDate);
        }, isDisableDate: function (t) {
          if (null === t) return !1;var e = !1;return this.maxDate && this.minDate && (e = !a.l(t, this.minDate, this.maxDate)), !e && this.shouldDisableDate && (e = this.shouldDisableDate(t)), e;
        }, handleClick: function (t) {
          t && this.$emit("selected", t);
        } }, watch: { displayDate: function (t) {
          return a.j(t || new Date(), this.firstDayOfWeek);
        } }, components: { "day-button": r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(24);e.default = { props: { dateTimeFormat: { type: Object }, displayDates: { type: Array }, nextMonth: { type: Boolean, default: !0 }, prevMonth: { type: Boolean, default: !0 }, slideType: { type: String } }, methods: { prev: function () {
          this.$emit("monthChange", -1);
        }, next: function () {
          this.$emit("monthChange", 1);
        } }, components: { "icon-button": i.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(425),
        r = n.n(i);e.default = { props: { maxDate: { type: Date }, minDate: { type: Date }, selectedDate: { type: Date } }, computed: { years: function t() {
          for (var e = this.minDate.getFullYear(), n = this.maxDate.getFullYear(), t = [], i = e; i <= n; i++) t.push(i);return t;
        } }, methods: { handleClick: function (t) {
          this.$emit("change", t);
        }, scrollToSelectedYear: function (t) {
          var e = this.$refs.container,
              n = e.clientHeight,
              i = t.clientHeight || 32,
              r = t.offsetTop + i / 2 - n / 2;e.scrollTop = r;
        } }, components: { "year-button": r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { props: { dateTimeFormat: { type: Object }, disableYearSelection: { type: Boolean, default: !1 }, monthDaySelected: { type: Boolean, default: !0 }, selectedDate: { type: Date } }, data: function () {
        return { displayDates: [this.selectedDate], slideType: "next" };
      }, computed: { selectedYear: function () {
          return !this.monthDaySelected;
        }, displayClass: function () {
          return { "selected-year": this.selectedYear };
        } }, methods: { replaceSelected: function (t) {
          var e = this.displayDates[0];this.slideType = t.getTime() > e.getTime() ? "next" : "prev", this.displayDates.push(t), this.displayDates.splice(0, 1);
        }, handleSelectYear: function () {
          this.disableYearSelection || this.$emit("selectYear");
        }, handleSelectMonth: function () {
          this.$emit("selectMonth");
        } }, watch: { selectedDate: function (t) {
          this.replaceSelected(t);
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(26),
        r = n(17),
        a = n(423),
        o = n.n(a);e.default = { name: "mu-date-picker", props: { dateTimeFormat: { type: Object, default: function () {
            return i.a;
          } }, autoOk: { type: Boolean, default: !1 }, cancelLabel: { type: String }, okLabel: { type: String }, container: { type: String, default: "dialog", validator: function (t) {
            return t && ["dialog", "inline"].indexOf(t) !== -1;
          } }, disableYearSelection: { type: Boolean }, firstDayOfWeek: { type: Number }, mode: { type: String, default: "portrait", validator: function (t) {
            return t && ["portrait", "landscape"].indexOf(t) !== -1;
          } }, shouldDisableDate: { type: Function }, format: { type: String, default: "YYYY-MM-DD" }, maxDate: { type: [String, Date] }, minDate: { type: [String, Date] }, name: { type: String }, label: { type: String }, labelFloat: { type: Boolean, default: !1 }, labelClass: { type: [String, Array, Object] }, labelFocusClass: { type: [String, Array, Object] }, disabled: { type: Boolean, default: !1 }, hintText: { type: String }, hintTextClass: { type: [String, Array, Object] }, helpText: { type: String }, helpTextClass: { type: [String, Array, Object] }, errorText: { type: String }, errorColor: { type: String }, icon: { type: String }, iconClass: { type: [String, Array, Object] }, inputClass: { type: [String, Array, Object] }, fullWidth: { type: Boolean, default: !1 }, underlineShow: { type: Boolean, default: !0 }, underlineClass: { type: [String, Array, Object] }, underlineFocusClass: { type: [String, Array, Object] }, value: { type: String } }, computed: { maxLimitDate: function () {
          return this.maxDate ? "string" == typeof this.maxDate ? i.b(this.maxDate, this.format) : this.maxDate : void 0;
        }, minLimitDate: function () {
          return this.minDate ? "string" == typeof this.minDate ? i.b(this.minDate, this.format) : this.minDate : void 0;
        } }, data: function () {
        return { inputValue: this.value, dialogDate: null };
      }, methods: { handleClick: function () {
          var t = this;this.disabled || setTimeout(function () {
            t.openDialog();
          }, 0);
        }, handleFocus: function (t) {
          t.target.blur(), this.$emit("focus", t);
        }, openDialog: function () {
          this.disabled || (this.dialogDate = this.inputValue ? i.b(this.inputValue, this.format) : new Date(), this.$refs.dialog.open = !0);
        }, handleAccept: function (t) {
          var e = i.c(t, this.format);if (this.inputValue === e) return void this.$emit("change", e);this.inputValue = e, this.$emit("change", e);
        }, dismiss: function () {
          this.$emit("dismiss");
        }, handleMonthChange: function (t) {
          this.$emit("monthChange", t);
        }, handleYearChange: function (t) {
          this.$emit("yearChange", t);
        } }, watch: { value: function (t) {
          this.inputValue = t;
        }, inputValue: function (t) {
          this.$emit("input", t);
        } }, components: { "text-field": r.a, "date-picker-dialog": o.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(26),
        r = n(11),
        a = n(39),
        o = n(417),
        s = n.n(o);e.default = { props: { dateTimeFormat: { type: Object, default: i.a }, autoOk: { type: Boolean }, cancelLabel: { type: String }, okLabel: { type: String }, container: { type: String, default: "dialog", validator: function (t) {
            return t && ["dialog", "inline"].indexOf(t) !== -1;
          } }, disableYearSelection: { type: Boolean }, firstDayOfWeek: { type: Number }, initialDate: { type: Date, default: function () {
            return new Date();
          } }, maxDate: { type: Date }, minDate: { type: Date }, mode: { type: String, default: "portrait", validator: function (t) {
            return t && ["portrait", "landscape"].indexOf(t) !== -1;
          } }, shouldDisableDate: { type: Function } }, data: function () {
        return { open: !1, showCalendar: !1, trigger: null };
      }, mounted: function () {
        this.trigger = this.$el;
      }, methods: { handleAccept: function (t) {
          this.$emit("accept", t), this.open = !1;
        }, handleDismiss: function () {
          this.dismiss();
        }, handleClose: function (t) {
          this.dismiss();
        }, dismiss: function () {
          this.open = !1, this.$emit("dismiss");
        }, handleMonthChange: function (t) {
          this.$emit("monthChange", t);
        }, handleYearChange: function (t) {
          this.$emit("yearChange", t);
        }, hideCanlendar: function () {
          this.showCalendar = !1;
        } }, watch: { open: function (t) {
          t && (this.showCalendar = !0);
        } }, render: function (t) {
        var e = this.showCalendar ? t(s.a, { props: { autoOk: this.autoOk, dateTimeFormat: this.dateTimeFormat, okLabel: this.okLabel, cancelLabel: this.cancelLabel, disableYearSelection: this.disableYearSelection, shouldDisableDate: this.shouldDisableDate, firstDayOfWeek: this.firstDayOfWeek, initialDate: this.initialDate, maxDate: this.maxDate, minDate: this.minDate, mode: this.mode }, on: { accept: this.handleAccept, dismiss: this.handleDismiss, monthChange: this.handleMonthChange, yearChange: this.handleYearChange } }) : "";return t("div", { style: {} }, ["dialog" === this.container ? t(a.a, { props: { open: this.open, dialogClass: ["mu-date-picker-dialog", this.mode] }, on: { close: this.handleClose, hide: this.hideCanlendar } }, [e]) : t(r.a, { props: { trigger: this.trigger, overlay: !1, open: this.open }, on: { close: this.handleClose, hide: this.hideCanlendar } }, [e])]);
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { props: { selected: { type: Boolean, default: !1 }, date: { type: Date }, disabled: { type: Boolean, default: !1 } }, data: function () {
        return { hover: !1 };
      }, computed: { isNow: function () {
          var t = new Date();return this.date && this.date.getYear() === t.getYear() && this.date.getMonth() === t.getMonth() && this.date.getDate() === t.getDate();
        }, dayButtonClass: function () {
          return { selected: this.selected, hover: this.hover, "mu-day-button": !0, disabled: this.disabled, now: this.isNow };
        } }, methods: { handleHover: function () {
          n.i(i.g)() && !this.disabled && (this.hover = !0);
        }, handleHoverExit: function () {
          this.hover = !1;
        }, handleClick: function (t) {
          this.$emit("click", t);
        } }, render: function (t) {
        return this.date ? t("button", { class: this.dayButtonClass, on: { mouseenter: this.handleHover, mouseleave: this.handleHoverExit, click: this.handleClick }, domProps: { disabled: this.disabled } }, [t("div", { class: "mu-day-button-bg" }), t("span", { class: "mu-day-button-text", domProps: { innerHTML: this.date.getDate() } })]) : t("span", { class: "mu-day-empty" });
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { props: { year: { type: [String, Number] }, selected: { type: Boolean, default: !1 } }, data: function () {
        return { hover: !1 };
      }, mounted: function () {
        this.selected && this.$parent.scrollToSelectedYear(this.$el);
      }, methods: { handleHover: function () {
          n.i(i.g)() && (this.hover = !0);
        }, handleHoverExit: function () {
          this.hover = !1;
        }, handleClick: function (t) {
          this.$emit("click", t);
        } }, watch: { selected: function (t) {
          t && this.$parent.scrollToSelectedYear(this.$el);
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(27),
        r = n(43),
        a = n(1);e.default = { mixins: [i.a], name: "mu-dialog", props: { dialogClass: { type: [String, Array, Object] }, title: { type: String }, titleClass: { type: [String, Array, Object] }, bodyClass: { type: [String, Array, Object] }, actionsContainerClass: { type: [String, Array, Object] }, scrollable: { type: Boolean, default: !1 } }, computed: { bodyStyle: function () {
          return { "overflow-x": "hidden", "overflow-y": this.scrollable ? "auto" : "hidden", "-webkit-overflow-scrolling": "touch" };
        }, showTitle: function () {
          return this.title || this.$slots && this.$slots.title && this.$slots.title.length > 0;
        }, showFooter: function () {
          return this.$slots && this.$slots.actions && this.$slots.actions.length > 0;
        }, headerClass: function () {
          var t = this.scrollable,
              e = [];return t && e.push("scrollable"), e.concat(n.i(a.f)(this.titleClass));
        }, footerClass: function () {
          var t = this.scrollable,
              e = [];return t && e.push("scrollable"), e.concat(n.i(a.f)(this.actionsContainerClass));
        } }, mounted: function () {
        this.setMaxDialogContentHeight();
      }, updated: function () {
        var t = this;this.$nextTick(function () {
          t.setMaxDialogContentHeight();
        });
      }, methods: { handleWrapperClick: function (t) {
          this.$refs.popup === t.target && r.a.handleOverlayClick();
        }, setMaxDialogContentHeight: function () {
          var t = this.$refs.dialog;if (t) {
            if (!this.scrollable) return void (t.style.maxHeight = "");var e = window.innerHeight - 128,
                n = this.$refs,
                i = n.footer,
                r = n.title,
                a = n.elBody;if (i && (e -= i.offsetHeight), r && (e -= r.offsetHeight), a) {
              var o = e;i && (o -= i.offsetHeight), r && (o -= r.offsetHeight), a.style.maxHeight = o + "px";
            }t.style.maxHeight = e + "px";
          }
        }, show: function () {
          this.$emit("show");
        }, hide: function () {
          this.$emit("hide");
        } }, watch: { open: function (t) {
          var e = this;t && this.$nextTick(function () {
            e.setMaxDialogContentHeight();
          });
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-divider", props: { inset: { type: Boolean, default: !1 }, shallowInset: { type: Boolean, default: !1 } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(66),
        r = n(43),
        a = n(28),
        o = n(1),
        s = ["msTransitionEnd", "mozTransitionEnd", "oTransitionEnd", "webkitTransitionEnd", "transitionend"];e.default = { name: "mu-drawer", props: { right: { type: Boolean, default: !1 }, open: { type: Boolean, default: !1 }, docked: { type: Boolean, default: !0 }, width: { type: [Number, String] }, zDepth: { type: Number, default: 2 } }, data: function () {
        return { overlayZIndex: n.i(a.a)(), zIndex: n.i(a.a)() };
      }, computed: { drawerStyle: function () {
          return { width: n.i(o.e)(this.width), "z-index": this.docked ? "" : this.zIndex };
        }, overlay: function () {
          return !this.docked;
        } }, methods: { overlayClick: function () {
          this.$emit("close", "overlay");
        }, bindTransition: function () {
          var t = this;this.handleTransition = function (e) {
            "transform" === e.propertyName && t.$emit(t.open ? "show" : "hide");
          }, s.forEach(function (e) {
            t.$el.addEventListener(e, t.handleTransition);
          });
        }, unBindTransition: function () {
          var t = this;this.handleTransition && s.forEach(function (e) {
            t.$el.removeEventListener(e, t.handleTransition);
          });
        }, resetZIndex: function () {
          this.overlayZIndex = n.i(a.a)(), this.zIndex = n.i(a.a)();
        } }, watch: { open: function (t) {
          t && !this.docked ? r.a.open(this) : r.a.close(this);
        }, docked: function (t, e) {
          t && !e && r.a.close(this);
        } }, mounted: function () {
        this.open && !this.docked && r.a.open(this), this.bindTransition();
      }, beforeDestroy: function () {
        r.a.close(this), this.unBindTransition();
      }, components: { paper: i.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(11),
        r = n(25),
        a = n(1),
        o = n(70);e.default = { name: "mu-dropDown-menu", mixins: [o.a], props: { value: {}, maxHeight: { type: Number }, autoWidth: { type: Boolean, default: !1 }, multiple: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 }, labelClass: { type: [String, Array, Object] }, menuClass: { type: [String, Array, Object] }, menuListClass: { type: [String, Array, Object] }, underlineClass: { type: [String, Array, Object] }, iconClass: { type: [String, Array, Object] }, openImmediately: { type: Boolean, default: !1 }, anchorOrigin: { type: Object, default: function () {
            return { vertical: "top", horizontal: "left" };
          } }, anchorEl: { type: Object }, scroller: {}, separator: { type: String, default: "," } }, data: function () {
        return { openMenu: !1, trigger: null, menuWidth: null, label: "" };
      }, mounted: function () {
        this.trigger = this.anchorEl || this.$el, this.openMenu = this.openImmediately, this.label = this.getText(), this.setMenuWidth();
      }, methods: { handleClose: function () {
          this.$emit("close"), this.openMenu = !1;
        }, handleOpen: function () {
          this.$emit("open"), this.openMenu = !0;
        }, itemClick: function () {
          this.multiple || this.handleClose();
        }, change: function (t) {
          this.$emit("change", t);
        }, setMenuWidth: function () {
          this.$el && (this.menuWidth = this.autoWidth ? "" : this.$el.offsetWidth);
        }, onResize: function () {
          this.setMenuWidth();
        }, getText: function () {
          var t = this;if (!this.$slots || !this.$slots.default || 0 === this.$slots.length || n.i(a.h)(this.value)) return "";var e = [];return this.$slots.default.forEach(function (i) {
            if (i.componentOptions && i.componentOptions.propsData && !n.i(a.h)(i.componentOptions.propsData.value)) {
              var r = i.componentOptions.propsData,
                  o = r.value,
                  s = r.title;return o === t.value || t.multiple && t.value.length && t.value.indexOf(o) !== -1 ? (e.push(s), !1) : void 0;
            }
          }), e.join(this.separator);
        } }, updated: function () {
        this.setMenuWidth();
      }, watch: { anchorEl: function (t) {
          t && (this.trigger = t);
        }, value: function () {
          this.label = this.getText();
        } }, components: { popover: i.a, "mu-menu": r.menu } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5),
        r = n(9),
        a = n(2),
        o = n(1);e.default = { name: "mu-flat-button", mixins: [r.a], props: { icon: { type: String }, iconClass: { type: [String, Array, Object] }, type: { type: String }, label: { type: String }, labelPosition: { type: String, default: "after" }, labelClass: { type: [String, Array, Object], default: "" }, primary: { type: Boolean, default: !1 }, secondary: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 }, keyboardFocused: { type: Boolean, default: !1 }, href: { type: String, default: "" }, target: { type: String }, backgroundColor: { type: String, default: "" }, color: { type: String, default: "" }, hoverColor: { type: String, default: "" }, rippleColor: { type: String }, rippleOpacity: { type: Number } }, methods: { handleClick: function (t) {
          this.$emit("click", t);
        }, handleKeyboardFocus: function (t) {
          this.$emit("keyboardFocus", t), this.$emit("keyboard-focus", t);
        }, handleHover: function (t) {
          this.$emit("hover", t);
        }, handleHoverExit: function (t) {
          this.$emit("hoverExit", t), this.$emit("hover-exit", t);
        } }, computed: { buttonStyle: function () {
          return { "background-color": this.hover ? n.i(o.d)(this.hoverColor) : n.i(o.d)(this.backgroundColor), color: n.i(o.d)(this.color) };
        }, buttonClass: function () {
          return { "mu-flat-button-primary": this.primary, "mu-flat-button-secondary": this.secondary, "label-before": "before" === this.labelPosition, "no-label": !this.label };
        } }, components: { "abstract-button": i.a, icon: a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-flexbox", props: { gutter: { type: Number, default: 8 }, orient: { type: String, default: "horizontal" }, justify: String, align: String, wrap: String }, computed: { styles: function () {
          return { "justify-content": this.justify, "align-items": this.align, "flex-wrap": this.wrap };
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-flexbox-item", props: { order: { type: [Number, String], default: 0 }, grow: { type: [Number, String], default: 1 }, shrink: { type: [Number, String], default: 1 }, basis: { type: [Number, String], default: "auto" } }, computed: { itemStyle: function () {
          var t = {};return t["horizontal" === this.$parent.orient ? "marginLeft" : "marginTop"] = this.$parent.gutter + "px", t.flex = this.grow + " " + this.shrink + " " + this.basis, t.order = this.order, t;
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5),
        r = n(9),
        a = n(2),
        o = n(1);e.default = { name: "mu-float-button", mixins: [r.a], props: { icon: { type: String }, iconClass: { type: [String, Array, Object], default: "" }, type: { type: String }, href: { type: String, default: "" }, target: { type: String }, disabled: { type: Boolean, default: !1 }, secondary: { type: Boolean, default: !1 }, mini: { type: Boolean, default: !1 }, backgroundColor: { type: String, default: "" } }, computed: { buttonClass: function () {
          var t = [];return this.secondary && t.push("mu-float-button-secondary"), this.mini && t.push("mu-float-button-mini"), t.join(" ");
        }, buttonStyle: function () {
          return { "background-color": n.i(o.d)(this.backgroundColor) };
        } }, methods: { handleClick: function (t) {
          this.$emit("click", t);
        }, handleKeyboardFocus: function (t) {
          this.$emit("keyboardFocus", t), this.$emit("keyboard-focus", t);
        }, handleHover: function (t) {
          this.$emit("hover", t);
        }, handleHoverExit: function (t) {
          this.$emit("hoverExit", t), this.$emit("hover-exit", t);
        } }, components: { "abstract-button": i.a, icon: a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-col", props: { width: { type: String, default: "100" }, tablet: { type: String, default: "" }, desktop: { type: String, default: "" } }, computed: { classObj: function t() {
          var e = "col-" + this.width,
              t = {};if (t[e] = !0, this.tablet) {
            t["tablet-" + this.tablet] = !0;
          }if (this.desktop) {
            t["desktop-" + this.desktop] = !0;
          }return t;
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-row", props: { gutter: { type: Boolean, default: !1 } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-grid-list", props: { cellHeight: { type: Number, default: 180 }, cols: { type: Number, default: 2 }, padding: { type: Number, default: 4 } }, computed: { gridListStyle: function () {
          return { margin: -this.padding / this.cols + "px" };
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-grid-tile", props: { actionPosition: { type: String, default: "right", validator: function (t) {
            return ["left", "right"].indexOf(t) !== -1;
          } }, cols: { type: Number, default: 1 }, rows: { type: Number, default: 1 }, title: { type: String }, subTitle: { type: String }, titlePosition: { type: String, default: "bottom", validator: function (t) {
            return ["top", "bottom"].indexOf(t) !== -1;
          } }, titleBarClass: { type: [String, Array, Object] } }, computed: { tileClass: function () {
          var t = [];return "top" === this.titlePosition && t.push("top"), "left" === this.actionPosition && t.push("action-left"), this.$slots && this.$slots.title && this.$slots.subTitle && this.$slots.title.length > 0 && this.$slots.subTitle.length > 0 && t.push("multiline"), t;
        }, style: function () {
          return { width: this.cols / this.$parent.cols * 100 + "%", padding: this.$parent.padding / 2 + "px", height: this.$parent.cellHeight * this.rows + "px" };
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { name: "mu-icon", props: { value: { type: String }, size: { type: Number }, color: { type: String, default: "" } }, computed: { iconStyle: function () {
          return { "font-size": this.size + "px", width: this.size + "px", height: this.size + "px", color: n.i(i.d)(this.color) };
        } }, methods: { handleClick: function (t) {
          this.$emit("click", t);
        } }, render: function (t) {
        var e = this.value,
            n = this.iconStyle,
            i = this.handleClick;if (!e) return null;var r = 0 !== e.indexOf(":"),
            a = r ? e : "";return t("i", { class: ["mu-icon", r ? "material-icons" : e.substring(1)], style: n, on: { click: i } }, a);
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5),
        r = n(9),
        a = n(2),
        o = n(40);e.default = { name: "mu-icon-button", mixins: [r.a], props: { icon: { type: String }, iconClass: { type: [String, Array, Object], default: "" }, type: { type: String }, href: { type: String, default: "" }, target: { type: String }, disabled: { type: Boolean, default: !1 }, keyboardFocused: { type: Boolean, default: !1 }, tooltip: { type: String }, tooltipPosition: { type: String, default: "bottom-center" }, touch: { type: Boolean, default: !1 } }, computed: { verticalPosition: function () {
          return this.tooltipPosition.split("-")[0];
        }, horizontalPosition: function () {
          return this.tooltipPosition.split("-")[1];
        } }, data: function () {
        return { tooltipShown: !1, tooltipTrigger: null };
      }, methods: { handleClick: function (t) {
          this.$emit("click", t);
        }, handleHover: function (t) {
          this.tooltipShown = !0, this.$emit("hover", t);
        }, handleHoverExit: function (t) {
          this.tooltipShown = !1, this.$emit("hoverExit", t), this.$emit("hover-exit", t);
        }, handleKeyboardFocus: function (t) {
          this.$emit("keyboardFocus", t), this.$emit("keyboard-focus", t);
        } }, mounted: function () {
        this.tooltipTrigger = this.$el;
      }, components: { "abstract-button": i.a, icon: a.a, tooltip: o.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(24),
        r = n(11),
        a = n(25);e.default = { name: "mu-icon-menu", props: { icon: { type: String, required: !0 }, iconClass: { type: [String, Array, Object] }, menuClass: { type: [String, Array, Object] }, menuListClass: { type: [String, Array, Object] }, value: {}, multiple: { type: Boolean, default: !1 }, desktop: { type: Boolean, default: !1 }, open: { type: Boolean, default: !1 }, maxHeight: { type: Number }, anchorOrigin: { type: Object, default: function () {
            return { vertical: "top", horizontal: "left" };
          } }, targetOrigin: { type: Object, default: function () {
            return { vertical: "top", horizontal: "left" };
          } }, scroller: {}, itemClickClose: { type: Boolean, default: !0 }, tooltip: { type: String }, tooltipPosition: { type: String, default: "bottom-center" } }, data: function () {
        return { openMenu: this.open, trigger: null };
      }, methods: { handleOpen: function () {
          this.openMenu = !0, this.$emit("open");
        }, handleClose: function () {
          this.openMenu = !1, this.$emit("close");
        }, change: function (t) {
          this.$emit("change", t);
        }, itemClick: function (t) {
          this.itemClickClose && this.handleClose(), this.$emit("itemClick", t), this.$emit("item-click", t);
        } }, mounted: function () {
        this.trigger = this.$el;
      }, watch: { open: function (t, e) {
          t !== e && (this.openMenu = t);
        } }, components: { "icon-button": i.a, popover: r.a, "mu-menu": a.menu } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(62),
        r = n.n(i),
        a = n(71);e.default = { name: "mu-infinite-scroll", mixins: [a.a], props: { loading: { type: Boolean, default: !1 }, loadingText: { type: String, default: "正在加载。。。" }, isLoaded: { type: Boolean, default: !1 } }, methods: { onScroll: function () {
          if (!this.loading && !this.isLoaded) {
            var t = this.scroller,
                e = t === window,
                n = e ? t.scrollY : t.scrollTop;(e ? document.documentElement.scrollHeight || document.body.scrollHeight : t.scrollHeight) - n - 5 <= (e ? window.innerHeight : t.offsetHeight) && this.$emit("load");
          }
        } }, components: { circular: r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { props: { mergeStyle: { type: Object, default: function () {
            return {};
          } }, color: { type: String, default: "" }, opacity: { type: Number } }, computed: { styles: function () {
          return n.i(i.b)({}, { color: this.color, opacity: this.opacity }, this.mergeStyle);
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { name: "circle", props: { size: { type: Number, default: 24 }, color: { type: String, default: "" }, borderWidth: { type: Number, default: 3 }, secondary: { type: Boolean, default: !1 } }, computed: { spinnerStyle: function () {
          return { "border-color": n.i(i.d)(this.color) };
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { methods: { beforeEnter: function (t) {
          t.dataset.oldPaddingTop = t.style.paddingTop, t.dataset.oldPaddingBottom = t.style.paddingBottom, t.style.height = "0";
        }, enter: function (t) {
          t.dataset.oldOverflow = t.style.overflow, t.style.display = "block", 0 !== t.scrollHeight ? (t.style.height = t.scrollHeight + "px", t.style.paddingTop = t.dataset.oldPaddingTop, t.style.paddingBottom = t.dataset.oldPaddingBottom) : (t.style.height = "", t.style.paddingTop = t.dataset.oldPaddingTop, t.style.paddingBottom = t.dataset.oldPaddingBottom), t.style.overflow = "hidden";
        }, afterEnter: function (t) {
          t.style.display = "", t.style.height = "", t.style.overflow = t.dataset.oldOverflow, t.style.paddingTop = t.dataset.oldPaddingTop, t.style.paddingBottom = t.dataset.oldPaddingBottom;
        }, beforeLeave: function (t) {
          t.dataset.oldPaddingTop = t.style.paddingTop, t.dataset.oldPaddingBottom = t.style.paddingBottom, t.dataset.oldOverflow = t.style.overflow, t.style.display = "block", 0 !== t.scrollHeight && (t.style.height = t.scrollHeight + "px"), t.style.overflow = "hidden";
        }, leave: function (t) {
          0 !== t.scrollHeight && setTimeout(function () {
            t.style.height = 0, t.style.paddingTop = 0, t.style.paddingBottom = 0;
          });
        }, afterLeave: function (t) {
          t.style.display = "none", t.style.height = "", t.style.overflow = t.dataset.oldOverflow, t.style.paddingTop = t.dataset.oldPaddingTop, t.style.paddingBottom = t.dataset.oldPaddingBottom;
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { props: { color: { type: String, default: "" }, opacity: { type: Number } }, computed: { style: function () {
          return { color: this.color, opacity: this.opacity };
        } }, methods: { setRippleSize: function () {
          var t = this.$refs.innerCircle,
              e = t.offsetHeight,
              n = t.offsetWidth,
              i = Math.max(e, n),
              r = 0;t.style.top.indexOf("px", t.style.top.length - 2) !== -1 && (r = parseInt(t.style.top)), t.style.height = i + "px", t.style.top = e / 2 - i / 2 + r + "px";
        } }, mounted: function () {
        this.setRippleSize();
      }, updated: function () {
        this.setRippleSize();
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-overlay", props: { show: { type: Boolean, default: !1 }, fixed: { type: Boolean, default: !1 }, onClick: { type: Function }, opacity: { type: Number, default: .4 }, color: { type: String, default: "#000" }, zIndex: { type: Number } }, computed: { overlayStyle: function () {
          return { opacity: this.opacity, "background-color": this.color, position: this.fixed ? "fixed" : "", "z-index": this.zIndex };
        } }, methods: { prevent: function (t) {
          t.preventDefault(), t.stopPropagation();
        }, handleClick: function () {
          this.onClick && this.onClick();
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(442),
        r = n.n(i),
        a = n(44);e.default = { props: { centerRipple: { type: Boolean, default: !0 }, rippleWrapperClass: {}, color: { type: String, default: "" }, opacity: { type: Number } }, data: function () {
        return { nextKey: 0, ripples: [] };
      }, mounted: function () {
        this.ignoreNextMouseDown = !1;
      }, methods: { start: function (t, e) {
          if (this.ignoreNextMouseDown && !e) return void (this.ignoreNextMouseDown = !1);this.ripples.push({ key: this.nextKey++, color: this.color, opacity: this.opacity, style: this.centerRipple ? {} : this.getRippleStyle(t) }), this.ignoreNextMouseDown = e;
        }, end: function () {
          0 !== this.ripples.length && (this.ripples.splice(0, 1), this.stopListeningForScrollAbort());
        }, stopListeningForScrollAbort: function () {
          this.handleMove || (this.handleMove = this.handleTouchMove.bind(this)), document.body.removeEventListener("touchmove", this.handleMove, !1);
        }, startListeningForScrollAbort: function (t) {
          this.firstTouchY = t.touches[0].clientY, this.firstTouchX = t.touches[0].clientX, document.body.addEventListener("touchmove", this.handleMove, !1);
        }, handleMouseDown: function (t) {
          0 === t.button && this.start(t, !1);
        }, handleTouchStart: function (t) {
          t.touches && (this.startListeningForScrollAbort(t), this.startTime = Date.now()), this.start(t.touches[0], !0);
        }, handleTouchMove: function (t) {
          var e = Math.abs(t.touches[0].clientY - this.firstTouchY),
              n = Math.abs(t.touches[0].clientX - this.firstTouchX);(e > 6 || n > 6) && this.end();
        }, getRippleStyle: function (t) {
          var e = this.$refs.holder,
              n = e.offsetHeight,
              i = e.offsetWidth,
              r = a.a(e),
              o = t.touches && t.touches.length,
              s = o ? t.touches[0].pageX : t.pageX,
              l = o ? t.touches[0].pageY : t.pageY,
              u = s - r.left,
              c = l - r.top,
              d = this.calcDiag(u, c),
              f = this.calcDiag(i - u, c),
              h = this.calcDiag(i - u, n - c),
              p = this.calcDiag(u, n - c),
              m = Math.max(d, f, h, p),
              v = 2 * m;return { directionInvariant: !0, height: v + "px", width: v + "px", top: c - m + "px", left: u - m + "px" };
        }, calcDiag: function (t, e) {
          return Math.sqrt(t * t + e * e);
        } }, components: { "circle-ripple": r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { name: "mu-linear-progress", props: { max: { type: Number, default: 100 }, min: { type: Number, default: 0 }, mode: { type: String, default: "indeterminate", validator: function (t) {
            return ["indeterminate", "determinate"].indexOf(t) !== -1;
          } }, value: { type: Number, default: 0 }, color: { type: String }, size: { type: Number } }, computed: { percent: function () {
          return (this.value - this.min) / (this.max - this.min) * 100;
        }, linearStyle: function () {
          var t = this.size,
              e = this.color,
              r = this.mode,
              a = this.percent;return { height: t + "px", "background-color": n.i(i.d)(e), "border-radius": (t ? t / 2 : "") + "px", width: "determinate" === r ? a + "%" : "" };
        }, linearClass: function () {
          return "mu-linear-progress-" + this.mode;
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-list", props: { nestedLevel: { type: Number, default: 0 }, value: {} }, methods: { handleChange: function (t) {
          this.$emit("change", t);
        }, handleItemClick: function (t) {
          this.$emit("itemClick", t), this.$emit("item-click", t);
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5),
        r = n(9),
        a = n(24),
        o = n(91),
        s = n.n(o),
        l = n(89),
        u = n.n(l),
        c = n(1);e.default = { name: "mu-list-item", mixins: [r.a], props: { href: { type: String }, target: { type: String }, title: { type: String, default: "" }, titleClass: { type: [String, Object, Array] }, afterText: { type: String, default: "" }, afterTextClass: { type: [String, Object, Array] }, describeText: { type: String, default: "" }, describeTextClass: { type: [String, Object, Array] }, describeLine: { type: Number, default: 2 }, inset: { type: Boolean, default: !1 }, nestedListClass: { type: [String, Object, Array] }, open: { type: Boolean, default: !0 }, toggleNested: { type: Boolean, default: !1 }, toggleIconClass: { type: [String, Object, Array] }, disabled: { type: Boolean, default: !1 }, disableRipple: { type: Boolean, default: !1 }, value: {} }, data: function () {
        return { nestedOpen: this.open };
      }, computed: { hasAvatar: function () {
          return this.$slots && (this.$slots.leftAvatar && this.$slots.leftAvatar.length > 0 || this.$slots.rightAvatar && this.$slots.rightAvatar.length > 0);
        }, nestedLevel: function () {
          return this.$parent.nestedLevel + 1;
        }, showLeft: function () {
          return this.$slots && (this.$slots.left && this.$slots.left.length > 0 || this.$slots.leftAvatar && this.$slots.leftAvatar.length > 0);
        }, showRight: function () {
          return this.toggleNested || this.$slots && (this.$slots.right && this.$slots.right.length > 0 || this.$slots.rightAvatar && this.$slots.rightAvatar.length > 0);
        }, showTitleRow: function () {
          return this.title || this.$slots && this.$slots.title && this.$slots.title.length > 0 || this.afterText || this.$slots && this.$slots.after && this.$slots.after.length > 0;
        }, showDescribe: function () {
          return this.describeText || this.$slots && this.$slots.describe && this.$slots.describe.length > 0;
        }, itemClass: function () {
          var t = ["mu-item"];return (this.showLeft || this.inset) && t.push("show-left"), this.showRight && t.push("show-right"), this.hasAvatar && t.push("has-avatar"), this.selected && t.push("selected"), t.join(" ");
        }, itemStyle: function () {
          return { "margin-left": 18 * (this.nestedLevel - 1) + "px" };
        }, textStyle: function () {
          return { "max-height": 18 * this.describeLine + "px", "-webkit-line-clamp": this.describeLine };
        }, showNested: function () {
          return this.nestedOpen && this.$slots && this.$slots.nested && this.$slots.nested.length > 0;
        }, selected: function () {
          return n.i(c.c)(this.$parent.value) && n.i(c.c)(this.value) && this.$parent.value === this.value;
        }, nestedSelectValue: function () {
          return this.$parent.value;
        } }, methods: { handleToggleNested: function () {
          this.nestedOpen = !this.nestedOpen, this.$emit("toggleNested", this.nestedOpen), this.$emit("toggle-nested", this.nestedOpen);
        }, handleClick: function (t) {
          this.$emit("click", t), this.$parent.handleItemClick && this.$parent.handleItemClick(this), n.i(c.c)(this.value) && this.$parent.handleChange(this.value), this.toggleNested && this.handleToggleNested();
        }, handleKeyboardFocus: function (t) {
          this.$emit("keyboardFocus", t), this.$emit("keyboard-focus", t);
        }, handleHover: function (t) {
          this.$emit("hover", t);
        }, handleHoverExit: function (t) {
          this.$emit("hoverExit", t), this.$emit("hover-exit", t);
        }, handleNestedChange: function (t) {
          this.$parent.handleChange(t);
        }, stop: function (t) {
          t.stopPropagation();
        } }, watch: { open: function (t, e) {
          t !== e && (this.nestedOpen = t);
        } }, components: { "abstract-button": i.a, "mu-list": s.a, "icon-button": a.a, "expand-transition": u.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1),
        r = n(21),
        a = n.n(r),
        o = n(42);e.default = { name: "mu-menu", props: { desktop: { type: Boolean, default: !1 }, multiple: { type: Boolean, default: !1 }, autoWidth: { type: Boolean, default: !0 }, width: { type: [String, Number] }, maxHeight: { type: Number }, disableAutoFocus: { type: Boolean, default: !1 }, initiallyKeyboardFocused: { type: Boolean, default: !1 }, listClass: { type: [String, Object, Array] }, popover: { type: Boolean, default: !1 }, value: {} }, data: function () {
        return { focusIndex: -1, isKeyboardFocused: !1 };
      }, computed: { keyWidth: function () {
          return this.desktop ? 64 : 56;
        }, contentWidth: function () {
          return this.autoWidth ? "" : n.i(i.e)(this.width);
        }, menuListClass: function () {
          var t = this.desktop,
              e = this.listClass,
              r = [];return t && r.push("mu-menu-destop"), r.concat(n.i(i.f)(e));
        } }, mounted: function () {
        this.setWidth();var t = this.getSelectedIndex();this.setScollPosition(), this.focusIndex = this.disableAutoFocus ? -1 : t >= 0 ? t : this.initiallyKeyboardFocused ? 0 : -1, this.isKeyboardFocused = this.initiallyKeyboardFocused;
      }, beforeUpdate: function () {
        var t = this.getSelectedIndex();this.focusIndex = this.disableAutoFocus ? -1 : t >= 0 ? t : 0;
      }, updated: function () {
        this.setWidth();
      }, methods: { clickoutside: function () {
          this.setFocusIndex(-1, !1);
        }, setWidth: function () {
          if (this.autoWidth) {
            var t = this.$el,
                e = this.$refs.list,
                n = t.offsetWidth;if (0 !== n) {
              var i = this.keyWidth,
                  r = 1.5 * i,
                  a = n / i,
                  o = void 0;a = a <= 1.5 ? 1.5 : Math.ceil(a), o = a * i, o < r && (o = r), t.style.width = o + "px", e.style.width = o + "px";
            }
          }
        }, handleChange: function (t) {
          this.$emit("change", t);
        }, handleClick: function (t) {
          this.$emit("itemClick", t), this.$emit("item-click", t);
        }, handleKeydown: function (t) {
          switch (a()(t)) {case "down":
              t.stopPropagation(), t.preventDefault(), this.incrementKeyboardFocusIndex();break;case "tab":
              t.stopPropagation(), t.preventDefault(), t.shiftKey ? this.decrementKeyboardFocusIndex() : this.incrementKeyboardFocusIndex();break;case "up":
              t.stopPropagation(), t.preventDefault(), this.decrementKeyboardFocusIndex();}
        }, decrementKeyboardFocusIndex: function () {
          var t = this.focusIndex,
              e = this.getMenuItemCount() - 1;t--, t < 0 && (t = e), this.setFocusIndex(t, !0);
        }, incrementKeyboardFocusIndex: function () {
          var t = this.focusIndex,
              e = this.getMenuItemCount() - 1;t++, t > e && (t = 0), this.setFocusIndex(t, !0);
        }, getMenuItemCount: function () {
          var t = 0;return this.$children.forEach(function (e) {
            e._isMenuItem && !e.disabled && t++;
          }), t;
        }, getSelectedIndex: function () {
          var t = -1,
              e = 0;return this.$children.forEach(function (n) {
            n.active && (t = e), n._isMenuItem && !n.disabled && e++;
          }), t;
        }, setFocusIndex: function (t, e) {
          this.focusIndex = t, this.isKeyboardFocused = e;
        }, setScollPosition: function (t) {
          var e = this.desktop,
              n = null;this.$children.forEach(function (t) {
            t.active && (n = t);
          });var i = e ? 32 : 48;if (n) {
            var r = n.$el.offsetTop,
                a = r - i;a < i && (a = 0), this.$refs.list.scrollTop = a;
          }
        } }, watch: { focusIndex: function (t, e) {
          var n = this;if (t !== e) {
            var i = 0;this.$children.forEach(function (e) {
              if (e._isMenuItem && !e.disabled) {
                var r = i === t,
                    a = "none";r && (a = n.isKeyboardFocused ? "keyboard-focused" : "focused"), e.focusState = a, i++;
              }
            });
          }
        }, popover: function (t) {
          var e = this;t && setTimeout(function () {
            var t = e.getSelectedIndex();e.disableAutoFocus ? e.$el.focus() : e.setFocusIndex(t, !1);
          }, 300);
        } }, directives: { clickoutside: o.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5),
        r = n(9),
        a = n(2),
        o = n(1),
        s = n(11),
        l = n(92),
        u = n.n(l);e.default = { name: "mu-menu-item", mixins: [r.a], props: { href: { type: String }, target: { type: String }, title: { type: String }, titleClass: { type: [String, Object, Array] }, afterText: { type: String }, afterTextClass: { type: [String, Object, Array] }, disabled: { type: Boolean, default: !1 }, disableFocusRipple: { type: Boolean, default: !1 }, inset: { type: Boolean, default: !1 }, leftIcon: { type: String }, leftIconColor: { type: String }, leftIconClass: { type: [String, Object, Array] }, rightIcon: { type: String }, rightIconColor: { type: String }, rightIconClass: { type: [String, Object, Array] }, nestedMenuClass: { type: [String, Object, Array] }, nestedMenuListClass: { type: [String, Object, Array] }, value: {}, nestedMenuValue: {} }, computed: { showAfterText: function () {
          return !this.rightIcon && this.afterText && (!this.$slot || !this.$slot.after || 0 === this.$slot.after.length);
        }, active: function () {
          return n.i(o.c)(this.$parent.value) && n.i(o.c)(this.value) && (this.$parent.value === this.value || this.$parent.multiple && this.$parent.value.indexOf(this.value) !== -1);
        } }, data: function () {
        return this._isMenuItem = !0, { openMenu: !1, trigger: null, focusState: "none" };
      }, mounted: function () {
        this.trigger = this.$el, this.applyFocusState();
      }, methods: { handleClick: function (t) {
          this.$emit("click", t), this.$parent.handleClick(this), this.open(), n.i(o.c)(this.value) && this.$parent.handleChange(this.value);
        }, filterColor: function (t) {
          return n.i(o.d)(t);
        }, open: function () {
          this.openMenu = this.$slots && this.$slots.default && this.$slots.default.length > 0;
        }, close: function () {
          this.openMenu = !1;
        }, handleKeyboardFocus: function (t) {
          this.$emit("keyboardFocus", t), this.$emit("keyboard-focus", t);
        }, handleHover: function (t) {
          this.$emit("hover", t);
        }, handleHoverExit: function (t) {
          this.$emit("hoverExit", t), this.$emit("hover-exit", t);
        }, applyFocusState: function () {
          var t = this.$refs.button;if (t) {
            var e = t.$el;switch (this.focusState) {case "none":
                e.blur();break;case "focused":
                e.focus();break;case "keyboard-focused":
                t.setKeyboardFocus(), e.focus();}
          }
        } }, watch: { focusState: function () {
          this.applyFocusState();
        } }, components: { "abstract-button": i.a, icon: a.a, popover: s.a, "mu-menu": u.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5);e.default = { props: { icon: { type: String }, index: { type: Number }, isCircle: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 }, isActive: { type: Boolean, default: !1 }, identifier: { type: String } }, data: function () {
        return {};
      }, methods: { handleHover: function (t) {
          this.$emit("hover", t);
        }, handleHoverExit: function (t) {
          this.$emit("hoverExit", t), this.$emit("hover-exit", t);
        }, handleClick: function () {
          this.index ? this.$emit("click", this.index) : this.$emit("click", this.identifier);
        } }, components: { "abstract-button": i.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(445),
        r = n.n(i),
        a = n(67),
        o = n(17),
        s = n(93),
        l = n.n(s);e.default = { name: "mu-pagination", props: { total: { type: Number, default: 1 }, current: { type: Number, default: 1 }, defaultPageSize: { type: Number, default: 10 }, pageSize: { type: Number }, showSizeChanger: { type: Boolean, default: !1 }, pageSizeOption: { type: Array, default: function () {
            return [10, 20, 30, 40];
          } }, pageSizeChangerText: { type: String, default: function () {
            return " / 页";
          } } }, data: function () {
        return { leftDisabled: !1, rightDisabled: !1, actualCurrent: this.current, actualPageSize: this.defaultPageSize, totalPageCount: 0, pageList: [], quickJumpPage: "" };
      }, mounted: function () {
        this.iconIsDisabled(this.actualCurrent), this.showSizeChanger ? this.actualPageSize = this.pageSizeOption[0] : this.pageSize && (this.actualPageSize = this.pageSize), this.totalPageCount = Math.ceil(this.total / this.actualPageSize), this.pageList = this.calcPageList(this.actualCurrent);
      }, methods: { handleClick: function (t) {
          if ("number" == typeof t) this.actualCurrent = t;else switch (t) {case "singleBack":
              this.actualCurrent = Math.max(1, this.actualCurrent - 1);break;case "backs":
              this.actualCurrent = Math.max(1, this.actualCurrent - 5);break;case "forwards":
              this.actualCurrent = Math.min(this.totalPageCount, this.actualCurrent + 5);break;case "singleForward":
              this.actualCurrent = Math.min(this.totalPageCount, this.actualCurrent + 1);}
        }, iconIsDisabled: function (t) {
          this.leftDisabled = 1 === t, this.rightDisabled = t === this.totalPageCount;
        }, calcPageList: function (t) {
          var e = [];if (this.totalPageCount > 5) {
            var n = Math.max(2, t - 2),
                i = Math.min(t + 2, this.totalPageCount - 1);t - 1 < 2 && (i = 4), this.totalPageCount - t < 2 && (n = this.totalPageCount - 3);for (var r = n; r <= i; r++) e.push(r);
          } else for (var a = 2; a < this.totalPageCount; a++) e.push(a);return e;
        }, pageSizeAndTotalChange: function (t) {
          this.iconIsDisabled(t), this.pageList = this.calcPageList(t);
        } }, components: { "page-item": r.a, "select-field": a.a, "text-field": o.a, "menu-item": l.a }, watch: { actualCurrent: function (t) {
          0 !== t && (this.pageSizeAndTotalChange(t), this.$emit("pageChange", t), this.$emit("page-change", t));
        }, actualPageSize: function (t, e) {
          var n = e * (this.actualCurrent - 1),
              i = this.actualCurrent;this.actualCurrent = Math.floor(n / t) + 1, this.totalPageCount = Math.ceil(this.total / this.actualPageSize), i === this.actualCurrent && this.pageSizeAndTotalChange(i), this.$emit("pageSizeChange", t), this.$emit("page-size-change", t);
        }, total: function (t) {
          var e = this.actualCurrent;this.actualCurrent = Math.min(this.totalPageCount, this.actualCurrent), this.totalPageCount = Math.ceil(this.total / this.actualPageSize), e === this.actualCurrent && this.pageSizeAndTotalChange(e);
        }, current: function (t) {
          this.actualCurrent = t;
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-paper", props: { circle: { type: Boolean, default: !1 }, rounded: { type: Boolean, default: !0 }, zDepth: { type: Number, default: 1 } }, computed: { paperClass: function () {
          var t = [];return this.circle && t.push("mu-paper-circle"), this.rounded && t.push("mu-paper-round"), t.push("mu-paper-" + this.zDepth), t;
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(99),
        r = n.n(i),
        a = n(73),
        o = n(143),
        s = n(44),
        l = 36;e.default = { props: { divider: { type: Boolean, default: !1 }, content: { type: String, default: "" }, values: { type: Array, default: function () {
            return [];
          } }, value: {}, textAlign: { type: String, default: "" }, width: { type: String, default: "" }, visibleItemCount: { type: Number, default: 5 } }, data: function () {
        return { animate: !1 };
      }, computed: { contentHeight: function () {
          return l * this.visibleItemCount;
        }, valueIndex: function () {
          return this.values.indexOf(this.value);
        }, dragRange: function () {
          var t = this.values,
              e = this.visibleItemCount;return [-l * (t.length - Math.ceil(e / 2)), l * Math.floor(e / 2)];
        } }, mounted: function () {
        this.divider || (this.initEvents(), this.doOnValueChange());
      }, methods: { value2Translate: function (t) {
          var e = this.values,
              n = e.indexOf(t),
              i = Math.floor(this.visibleItemCount / 2);if (n !== -1) return (n - i) * -l;
        }, translate2Value: function (t) {
          t = Math.round(t / l) * l;var e = -(t - Math.floor(this.visibleItemCount / 2) * l) / l;return this.values[e];
        }, doOnValueChange: function () {
          var t = this.value,
              e = this.$refs.wrapper;o.a.translateElement(e, null, this.value2Translate(t));
        }, doOnValuesChange: function () {
          var t = this.$el,
              e = t.querySelectorAll(".mu-picker-item");Array.prototype.forEach.call(e, function (t, e) {
            o.a.translateElement(t, null, l * e);
          });
        }, initEvents: function () {
          var t = this,
              e = this.$refs.wrapper,
              n = new a.a(this.$el),
              i = 0,
              u = void 0,
              c = void 0;n.start(function () {
            i = o.a.getElementTranslate(e).top;
          }).drag(function (t, n) {
            n.preventDefault(), n.stopPropagation();var r = i + t.y;o.a.translateElement(e, 0, r), u = r - c || r, c = r;
          }).end(function (n) {
            var i = o.a.getElementTranslate(e).top,
                a = void 0;n.time < 300 && (a = i + 7 * u);var c = t.dragRange;t.animate = !0, s.b(e, function () {
              t.animate = !1;
            }), r.a.nextTick(function () {
              var n = void 0;n = a ? Math.round(a / l) * l : Math.round(i / l) * l, n = Math.max(Math.min(n, c[1]), c[0]), o.a.translateElement(e, null, n), t.$emit("change", t.translate2Value(n));
            });
          });
        } }, watch: { values: function (t) {
          this.valueIndex === -1 && (this.value = (t || [])[0]);
        }, value: function () {
          this.doOnValueChange();
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(448),
        r = n.n(i);e.default = { name: "mu-picker", props: { visibleItemCount: { type: Number, default: 5 }, values: { type: Array, default: function () {
            return [];
          } }, slots: { type: Array, default: function () {
            return [];
          } } }, methods: { change: function (t, e) {
          this.$emit("change", e[0], t);
        } }, components: { "picker-slot": r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(41),
        r = n.n(i),
        a = n(71),
        o = n(27),
        s = n(70);e.default = { name: "mu-popover", mixins: [a.a, s.a, o.a], props: { overlay: { default: !1 }, overlayOpacity: { default: .01 }, trigger: {}, autoPosition: { type: Boolean, default: !0 }, anchorOrigin: { type: Object, default: function () {
            return { vertical: "bottom", horizontal: "left" };
          } }, targetOrigin: { type: Object, default: function () {
            return { vertical: "top", horizontal: "left" };
          } }, popoverClass: { type: [String, Object, Array] } }, methods: { getAnchorPosition: function (t) {
          var e = t.getBoundingClientRect(),
              n = { top: e.top, left: e.left, width: t.width, height: t.height };return n.right = e.right || n.left + n.width, n.bottom = e.bottom || n.top + n.height, n.middle = n.left + (n.right - n.left) / 2, n.center = n.top + (n.bottom - n.top) / 2, n;
        }, getTargetPosition: function (t) {
          return { top: 0, center: t.offsetHeight / 2, bottom: t.offsetHeight, left: 0, middle: t.offsetWidth / 2, right: t.offsetWidth };
        }, getElInfo: function (t) {
          var e = t.getBoundingClientRect();return { left: e.left, top: e.top, width: t.offsetWidth, height: t.offsetHeight };
        }, setStyle: function () {
          if (this.open) {
            var t = this.targetOrigin,
                e = this.anchorOrigin,
                n = this.$refs.popup,
                i = this.getAnchorPosition(this.trigger),
                r = this.getTargetPosition(n),
                a = { top: i[e.vertical] - r[t.vertical], left: i[e.horizontal] - r[t.horizontal] };if (i.top < 0 || i.top > window.innerHeight || i.left < 0 || i.left > window.innerWidth) return void this.close("overflow");this.autoPosition && (r = this.getTargetPosition(n), a = this.applyAutoPositionIfNeeded(i, r, t, e, a)), n.style.left = Math.max(0, a.left) + "px", n.style.top = Math.max(0, a.top) + "px";
          }
        }, getOverlapMode: function (t, e, n) {
          return [t, e].indexOf(n) >= 0 ? "auto" : t === e ? "inclusive" : "exclusive";
        }, getPositions: function (t, e) {
          var n = r()({}, t),
              i = r()({}, e),
              a = { x: ["left", "right"].filter(function (t) {
              return t !== i.horizontal;
            }), y: ["top", "bottom"].filter(function (t) {
              return t !== i.vertical;
            }) },
              o = { x: this.getOverlapMode(n.horizontal, i.horizontal, "middle"), y: this.getOverlapMode(n.vertical, i.vertical, "center") };return a.x.splice("auto" === o.x ? 0 : 1, 0, "middle"), a.y.splice("auto" === o.y ? 0 : 1, 0, "center"), "auto" !== o.y && (n.vertical = "top" === n.vertical ? "bottom" : "top", "inclusive" === o.y && (i.vertical = i.vertical)), "auto" !== o.x && (n.horizontal = "left" === n.horizontal ? "right" : "left", "inclusive" === o.y && (i.horizontal = i.horizontal)), { positions: a, anchorPos: n };
        }, applyAutoPositionIfNeeded: function (t, e, n, i, r) {
          var a = this.getPositions(i, n),
              o = a.positions,
              s = a.anchorPos;if (r.top < 0 || r.top + e.bottom > window.innerHeight) {
            var l = t[s.vertical] - e[o.y[0]];l + e.bottom <= window.innerHeight ? r.top = Math.max(0, l) : (l = t[s.vertical] - e[o.y[1]]) + e.bottom <= window.innerHeight && (r.top = Math.max(0, l));
          }if (r.left < 0 || r.left + e.right > window.innerWidth) {
            var u = t[s.horizontal] - e[o.x[0]];u + e.right <= window.innerWidth ? r.left = Math.max(0, u) : (u = t[s.horizontal] - e[o.x[1]]) + e.right <= window.innerWidth && (r.left = Math.max(0, u));
          }return r;
        }, close: function (t) {
          this.$emit("close", t);
        }, clickOutSide: function (t) {
          this.close("clickOutSide");
        }, onScroll: function () {
          this.setStyle();
        }, onResize: function () {
          this.setStyle();
        }, show: function () {
          this.$emit("show");
        }, hide: function () {
          this.$emit("hide");
        } }, mounted: function () {
        this.setStyle();
      }, updated: function () {
        var t = this;setTimeout(function () {
          t.setStyle();
        }, 0);
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(27),
        r = n(1);e.default = { name: "mu-popup", mixins: [i.a], props: { popupClass: { type: [String, Object, Array] }, popupTransition: { type: String, default: "" }, position: { type: String, default: "" } }, data: function () {
        return { transition: this.popupTransition };
      }, created: function () {
        this.popupTransition || (this.transition = "popup-slide-" + this.position);
      }, computed: { popupCss: function () {
          var t = this.position,
              e = this.popupClass,
              i = [];return t && i.push("mu-popup-" + t), i.concat(n.i(r.f)(e));
        } }, methods: { show: function () {
          this.$emit("show");
        }, hide: function () {
          this.$emit("hide");
        } }, watch: { popupTransition: function (t, e) {
          t !== e && (this.transition = t);
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(2),
        r = n(38),
        a = n.n(r);e.default = { name: "mu-radio", props: { name: { type: String }, value: { type: String }, nativeValue: { type: String }, label: { type: String, default: "" }, labelLeft: { type: Boolean, default: !1 }, labelClass: { type: [String, Object, Array] }, disabled: { type: Boolean, default: !1 }, uncheckIcon: { type: String, default: "" }, checkedIcon: { type: String, default: "" }, iconClass: { type: [String, Object, Array] } }, data: function () {
        return { inputValue: this.value };
      }, watch: { value: function (t) {
          this.inputValue = t;
        }, inputValue: function (t) {
          this.$emit("input", t);
        } }, methods: { handleClick: function () {}, handleMouseDown: function (t) {
          this.disabled || 0 === t.button && this.$children[0].start(t);
        }, handleMouseUp: function () {
          this.disabled || this.$children[0].end();
        }, handleMouseLeave: function () {
          this.disabled || this.$children[0].end();
        }, handleTouchStart: function (t) {
          this.disabled || this.$children[0].start(t);
        }, handleTouchEnd: function () {
          this.disabled || this.$children[0].end();
        }, handleChange: function () {
          this.$emit("change", this.inputValue);
        } }, components: { icon: i.a, "touch-ripple": a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5),
        r = n(9),
        a = n(1),
        o = n(2);e.default = { name: "mu-raised-button", mixins: [r.a], props: { icon: { type: String }, iconClass: { type: [String, Array, Object] }, label: { type: String }, labelPosition: { type: String, default: "after" }, labelClass: { type: [String, Array, Object], default: "" }, primary: { type: Boolean, default: !1 }, secondary: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 }, keyboardFocused: { type: Boolean, default: !1 }, fullWidth: { type: Boolean, default: !1 }, type: { type: String }, href: { type: String, default: "" }, target: { type: String }, backgroundColor: { type: String, default: "" }, color: { type: String, default: "" }, rippleColor: { type: String }, rippleOpacity: { type: Number } }, data: function () {
        return { focus: !1 };
      }, computed: { buttonStyle: function () {
          return { "background-color": n.i(a.d)(this.backgroundColor), color: n.i(a.d)(this.color) };
        }, inverse: function () {
          return this.primary || this.secondary || this.backgroundColor;
        }, buttonClass: function () {
          return { "mu-raised-button-primary": this.primary, "mu-raised-button-secondary": this.secondary, "label-before": "before" === this.labelPosition, "mu-raised-button-inverse": this.inverse, "mu-raised-button-full": this.fullWidth, focus: this.focus, "no-label": !this.label };
        } }, methods: { handleClick: function (t) {
          this.$emit("click", t);
        }, handleKeyboardFocus: function (t) {
          this.focus = t, this.$emit("keyboardFocus", t), this.$emit("keyboard-focus", t);
        }, handleHover: function (t) {
          this.$emit("hover", t);
        }, handleHoverExit: function (t) {
          this.$emit("hoverExit", t), this.$emit("hover-exit", t);
        } }, components: { "abstract-button": i.a, icon: o.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(73),
        r = n(62),
        a = n.n(r),
        o = n(44),
        s = 130,
        l = -68;e.default = { name: "mu-refresh-control", props: { refreshing: { type: Boolean, default: !1 }, trigger: {} }, data: function () {
        return { y: 0, draging: !1, state: "pending" };
      }, computed: { refreshStyle: function () {
          var t = {};if (!this.refreshing && this.draging) {
            var e = "translate3d(0, " + (this.y + l) + "px, 0) ";t["-webkit-transform"] = t.transform = e;
          }return t;
        }, circularStyle: function () {
          var t = {};if (!this.refreshing && this.draging) {
            var e = this.y / s,
                n = "rotate(" + 360 * e + "deg)",
                i = this.y / Math.abs(l);t["-webkit-transform"] = t.transform = n, t.opacity = i;
          }return t;
        }, refreshClass: function () {
          var t = [];switch (this.state) {case "pending":
              break;case "ready":
              t.push("mu-refresh-control-noshow");break;case "dragStart":
              t.push("mu-refresh-control-hide");break;case "dragAnimate":
              t.push("mu-refresh-control-animate"), t.push("mu-refresh-control-hide");break;case "refreshAnimate":
              t.push("mu-refresh-control-animate"), t.push("mu-refresh-control-noshow");}return this.refreshing && t.push("mu-refresh-control-refreshing"), t;
        } }, mounted: function () {
        this.bindDrag();
      }, beforeDestory: function () {
        this.unbindDrag();
      }, methods: { clearState: function () {
          this.state = "ready", this.draging = !1, this.y = 0;
        }, getScrollEventTarget: function (t) {
          for (var e = t; e && "HTML" !== e.tagName && "BODY" !== e.tagName && 1 === e.nodeType;) {
            var n = document.defaultView.getComputedStyle(e).overflowY;if ("scroll" === n || "auto" === n) return e;e = e.parentNode;
          }return window;
        }, getScrollTop: function (t) {
          return t === window ? Math.max(window.pageYOffset || 0, document.documentElement.scrollTop) : t.scrollTop;
        }, bindDrag: function () {
          var t = this;if (this.trigger) {
            var e = this.drager = new i.a(this.trigger);this.state = "ready", e.start(function () {
              if (!t.refreshing) {
                t.state = "dragStart";0 === t.getScrollTop(t.getScrollEventTarget(t.$el)) && (t.draging = !0);
              }
            }).drag(function (n, i) {
              var r = t.getScrollTop(t.getScrollEventTarget(t.$el));n.y < 5 || t.refreshing || 0 !== r || (0 !== r || t.draging || (t.draging = !0, e.reset(i)), t.draging && n.y > 0 && (i.preventDefault(), i.stopPropagation()), t.y = n.y / 2, t.y < 0 && (t.y = 1), t.y > s && (t.y = s));
            }).end(function (e, n) {
              if (!e.y || e.y < 5) return void t.clearState();var i = t.y + l > 0 && t.draging;t.state = "dragAnimate", i ? (t.draging = !1, t.$emit("refresh")) : (t.y = 0, o.b(t.$el, t.clearState.bind(t)));
            });
          }
        }, unbindDrag: function () {
          this.drager && (this.drager.destory(), this.drager = null);
        } }, watch: { refreshing: function (t) {
          t ? this.state = "refreshAnimate" : o.b(this.$el, this.clearState.bind(this));
        }, trigger: function (t, e) {
          t !== e && (this.unbindDrag(), this.bindDrag());
        } }, components: { circular: a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(17),
        r = n(65),
        a = n(1);e.default = { name: "mu-select-field", props: { name: { type: String }, label: { type: String }, labelFloat: { type: Boolean, default: !1 }, labelClass: { type: [String, Array, Object] }, labelFocusClass: { type: [String, Array, Object] }, disabled: { type: Boolean, default: !1 }, hintText: { type: String }, hintTextClass: { type: [String, Array, Object] }, helpText: { type: String }, helpTextClass: { type: [String, Array, Object] }, errorText: { type: String }, errorColor: { type: String }, icon: { type: String }, iconClass: { type: [String, Array, Object] }, maxHeight: { type: Number }, autoWidth: { type: Boolean, default: !1 }, fullWidth: { type: Boolean, default: !1 }, underlineShow: { type: Boolean, default: !0 }, underlineClass: { type: [String, Array, Object] }, underlineFocusClass: { type: [String, Array, Object] }, dropDownIconClass: { type: [String, Array, Object] }, value: {}, multiple: { type: Boolean, default: !1 }, scroller: {}, separator: { type: String, default: "," } }, data: function () {
        var t = this.value;return n.i(a.h)(t) && (t = ""), !this.multiple || t instanceof Array || (t = []), { anchorEl: null, inputValue: t };
      }, mounted: function () {
        this.anchorEl = this.$children[0].$refs.input;
      }, methods: { handlehange: function (t) {
          if (t !== this.inputValue) {
            if (this.multiple) {
              var e = this.inputValue.indexOf(t);e === -1 ? this.inputValue.push(t) : this.inputValue.splice(e, 1);
            } else this.inputValue = t;this.$emit("change", this.inputValue);
          }
        }, handleOpen: function () {
          this.$refs.textField.handleFocus(), this.$emit("open");
        }, handleClose: function () {
          this.$refs.textField.handleBlur(), this.$emit("close");
        } }, watch: { value: function (t) {
          this.inputValue = t;
        }, inputValue: function (t, e) {
          t !== e && this.$emit("input", t);
        } }, components: { "text-field": i.a, "dropDown-menu": r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(90),
        r = n.n(i),
        a = n(21),
        o = n.n(a);e.default = { name: "mu-slider", props: { name: { type: String }, value: { type: [Number, String], default: 0 }, max: { type: Number, default: 100 }, min: { type: Number, default: 0 }, step: { type: Number, default: .1 }, disabled: { type: Boolean, default: !1 } }, data: function () {
        return { inputValue: this.value, active: !1, hover: !1, focused: !1, dragging: !1 };
      }, computed: { percent: function () {
          var t = (this.inputValue - this.min) / (this.max - this.min) * 100;return t > 100 ? 100 : t < 0 ? 0 : t;
        }, fillStyle: function () {
          return { width: this.percent + "%" };
        }, thumbStyle: function () {
          return { left: this.percent + "%" };
        }, sliderClass: function () {
          return { zero: this.inputValue <= this.min, active: this.active, disabled: this.disabled };
        } }, created: function () {
        this.handleDragMouseMove = this.handleDragMouseMove.bind(this), this.handleMouseEnd = this.handleMouseEnd.bind(this), this.handleTouchMove = this.handleTouchMove.bind(this), this.handleTouchEnd = this.handleTouchEnd.bind(this);
      }, methods: { handleKeydown: function (t) {
          var e = this.min,
              n = this.max,
              i = this.step,
              r = void 0;switch (o()(t)) {case "page down":case "down":
              r = "decrease";break;case "left":
              r = "decrease";break;case "page up":case "up":
              r = "increase";break;case "right":
              r = "increase";break;case "home":
              r = "min";break;case "end":
              r = "max";}if (r) {
            switch (t.preventDefault(), r) {case "decrease":
                this.inputValue -= i;break;case "increase":
                this.inputValue += i;break;case "min":
                this.inputValue = e;break;case "max":
                this.inputValue = n;}this.inputValue = parseFloat(this.inputValue.toFixed(5)), this.inputValue > n ? this.inputValue = n : this.inputValue < e && (this.inputValue = e);
          }
        }, handleMouseDown: function (t) {
          this.disabled || (this.setValue(t), t.preventDefault(), document.addEventListener("mousemove", this.handleDragMouseMove), document.addEventListener("mouseup", this.handleMouseEnd), this.$el.focus(), this.onDragStart(t));
        }, handleMouseUp: function () {
          this.disabled || (this.active = !1);
        }, handleTouchStart: function (t) {
          this.disabled || (this.setValue(t.touches[0]), document.addEventListener("touchmove", this.handleTouchMove), document.addEventListener("touchup", this.handleTouchEnd), document.addEventListener("touchend", this.handleTouchEnd), document.addEventListener("touchcancel", this.handleTouchEnd), t.preventDefault(), this.onDragStart(t));
        }, handleTouchEnd: function (t) {
          this.disabled || (document.removeEventListener("touchmove", this.handleTouchMove), document.removeEventListener("touchup", this.handleTouchEnd), document.removeEventListener("touchend", this.handleTouchEnd), document.removeEventListener("touchcancel", this.handleTouchEnd), this.onDragStop(t));
        }, handleFocus: function () {
          this.disabled || (this.focused = !0);
        }, handleBlur: function () {
          this.disabled || (this.focused = !1);
        }, handleMouseEnter: function () {
          this.disabled || (this.hover = !0);
        }, handleMouseLeave: function () {
          this.disabled || (this.hover = !1);
        }, setValue: function (t) {
          var e = this.$el,
              n = this.max,
              i = this.min,
              r = this.step,
              a = (t.clientX - e.getBoundingClientRect().left) / e.offsetWidth * (n - i);a = Math.round(a / r) * r + i, a = parseFloat(a.toFixed(5)), a > n ? a = n : a < i && (a = i), this.inputValue = a, this.$emit("change", a);
        }, onDragStart: function (t) {
          this.dragging = !0, this.active = !0, this.$emit("dragStart", t), this.$emit("drag-start", t);
        }, onDragUpdate: function (t) {
          var e = this;this.dragRunning || (this.dragRunning = !0, window.requestAnimationFrame(function () {
            e.dragRunning = !1, e.disabled || e.setValue(t);
          }));
        }, onDragStop: function (t) {
          this.dragging = !1, this.active = !1, this.$emit("dragStop", t), this.$emit("drag-stop", t);
        }, handleDragMouseMove: function (t) {
          this.onDragUpdate(t);
        }, handleTouchMove: function (t) {
          this.onDragUpdate(t.touches[0]);
        }, handleMouseEnd: function (t) {
          document.removeEventListener("mousemove", this.handleDragMouseMove), document.removeEventListener("mouseup", this.handleMouseEnd), this.onDragStop(t);
        } }, watch: { value: function (t) {
          this.inputValue = t;
        }, inputValue: function (t) {
          this.$emit("input", t);
        } }, components: { "focus-ripple": r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(23),
        r = n(28),
        a = n(42);e.default = { name: "mu-snackbar", props: { action: { type: String }, actionColor: { type: String }, message: { type: String } }, data: function () {
        return { zIndex: n.i(r.a)() };
      }, methods: { clickOutSide: function () {
          this.$emit("close", "clickOutSide");
        }, handleActionClick: function () {
          this.$emit("actionClick"), this.$emit("action-click");
        } }, components: { "flat-button": i.a }, directives: { clickoutside: a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(74),
        r = n.n(i);e.default = { name: "mu-step", props: { active: { type: Boolean, default: !1 }, completed: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 }, index: { type: Number }, last: { type: Boolean, default: !1 } }, render: function (t) {
        var e = this.active,
            n = this.completed,
            i = this.disabled,
            a = this.index,
            o = this.last,
            s = [];return this.$slots.default && this.$slots.default.length > 0 && this.$slots.default.forEach(function (t) {
          if (t.componentOptions && t.componentOptions.propsData) {
            var l = a + 1;t.componentOptions.propsData = r()({ active: e, completed: n, disabled: i, last: o, num: l }, t.componentOptions.propsData), s.push(t);
          }
        }), t("div", { class: "mu-step" }, s);
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5),
        r = n(94),
        a = n.n(r);e.default = { name: "mu-step-button", props: { active: { type: Boolean }, completed: { type: Boolean }, disabled: { type: Boolean }, num: { type: [String, Number] }, last: { type: Boolean }, childrenInLabel: { type: Boolean, default: !0 } }, methods: { handleClick: function (t) {
          this.$emit("click", t);
        } }, components: { abstractButton: i.a, "step-label": a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = {};
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(89),
        r = n.n(i);e.default = { name: "mu-step-content", props: { active: { type: Boolean }, last: { type: Boolean } }, components: { "expand-transition": r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-step-label", props: { active: { type: Boolean }, completed: { type: Boolean }, disabled: { type: Boolean }, num: { type: [String, Number] } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(460),
        r = n.n(i);e.default = { name: "mu-stepper", props: { activeStep: { type: Number, default: 0 }, linear: { type: Boolean, default: !0 }, orientation: { type: String, default: "horizontal", validator: function (t) {
            return ["horizontal", "vertical"].indexOf(t) !== -1;
          } } }, render: function (t) {
        var e = this.activeStep,
            n = this.linear,
            i = this.orientation,
            a = [];if (this.$slots.default && this.$slots.default.length > 0) {
          var o = 0;this.$slots.default.forEach(function (i) {
            if (i.componentOptions) {
              o > 0 && a.push(t(r.a, {}));var s = i.componentOptions.propsData;e === o ? s.active = !0 : n && e > o ? s.completed = !0 : n && e < o && (s.disabled = !0), s.index = o++, a.push(i);
            }
          }), a.length > 0 && (a[a.length - 1].componentOptions.propsData.last = !0);
        }return t("div", { class: ["mu-stepper", "vertical" === i ? "mu-stepper-vertical" : ""] }, a);
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-sub-header", props: { inset: { type: Boolean, default: !1 } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(38),
        r = n.n(i);e.default = { name: "mu-switch", props: { name: { type: String }, value: { type: Boolean }, label: { type: String, default: "" }, labelLeft: { type: Boolean, default: !1 }, labelClass: { type: [String, Object, Array] }, trackClass: { type: [String, Object, Array] }, thumbClass: { type: [String, Object, Array] }, disabled: { type: Boolean, default: !1 } }, data: function () {
        return { inputValue: this.value };
      }, watch: { value: function (t) {
          this.inputValue = t;
        }, inputValue: function (t) {
          this.$emit("input", t);
        } }, methods: { handleMouseDown: function (t) {
          this.disabled || 0 === t.button && this.$children[0].start(t);
        }, handleClick: function () {}, handleMouseUp: function () {
          this.disabled || this.$children[0].end();
        }, handleMouseLeave: function () {
          this.disabled || this.$children[0].end();
        }, handleTouchStart: function (t) {
          this.disabled || this.$children[0].start(t);
        }, handleTouchEnd: function () {
          this.disabled || this.$children[0].end();
        }, handleChange: function () {
          this.$emit("change", this.inputValue);
        } }, components: { "touch-ripple": r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-table", props: { fixedFooter: { type: Boolean, default: !0 }, fixedHeader: { type: Boolean, default: !0 }, height: { type: String }, enableSelectAll: { type: Boolean, default: !1 }, allRowsSelected: { type: Boolean, default: !1 }, multiSelectable: { type: Boolean, default: !1 }, selectable: { type: Boolean, default: !0 }, showCheckbox: { type: Boolean, default: !0 } }, data: function () {
        return { isSelectAll: !1 };
      }, computed: { bodyStyle: function () {
          return { overflow: "auto", height: this.height };
        } }, mounted: function () {
        this.allRowsSelected && this.selectAll();
      }, methods: { handleRowClick: function (t, e) {
          this.$emit("rowClick", t, e), this.$emit("row-click", t, e);
        }, handleRowHover: function (t, e) {
          this.$emit("rowHover", t, e), this.$emit("row-hover", t, e);
        }, handleRowHoverExit: function (t, e) {
          this.$emit("rowHoverExit", t, e), this.$emit("row-hover-exit", t, e);
        }, handleRowSelect: function (t) {
          this.$emit("rowSelection", t), this.$emit("row-selection", t);
        }, handleCellClick: function (t, e, n, i) {
          this.$emit("cellClick", t, e, n, i), this.$emit("cell-click", t, e, n, i);
        }, handleCellHover: function (t, e, n, i) {
          this.$emit("cellHover", t, e, n, i), this.$emit("cell-hover", t, e, n, i);
        }, handleCellHoverExit: function (t, e, n, i) {
          this.$emit("cellHoverExit", t, e, n, i), this.$emit("cell-hover-exit", t, e, n, i);
        }, changeSelectAll: function (t) {
          this.isSelectAll = t;
        }, selectAll: function () {
          var t = this.getTbody();t && t.selectAll();
        }, unSelectAll: function () {
          var t = this.getTbody();t && t.unSelectAll();
        }, getTbody: function () {
          for (var t = 0; t < this.$children.length; t++) {
            var e = this.$children[t];if (e.isTbody) return e;
          }
        } }, watch: { allRowsSelected: function (t, e) {
          t !== e && (t ? this.selectAll() : this.unSelectAll());
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-tbody", data: function () {
        return { selectedRows: [] };
      }, created: function () {
        this.isTbody = !0, this._unSelectAll = !1;
      }, computed: { showCheckbox: function () {
          return this.$parent.showCheckbox;
        }, selectable: function () {
          return this.$parent.selectable;
        }, multiSelectable: function () {
          return this.$parent.multiSelectable;
        }, enableSelectAll: function () {
          return this.$parent.enableSelectAll;
        }, isSelectAll: function () {
          return this.$parent.isSelectAll;
        } }, methods: { handleRowClick: function (t, e) {
          this.$parent.handleRowClick(this.getRowIndex(e), e);
        }, selectRow: function (t) {
          var e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];if (this.selectable) {
            if (this.selectedRows.indexOf(t) === -1) {
              if (this.multiSelectable || (this.selectedRows = []), this.selectedRows.push(t), this.isSelectAllRow()) return void this.selectAll(!0);this.$parent.handleRowSelect && e && this.$parent.handleRowSelect(this.convertSelectedRows(this.selectedRows));
            }
          }
        }, isSelectAllRow: function () {
          if (!this.enableSelectAll || !this.multiSelectable) return !1;var t = 0;return this.$children.forEach(function (e) {
            e.selectable && t++;
          }), t === this.selectedRows.length;
        }, unSelectRow: function (t) {
          var e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];if (this.selectable) {
            var n = this.selectedRows.indexOf(t);n !== -1 && this.selectedRows.splice(n, 1), this._unSelectAll = !0, this.$parent.changeSelectAll(!1), this.$parent.handleRowSelect && e && this.$parent.handleRowSelect(this.convertSelectedRows(this.selectedRows));
          }
        }, selectAll: function (t) {
          var e = this;this.selectable && this.multiSelectable && (this._unSelectAll = !1, t || (this.selectedRows = [], this.$children.forEach(function (t) {
            t.selectable && e.selectedRows.push(t.rowId);
          })), this.$parent.changeSelectAll(!0), this.$parent.handleRowSelect && this.$parent.handleRowSelect(this.convertSelectedRows(this.selectedRows)));
        }, unSelectAll: function () {
          this.selectable && this.multiSelectable && (this.selectedRows = [], this.$parent.changeSelectAll(!1), this.$parent.handleRowSelect && this.$parent.handleRowSelect([]));
        }, handleCellClick: function (t, e, n, i, r) {
          this.$parent.handleCellClick && this.$parent.handleCellClick(this.getRowIndex(r), e, n, r);
        }, handleCellHover: function (t, e, n, i, r) {
          this.$parent.handleCellHover && this.$parent.handleCellHover(this.getRowIndex(r), e, n, r);
        }, handleCellHoverExit: function (t, e, n, i, r) {
          this.$parent.handleCellHoverExit && this.$parent.handleCellHoverExit(this.getRowIndex(r), e, n, r);
        }, handleRowHover: function (t, e, n) {
          this.$parent.handleRowHover && this.$parent.handleRowHover(this.getRowIndex(n), n);
        }, handleRowHoverExit: function (t, e, n) {
          this.$parent.handleRowHoverExit && this.$parent.handleRowHoverExit(this.getRowIndex(n), n);
        }, getRowIndex: function (t) {
          return this.$children.indexOf(t);
        }, convertSelectedRows: function () {
          var t = this,
              e = this.selectedRows.map(function (e) {
            return t.convertRowIdToIndex(e);
          }).filter(function (t) {
            return t !== -1;
          });return this.multiSelectable ? e : e[0];
        }, convertRowIdToIndex: function (t) {
          for (var e = 0; e < this.$children.length; e++) {
            var n = this.$children[e];if (n.rowId && n.rowId === t) return e;
          }return -1;
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-td", props: { name: { type: String } }, methods: { handleMouseEnter: function (t) {
          this.$emit("hover", t), this.$parent.handleCellHover && this.$parent.handleCellHover(t, this.name, this);
        }, handleMouseLeave: function (t) {
          this.$emit("hoverExit", t), this.$emit("hover-exit", t), this.$parent.handleCellHoverExit && this.$parent.handleCellHoverExit(t, this.name, this);
        }, handleClick: function (t) {
          this.$emit("click", t), this.$parent.handleCellClick && this.$parent.handleCellClick(t, this.name, this);
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-tfoot", created: function () {
        this.isTfoot = !0;
      }, computed: { showCheckbox: function () {
          return this.$parent.showCheckbox;
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(40);e.default = { name: "mu-th", props: { tooltip: { type: String }, tooltipPosition: { type: String, default: "bottom-right" }, touch: { type: Boolean, default: !1 } }, data: function () {
        return { tooltipShown: !1, tooltipTrigger: null };
      }, mounted: function () {
        this.tooltipTrigger = this.$refs.wrapper;
      }, computed: { verticalPosition: function () {
          return this.tooltipPosition.split("-")[0];
        }, horizontalPosition: function () {
          return this.tooltipPosition.split("-")[1];
        } }, methods: { showTooltip: function () {
          this.tooltipShown = !0;
        }, hideTooltip: function () {
          this.tooltipShown = !1;
        } }, components: { tooltip: i.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-thead", created: function () {
        this.isThead = !0;
      }, computed: { showCheckbox: function () {
          return this.$parent.showCheckbox;
        }, enableSelectAll: function () {
          return this.$parent.enableSelectAll;
        }, multiSelectable: function () {
          return this.$parent.multiSelectable;
        }, isSelectAll: function () {
          return this.$parent.isSelectAll;
        } }, methods: { selectAll: function () {
          this.$parent.selectAll();
        }, unSelectAll: function () {
          this.$parent.unSelectAll();
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1),
        r = n(95),
        a = n.n(r),
        o = n(96),
        s = n.n(o),
        l = n(63),
        u = 1;e.default = { name: "mu-tr", props: { selectable: { type: Boolean, default: !0 }, selected: { type: Boolean, default: !1 } }, data: function () {
        return { hover: !1, rowId: "tr-" + u++ };
      }, mounted: function () {
        this.selected && this.$parent.selectRow(this.rowId);
      }, computed: { className: function () {
          return { hover: this.hover, selected: this.isSelected, stripe: !1 };
        }, isTh: function () {
          return this.$parent.isThead;
        }, isTf: function () {
          return this.$parent.isTfoot;
        }, isTb: function () {
          return this.$parent.isTbody;
        }, isSelected: function () {
          return this.$parent.selectedRows && this.$parent.selectedRows.indexOf(this.rowId) !== -1;
        }, showCheckbox: function () {
          return this.$parent.showCheckbox;
        }, enableSelectAll: function () {
          return this.$parent.enableSelectAll;
        }, multiSelectable: function () {
          return this.$parent.multiSelectable;
        }, isSelectAll: function () {
          return this.$parent.isSelectAll;
        } }, methods: { handleHover: function (t) {
          n.i(i.g)() && this.$parent.isTbody && (this.hover = !0, this.$parent.handleRowHover && this.$parent.handleRowHover(t, this.rowId, this));
        }, handleExit: function (t) {
          n.i(i.g)() && this.$parent.isTbody && (this.hover = !1, this.$parent.handleRowHoverExit && this.$parent.handleRowHoverExit(t, this.rowId, this));
        }, handleClick: function (t) {
          this.$parent.isTbody && (this.selectable && (this.isSelected ? this.$parent.unSelectRow(this.rowId) : this.$parent.selectRow(this.rowId)), this.$parent.handleRowClick(t, this));
        }, handleCheckboxClick: function (t) {
          t.stopPropagation();
        }, handleCheckboxChange: function (t) {
          this.selectable && (t ? this.$parent.selectRow(this.rowId) : this.$parent.unSelectRow(this.rowId));
        }, handleSelectAllChange: function (t) {
          t ? this.$parent.selectAll() : this.$parent.unSelectAll();
        }, handleCellHover: function (t, e, n) {
          this.$parent.handleCellHover && this.$parent.handleCellHover(t, e, n, this.rowId, this);
        }, handleCellHoverExit: function (t, e, n) {
          this.$parent.handleCellHoverExit && this.$parent.handleCellHoverExit(t, e, n, this.rowId, this);
        }, handleCellClick: function (t, e, n) {
          this.$parent.handleCellClick && this.$parent.handleCellClick(t, e, n, this.rowId, this);
        } }, watch: { selected: function (t, e) {
          t !== e && (t ? this.$parent.selectRow(this.rowId, !1) : this.$parent.unSelectRow(this.rowId, !1));
        } }, components: { "mu-td": a.a, "mu-th": s.a, checkbox: l.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(5),
        r = n(9),
        a = n(2),
        o = n(1);e.default = { name: "mu-tab", mixins: [r.a], props: { icon: { type: String, default: "" }, iconClass: { type: [String, Object, Array] }, title: { type: String, default: "" }, titleClass: { type: [String, Object, Array] }, href: { type: String }, disabled: { type: Boolean }, value: {} }, computed: { active: function () {
          return n.i(o.c)(this.value) && this.$parent.value === this.value;
        }, textClass: function () {
          var t = this.icon,
              e = this.titleClass,
              i = [];return t && i.push("has-icon"), i.concat(n.i(o.f)(e));
        } }, methods: { tabClick: function (t) {
          this.$parent.handleTabClick && this.$parent.handleTabClick(this.value, this), this.$emit("click", t);
        } }, watch: { active: function (t, e) {
          t !== e && t && this.$emit("active");
        } }, components: { "abstract-button": i.a, icon: a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-tabs", props: { lineClass: { type: [String, Object, Array] }, value: {} }, data: function () {
        return { tabLightStyle: { width: "100%", transform: "translate3d(0, 0, 0)" } };
      }, updated: function () {
        this.setTabLightStyle();
      }, methods: { handleTabClick: function (t, e) {
          this.value !== t && this.$emit("change", t);
        }, getActiveIndex: function () {
          var t = this;if (!this.$children || 0 === this.$children.length) return -1;var e = -1;return this.$children.forEach(function (n, i) {
            if (n.value === t.value) return e = i, !1;
          }), e;
        }, setTabLightStyle: function () {
          var t = 100 * this.getActiveIndex(),
              e = this.$children.length,
              n = this.$refs.highlight;n.style.width = e > 0 ? (100 / e).toFixed(4) + "%" : "100%", n.style.transform = "translate3d(" + t + "%, 0, 0)";
        } }, mounted: function () {
        this.setTabLightStyle();
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { props: { name: { type: String }, placeholder: { type: String }, value: { type: String }, rows: { type: Number, default: 1 }, rowsMax: { type: Number }, disabled: { type: Boolean, default: !1 }, normalClass: { type: [String, Array, Object] }, required: { type: Boolean, default: !1 } }, methods: { resizeTextarea: function () {
          var t = this.$refs.textarea;if (t) {
            var e = this.$refs.textareaHidden,
                n = window.getComputedStyle(t, null).getPropertyValue("line-height");n = Number(n.substring(0, n.indexOf("px")));var i = window.getComputedStyle(t, null).getPropertyValue("padding-top");i = Number(i.substring(0, i.indexOf("px")));var r = window.getComputedStyle(t, null).getPropertyValue("padding-bottom");r = Number(r.substring(0, r.indexOf("px")));var a = r + i + n * this.rows,
                o = r + i + n * (this.rowsMax || 0),
                s = e.scrollHeight;t.style.height = (s < a ? a : s > o && o > 0 ? o : s) + "px";
          }
        }, handleInput: function (t) {
          this.$emit("input", t.target.value);
        }, handleChange: function (t) {
          this.$emit("change", t);
        }, handleFocus: function (t) {
          this.$emit("focus", t);
        }, handleBlur: function (t) {
          this.$emit("blur", t);
        }, focus: function () {
          var t = this.$refs.textarea;t && t.focus();
        } }, mounted: function () {
        this.resizeTextarea();
      }, watch: { value: function (t, e) {
          var n = this;t !== e && this.$nextTick(function () {
            n.resizeTextarea();
          });
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(2),
        r = n(476),
        a = n.n(r),
        o = n(472),
        s = n.n(o),
        l = n(475),
        u = n.n(l),
        c = n(1),
        d = n(474),
        f = n.n(d);e.default = { name: "mu-text-field", props: { name: { type: String }, type: { type: String }, icon: { type: String }, iconClass: { type: [String, Array, Object] }, label: { type: String }, labelFloat: { type: Boolean, default: !1 }, labelClass: { type: [String, Array, Object] }, labelFocusClass: { type: [String, Array, Object] }, hintText: { type: String }, hintTextClass: { type: [String, Array, Object] }, value: {}, inputClass: { type: [String, Array, Object] }, multiLine: { type: Boolean, default: !1 }, rows: { type: Number, default: 1 }, rowsMax: { type: Number }, errorText: { type: String }, errorColor: { type: String }, helpText: { type: String }, helpTextClass: { type: [String, Array, Object] }, maxLength: { type: Number, default: 0 }, disabled: { type: Boolean, default: !1 }, fullWidth: { type: Boolean, default: !1 }, underlineShow: { type: Boolean, default: !0 }, underlineClass: { type: [String, Array, Object] }, underlineFocusClass: { type: [String, Array, Object] }, max: { type: [Number, String] }, min: { type: [Number, String] }, required: { type: Boolean, default: !1 } }, data: function () {
        return { isFocused: !1, inputValue: this.value, charLength: 0 };
      }, computed: { textFieldClass: function () {
          return { "focus-state": this.isFocused, "has-label": this.label, "no-empty-state": this.inputValue, "has-icon": this.icon, error: this.errorText, "multi-line": this.multiLine, disabled: this.disabled, "full-width": this.fullWidth };
        }, float: function () {
          return this.labelFloat && !this.isFocused && !this.inputValue && 0 !== this.inputValue;
        }, errorStyle: function () {
          return { color: !this.disabled && this.errorText ? n.i(c.d)(this.errorColor) : "" };
        }, showHint: function () {
          return !this.float && !this.inputValue && 0 !== this.inputValue;
        } }, methods: { handleFocus: function (t) {
          this.isFocused = !0, this.$emit("focus", t);
        }, handleBlur: function (t) {
          this.isFocused = !1, "number" === this.type && !this.inputValue && 0 !== this.inputValue && this.$refs.input && (this.$refs.input.value = ""), this.$emit("blur", t);
        }, handleInput: function (t) {
          this.inputValue = t.target ? t.target.value : t;
        }, handleChange: function (t) {
          this.$emit("change", t, t.target.value);
        }, handleLabelClick: function () {
          this.$emit("labelClick");
        }, focus: function () {
          var t = this.$refs,
              e = t.input,
              n = t.textarea;e ? e.focus() : n && n.focus();
        } }, watch: { value: function (t) {
          this.inputValue = t;
        }, inputValue: function (t, e) {
          this.charLength = this.maxLength && String(this.inputValue) ? String(this.inputValue).length : 0, this.$emit("input", t);
        }, charLength: function (t) {
          t > this.maxLength && !this.isTextOverflow && (this.isTextOverflow = !0, this.$emit("textOverflow", !0), this.$emit("text-overflow", !0)), this.isTextOverflow && t <= this.maxLength && (this.isTextOverflow = !1, this.$emit("textOverflow", !1), this.$emit("text-overflow", !1));
        } }, components: { icon: i.a, underline: a.a, "enhanced-textarea": s.a, "text-field-label": u.a, "text-field-hint": f.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { props: { text: { type: String }, show: { type: Boolean, default: !0 } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { props: { focus: { type: Boolean, default: !1 }, float: { type: Boolean, default: !1 }, normalClass: { type: [String, Object, Array] }, focusClass: { type: [String, Object, Array] } }, computed: { labelClass: function () {
          var t = this.float,
              e = this.focus,
              r = this.normalClass,
              a = this.focusClass,
              o = [];return t && o.push("float"), o = o.concat(n.i(i.f)(r)), e && (o = o.concat(n.i(i.f)(a))), o;
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(1);e.default = { props: { focus: { type: Boolean, default: !1 }, error: { type: Boolean }, errorColor: { type: String }, disabled: { type: Boolean }, normalClass: { type: [String, Object, Array] }, focusClass: { type: [String, Object, Array] } }, computed: { lineClass: function () {
          var t = this.disabled,
              e = this.normalClass,
              r = [];return t && r.push("disabled"), r.concat(n.i(i.f)(e));
        }, focusLineClass: function () {
          var t = this.normalClass,
              e = this.focus,
              r = this.focusClass,
              a = this.error,
              o = [];return o.concat(n.i(i.f)(t)), a && o.push("error"), e && o.push("focus"), o.concat(n.i(i.f)(r));
        }, errorStyle: function () {
          return { "background-color": this.error ? n.i(i.d)(this.errorColor) : "" };
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(72);e.default = { name: "mu-timeline", props: { lineType: { type: String, default: "solid", validator: function (t) {
            var e = ["solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset"];return n.i(i.a)(t, e);
          } }, lineColor: { type: String, default: "#e8e8e8" }, lineWidth: { type: Number, default: 2 }, iconWidth: { type: Number, default: 15 }, iconColor: { type: String, default: "#7e57c2" }, iconType: { type: String, default: "solid", validator: function (t) {
            var e = ["solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset"];return n.i(i.a)(t, e);
          } }, iconLine: { type: Number, default: 2 } }, methods: { updateChildren: function () {
          for (var t = 0, e = this.$children.length; t < e; t++) {
            var n = this.$children[t],
                i = this.iconWidth,
                r = this.iconColor,
                a = this.iconType,
                o = this.iconLine,
                s = this.lineColor,
                l = this.lineWidth,
                u = this.lineType;n.icon = { width: i, color: r, line: o, type: a }, n.line = { color: s, width: l, type: u }, t === e - 1 && (n.last = !0);
          }
        } }, mounted: function () {
        this.updateChildren();
      }, updated: function () {
        var t = this;this.$nextTick(function () {
          t.updateChildren();
        });
      }, watch: { separator: function () {
          this.updateChildren();
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(72);e.default = { name: "mu-timeline-item", props: { iconColor: { type: String, default: "" }, iconType: { type: String, default: "", validator: function (t) {
            var e = ["", "solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset"];return n.i(i.a)(t, e);
          } }, iconLine: { type: String, default: "" }, lineColor: { type: String, default: "" }, lineType: { type: String, default: "", validator: function (t) {
            var e = ["", "solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset"];return n.i(i.a)(t, e);
          } } }, data: function () {
        return { line: {}, icon: {}, last: !1 };
      }, computed: { lineStyle: function () {
          var t = this.line.color,
              e = this.line.type;return "" !== this.lineColor && (t = this.lineColor), "" !== this.lineType && (e = this.lineType), { borderLeft: e + " " + this.line.width + "px " + t, left: this.icon.width / 2 - this.line.width / 2 + "px" };
        }, iconStyle: function () {
          var t = this.icon.color,
              e = this.icon.type,
              n = this.icon.line;return "" !== this.iconColor && (t = this.iconColor), "" !== this.iconType && (e = this.iconType), "" !== this.iconLine && (n = this.iconLine), { border: e + " " + n + "px " + t, width: this.icon.width + "px", height: this.icon.width + "px", borderRadius: "50%" };
        }, contentStyle: function () {
          return { left: 2 * this.icon.width + "px" };
        }, customedStyle: function () {} } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(482),
        r = n.n(i),
        a = n(480),
        o = n.n(a),
        s = n(481),
        l = n.n(s),
        u = n(23);e.default = { props: { autoOk: { type: Boolean, default: !1 }, format: { type: String, default: "ampm", validator: function (t) {
            return ["ampm", "24hr"].indexOf(t) !== -1;
          } }, initialTime: { type: Date, default: function () {
            return new Date();
          } }, okLabel: { type: String, default: "确定" }, cancelLabel: { type: String, default: "取消" }, landscape: { type: Boolean, default: !1 } }, data: function () {
        return { selectedTime: this.initialTime, mode: "hour" };
      }, methods: { getAffix: function () {
          return "ampm" !== this.format ? "" : this.selectedTime.getHours() < 12 ? "am" : "pm";
        }, handleSelectAffix: function (t) {
          if (t !== this.getAffix()) {
            var e = this.selectedTime.getHours();if ("am" === t) return void this.handleChangeHours(e - 12, t);this.handleChangeHours(e + 12, t);
          }
        }, handleChangeHours: function (t, e) {
          var n = this,
              i = new Date(this.selectedTime),
              r = void 0;"string" == typeof e && (r = e, e = void 0), r || (r = this.getAffix()), "pm" === r && t < 12 && (t += 12), i.setHours(t), this.selectedTime = i, e && setTimeout(function () {
            n.mode = "minute", n.$emit("changeHours", i);
          }, 100);
        }, handleChangeMinutes: function (t) {
          var e = this,
              n = new Date(this.selectedTime);n.setMinutes(t), this.selectedTime = n, setTimeout(function () {
            e.$emit("changeMinutes", n), e.autoOk && e.accept();
          }, 0);
        }, accept: function () {
          this.$emit("accept", this.selectedTime);
        }, dismiss: function () {
          this.$emit("dismiss");
        } }, watch: { initialTime: function (t) {
          this.selectedTime = t;
        } }, components: { "time-display": r.a, "clock-hours": o.a, "clock-minutes": l.a, "flat-button": u.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(97),
        r = n.n(i),
        a = n(98),
        o = n.n(a),
        s = n(22);e.default = { props: { format: { type: String, default: "ampm", validator: function (t) {
            return ["ampm", "24hr"].indexOf(t) !== -1;
          } }, initialHours: { type: Number, default: new Date().getHours() } }, computed: { hours: function t() {
          for (var e = "ampm" === this.format ? 12 : 24, t = [], n = 1; n <= e; n++) t.push(n % 24);return t;
        } }, methods: { getSelected: function () {
          var t = this.initialHours;return "ampm" === this.format && (t %= 12, t = t || 12), t;
        }, isMousePressed: function (t) {
          return void 0 === t.buttons ? t.nativeEvent.which : t.buttons;
        }, handleUp: function (t) {
          t.preventDefault(), this.setClock(t, !0);
        }, handleMove: function (t) {
          t.preventDefault(), 1 === this.isMousePressed(t) && this.setClock(t, !1);
        }, handleTouchMove: function (t) {
          t.preventDefault(), this.setClock(t.changedTouches[0], !1);
        }, handleTouchEnd: function (t) {
          t.preventDefault(), this.setClock(t.changedTouches[0], !0);
        }, setClock: function (t, e) {
          if (void 0 === t.offsetX) {
            var i = n.i(s.c)(t);t.offsetX = i.offsetX, t.offsetY = i.offsetY;
          }var r = this.getHours(t.offsetX, t.offsetY);this.$emit("change", r, e);
        }, getHours: function (t, e) {
          var i = 30,
              r = t - this.center.x,
              a = e - this.center.y,
              o = this.basePoint.x - this.center.x,
              l = this.basePoint.y - this.center.y,
              u = Math.atan2(o, l) - Math.atan2(r, a),
              c = n.i(s.d)(u);c = Math.round(c / i) * i, c %= 360;var d = Math.floor(c / i) || 0,
              f = Math.pow(r, 2) + Math.pow(a, 2),
              h = Math.sqrt(f);return d = d || 12, "24hr" === this.format ? h < 90 && (d += 12, d %= 24) : d %= 12, d;
        } }, mounted: function () {
        var t = this.$refs.mask;this.center = { x: t.offsetWidth / 2, y: t.offsetHeight / 2 }, this.basePoint = { x: this.center.x, y: 0 };
      }, components: { "clock-number": r.a, "clock-pointer": o.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(97),
        r = n.n(i),
        a = n(98),
        o = n.n(a),
        s = n(22);e.default = { props: { initialMinutes: { type: Number, default: function () {
            return new Date().getMinutes();
          } } }, mounted: function () {
        var t = this.$refs.mask;this.center = { x: t.offsetWidth / 2, y: t.offsetHeight / 2 }, this.basePoint = { x: this.center.x, y: 0 };
      }, data: function () {
        return { minutes: null };
      }, created: function () {
        this.minutes = this.getMinuteNumbers();
      }, methods: { getMinuteNumbers: function () {
          for (var t = [], e = 0; e < 12; e++) t.push(5 * e);var n = this.initialMinutes,
              i = !1;return { numbers: t.map(function (t) {
              var e = n === t;return e && (i = !0), { minute: t, isSelected: e };
            }), hasSelected: i, selected: n };
        }, isMousePressed: function (t) {
          return void 0 === t.buttons ? t.nativeEvent.which : t.buttons;
        }, handleUp: function (t) {
          t.preventDefault(), this.setClock(t, !0);
        }, handleMove: function (t) {
          t.preventDefault(), 1 === this.isMousePressed(t) && this.setClock(t, !1);
        }, handleTouch: function (t) {
          t.preventDefault(), this.setClock(t.changedTouches[0], !1);
        }, setClock: function (t, e) {
          if (void 0 === t.offsetX) {
            var i = n.i(s.c)(t);t.offsetX = i.offsetX, t.offsetY = i.offsetY;
          }var r = this.getMinutes(t.offsetX, t.offsetY);this.$emit("change", r, e);
        }, getMinutes: function (t, e) {
          var i = 6,
              r = t - this.center.x,
              a = e - this.center.y,
              o = this.basePoint.x - this.center.x,
              l = this.basePoint.y - this.center.y,
              u = Math.atan2(o, l) - Math.atan2(r, a),
              c = n.i(s.d)(u);return c = Math.round(c / i) * i, c %= 360, Math.floor(c / i) || 0;
        } }, watch: { initialMinutes: function (t) {
          this.minutes = this.getMinuteNumbers();
        } }, components: { "clock-number": r.a, "clock-pointer": o.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(255),
        r = n.n(i),
        a = n(22),
        o = [[0, 5], [54.5, 16.6], [94.4, 59.5], [109, 114], [94.4, 168.5], [54.5, 208.4], [0, 223], [-54.5, 208.4], [-94.4, 168.5], [-109, 114], [-94.4, 59.5], [-54.5, 19.6]],
        s = [[0, 40], [36.9, 49.9], [64, 77], [74, 114], [64, 151], [37, 178], [0, 188], [-37, 178], [-64, 151], [-74, 114], [-64, 77], [-37, 50]];e.default = { props: { value: { type: Number, default: 0 }, type: { type: String, default: "minute", validator: function (t) {
            return ["hour", "minute"].indexOf(t) !== -1;
          } }, selected: { type: Boolean, default: !1 } }, computed: { isInner: function () {
          return n.i(a.e)(this);
        }, numberClass: function () {
          return { selected: this.selected, inner: this.isInner };
        }, numberStyle: function () {
          var t = this.value;"hour" === this.type ? t %= 12 : t /= 5;var e = o[t];this.isInner && (e = s[t]);var n = e,
              i = r()(n, 2);return { transform: "translate(" + i[0] + "px, " + i[1] + "px)", left: this.isInner ? "calc(50% - 14px)" : "calc(50% - 16px)" };
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(22);e.default = { props: { hasSelected: { type: Boolean, default: !1 }, type: { type: String, default: "minute", validator: function (t) {
            return ["hour", "minute"].indexOf(t) !== -1;
          } }, value: { type: Number } }, computed: { isInner: function () {
          return n.i(i.e)(this);
        }, pointerStyle: function () {
          var t = this.type,
              e = this.value,
              n = this.calcAngle;return { transform: "rotateZ(" + ("hour" === t ? n(e, 12) : n(e, 60)) + "deg)" };
        } }, methods: { calcAngle: function (t, e) {
          return t %= e, 360 / e * t;
        } }, render: function (t) {
        return void 0 === this.value || null === this.value ? t("span", {}) : t("div", { class: { "mu-clock-pointer": !0, inner: this.isInner }, style: this.pointerStyle }, [t("div", { class: { "mu-clock-pointer-mark": !0, "has-selected": this.hasSelected } })]);
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { props: { affix: { type: String, default: "", validator: function (t) {
            return ["", "pm", "am"].indexOf(t) !== -1;
          } }, format: { type: String, validator: function (t) {
            return t && ["ampm", "24hr"].indexOf(t) !== -1;
          } }, mode: { type: String, default: "hour", validator: function (t) {
            return ["hour", "minute"].indexOf(t) !== -1;
          } }, selectedTime: { type: Date, default: function () {
            return new Date();
          }, required: !0 } }, methods: { handleSelectAffix: function (t) {
          this.$emit("selectAffix", t);
        }, handleSelectHour: function () {
          this.$emit("selectHour");
        }, handleSelectMin: function () {
          this.$emit("selectMin");
        } }, computed: { sanitizeTime: function () {
          var t = this.selectedTime.getHours(),
              e = this.selectedTime.getMinutes().toString();return "ampm" === this.format && (t %= 12, t = t || 12), t = t.toString(), t.length < 2 && (t = "0" + t), e.length < 2 && (e = "0" + e), [t, e];
        } } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(17),
        r = n(484),
        a = n.n(r),
        o = n(22);e.default = { name: "mu-time-picker", props: { autoOk: { type: Boolean, default: !1 }, cancelLabel: { type: String }, okLabel: { type: String }, container: { type: String, default: "dialog", validator: function (t) {
            return t && ["dialog", "inline"].indexOf(t) !== -1;
          } }, mode: { type: String, default: "portrait", validator: function (t) {
            return t && ["portrait", "landscape"].indexOf(t) !== -1;
          } }, format: { type: String, default: "ampm", validator: function (t) {
            return ["ampm", "24hr"].indexOf(t) !== -1;
          } }, name: { type: String }, label: { type: String }, labelFloat: { type: Boolean, default: !1 }, labelClass: { type: [String, Array, Object] }, labelFocusClass: { type: [String, Array, Object] }, disabled: { type: Boolean, default: !1 }, hintText: { type: String }, hintTextClass: { type: [String, Array, Object] }, helpText: { type: String }, helpTextClass: { type: [String, Array, Object] }, errorText: { type: String }, errorColor: { type: String }, icon: { type: String }, iconClass: { type: [String, Array, Object] }, fullWidth: { type: Boolean, default: !1 }, underlineShow: { type: Boolean, default: !0 }, underlineClass: { type: [String, Array, Object] }, underlineFocusClass: { type: [String, Array, Object] }, inputClass: { type: [String, Array, Object] }, value: { type: String } }, data: function () {
        return { inputValue: this.value, dialogTime: null };
      }, methods: { handleClick: function () {
          var t = this;this.disabled || setTimeout(function () {
            t.openDialog();
          }, 0);
        }, handleFocus: function (t) {
          t.target.blur(), this.$emit("focus", t);
        }, openDialog: function () {
          this.disabled || (this.dialogTime = this.inputValue ? o.a(this.inputValue, this.format) : new Date(), this.$refs.dialog.open = !0);
        }, handleAccept: function (t) {
          var e = o.b(t, this.format);this.inputValue !== e && (this.inputValue = e, this.$emit("change", e));
        } }, watch: { value: function (t) {
          this.inputValue = t;
        }, inputValue: function (t) {
          this.$emit("input", t);
        } }, components: { "text-field": i.a, "time-picker-dialog": a.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(479),
        r = n.n(i),
        a = n(11),
        o = n(39);e.default = { props: { autoOk: { type: Boolean, default: !1 }, cancelLabel: { type: String }, okLabel: { type: String }, container: { type: String, default: "dialog", validator: function (t) {
            return t && ["dialog", "inline"].indexOf(t) !== -1;
          } }, mode: { type: String, default: "portrait", validator: function (t) {
            return t && ["portrait", "landscape"].indexOf(t) !== -1;
          } }, format: { type: String, default: "ampm", validator: function (t) {
            return ["ampm", "24hr"].indexOf(t) !== -1;
          } }, initialTime: { type: Date } }, data: function () {
        return { open: !1, showClock: !1, trigger: null };
      }, mounted: function () {
        this.trigger = this.$el;
      }, methods: { handleAccept: function (t) {
          this.$emit("accept", t), this.open = !1;
        }, handleDismiss: function () {
          this.dismiss();
        }, handleClose: function () {
          this.dismiss();
        }, dismiss: function () {
          this.open = !1, this.$emit("dismiss");
        }, hideClock: function () {
          this.showClock = !1;
        } }, watch: { open: function (t) {
          t && (this.showClock = !0);
        } }, render: function (t) {
        var e = this.showClock ? t(r.a, { props: { autoOk: this.autoOk, cancelLabel: this.cancelLabel, okLabel: this.okLabel, landscape: "landscape" === this.mode, initialTime: this.initialTime, format: this.format }, on: { accept: this.handleAccept, dismiss: this.handleDismiss } }) : void 0;return t("div", {}, ["dialog" === this.container ? t(o.a, { props: { open: this.open, dialogClass: ["mu-time-picker-dialog", this.mode] }, on: { close: this.handleClose, hide: this.hideClock } }, [e]) : t(a.a, { props: { trigger: this.trigger, overlay: !1, open: this.open }, on: { close: this.handleClose, hide: this.hideClock } }, [e])]);
      } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(28),
        r = n(42);e.default = { name: "mu-toast", props: { message: { type: String } }, methods: { clickOutSide: function () {
          this.$emit("close", "clickOutSide");
        } }, data: function () {
        return { zIndex: n.i(i.a)() };
      }, directives: { clickoutside: r.a } };
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mu-tooltip", props: { label: { type: String }, trigger: {}, verticalPosition: { type: String, default: "bottom" }, horizontalPosition: { type: String, default: "center" }, show: { type: Boolean, default: !1 }, touch: { type: Boolean, default: !1 } }, data: function () {
        return { offsetWidth: 0, triggerWidth: 0, triggerHeight: 0 };
      }, computed: { tooltipStyle: function () {
          var t = this.horizontalPosition,
              e = this.verticalPosition,
              n = this.offsetWidth,
              i = this.touch,
              r = this.triggerWidth,
              a = this.triggerHeight,
              o = this.show,
              s = i ? 10 : 0,
              l = i ? -20 : -10,
              u = "bottom" === e ? 14 + s : -14 - s;return { right: "left" === t ? "0" : null, left: "center" === t ? (n - r) / 2 * -1 + "px" : "right" === t ? "0" : "", top: o ? "top" === e ? l + "px" : a - u + s + 2 + "px" : "-3000px", transform: "translate(0px, " + u + "px)" };
        }, rippleStyle: function () {
          var t = this.horizontalPosition,
              e = this.verticalPosition;return { left: "center" === t ? "50%" : "left" === t ? "100%" : "0%", top: "bottom" === e ? "0" : "100%" };
        } }, methods: { setRippleSize: function () {
          var t = this.$refs.ripple,
              e = this.$el;if (e && t) {
            var n = parseInt(e.offsetWidth, 10) / ("center" === this.horizontalPosition ? 2 : 1),
                i = parseInt(e.offsetHeight, 10),
                r = Math.ceil(2 * Math.sqrt(Math.pow(i, 2) + Math.pow(n, 2)));this.show ? (t.style.height = r + "px", t.style.width = r + "px") : (t.style.width = "0px", t.style.height = "0px");
          }
        }, setTooltipSize: function () {
          this.offsetWidth = this.$el.offsetWidth, this.trigger && (this.triggerWidth = this.trigger.offsetWidth, this.triggerHeight = this.trigger.offsetHeight);
        } }, mounted: function () {
        this.setRippleSize(), this.setTooltipSize();
      }, beforeUpdate: function () {
        this.setTooltipSize();
      }, updated: function () {
        this.setRippleSize();
      } };
  }, function (t, e, n) {
    t.exports = { default: n(256), __esModule: !0 };
  }, function (t, e, n) {
    t.exports = { default: n(257), __esModule: !0 };
  }, function (t, e, n) {
    t.exports = { default: n(261), __esModule: !0 };
  }, function (t, e, n) {
    t.exports = { default: n(262), __esModule: !0 };
  }, function (t, e, n) {
    t.exports = { default: n(263), __esModule: !0 };
  }, function (t, e, n) {
    "use strict";
    e.__esModule = !0, e.default = function (t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    };
  }, function (t, e, n) {
    "use strict";
    function i(t) {
      return t && t.__esModule ? t : { default: t };
    }e.__esModule = !0;var r = n(75),
        a = i(r);e.default = function () {
      function t(t, e) {
        for (var n = 0; n < e.length; n++) {
          var i = e[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), (0, a.default)(t, i.key, i);
        }
      }return function (e, n, i) {
        return n && t(e.prototype, n), i && t(e, i), e;
      };
    }();
  }, function (t, e, n) {
    "use strict";
    function i(t) {
      return t && t.__esModule ? t : { default: t };
    }e.__esModule = !0;var r = n(75),
        a = i(r);e.default = function (t, e, n) {
      return e in t ? (0, a.default)(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
    };
  }, function (t, e, n) {
    "use strict";
    function i(t) {
      return t && t.__esModule ? t : { default: t };
    }e.__esModule = !0;var r = n(248),
        a = i(r),
        o = n(247),
        s = i(o);e.default = function () {
      function t(t, e) {
        var n = [],
            i = !0,
            r = !1,
            a = void 0;try {
          for (var o, l = (0, s.default)(t); !(i = (o = l.next()).done) && (n.push(o.value), !e || n.length !== e); i = !0);
        } catch (t) {
          r = !0, a = t;
        } finally {
          try {
            !i && l.return && l.return();
          } finally {
            if (r) throw a;
          }
        }return n;
      }return function (e, n) {
        if (Array.isArray(e)) return e;if ((0, a.default)(Object(e))) return t(e, n);throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }();
  }, function (t, e, n) {
    n(37), n(36), t.exports = n(289);
  }, function (t, e, n) {
    n(37), n(36), t.exports = n(290);
  }, function (t, e, n) {
    n(292), t.exports = n(3).Object.assign;
  }, function (t, e, n) {
    n(293);var i = n(3).Object;t.exports = function (t, e, n) {
      return i.defineProperty(t, e, n);
    };
  }, function (t, e, n) {
    n(294), t.exports = n(3).Object.keys;
  }, function (t, e, n) {
    n(87), n(36), n(37), n(295), n(297), t.exports = n(3).Set;
  }, function (t, e, n) {
    n(296), n(87), n(298), n(299), t.exports = n(3).Symbol;
  }, function (t, e, n) {
    n(36), n(37), t.exports = n(61).f("iterator");
  }, function (t, e) {
    t.exports = function (t) {
      if ("function" != typeof t) throw TypeError(t + " is not a function!");return t;
    };
  }, function (t, e) {
    t.exports = function () {};
  }, function (t, e, n) {
    var i = n(48);t.exports = function (t, e) {
      var n = [];return i(t, !1, n.push, n, e), n;
    };
  }, function (t, e, n) {
    var i = n(16),
        r = n(58),
        a = n(288);t.exports = function (t) {
      return function (e, n, o) {
        var s,
            l = i(e),
            u = r(l.length),
            c = a(o, u);if (t && n != n) {
          for (; u > c;) if ((s = l[c++]) != s) return !0;
        } else for (; u > c; c++) if ((t || c in l) && l[c] === n) return t || c || 0;return !t && -1;
      };
    };
  }, function (t, e, n) {
    var i = n(29),
        r = n(49),
        a = n(34),
        o = n(58),
        s = n(270);t.exports = function (t, e) {
      var n = 1 == t,
          l = 2 == t,
          u = 3 == t,
          c = 4 == t,
          d = 6 == t,
          f = 5 == t || d,
          h = e || s;return function (e, s, p) {
        for (var m, v, y = a(e), g = r(y), b = i(s, p, 3), x = o(g.length), C = 0, _ = n ? h(e, x) : l ? h(e, 0) : void 0; x > C; C++) if ((f || C in g) && (m = g[C], v = b(m, C, y), t)) if (n) _[C] = v;else if (v) switch (t) {case 3:
            return !0;case 5:
            return m;case 6:
            return C;case 2:
            _.push(m);} else if (c) return !1;return d ? -1 : u || c ? c : _;
      };
    };
  }, function (t, e, n) {
    var i = n(18),
        r = n(80),
        a = n(4)("species");t.exports = function (t) {
      var e;return r(t) && (e = t.constructor, "function" != typeof e || e !== Array && !r(e.prototype) || (e = void 0), i(e) && null === (e = e[a]) && (e = void 0)), void 0 === e ? Array : e;
    };
  }, function (t, e, n) {
    var i = n(269);t.exports = function (t, e) {
      return new (i(t))(e);
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(8).f,
        r = n(53),
        a = n(84),
        o = n(29),
        s = n(77),
        l = n(30),
        u = n(48),
        c = n(50),
        d = n(81),
        f = n(286),
        h = n(6),
        p = n(52).fastKey,
        m = h ? "_s" : "size",
        v = function (t, e) {
      var n,
          i = p(e);if ("F" !== i) return t._i[i];for (n = t._f; n; n = n.n) if (n.k == e) return n;
    };t.exports = { getConstructor: function (t, e, n, c) {
        var d = t(function (t, i) {
          s(t, d, e, "_i"), t._i = r(null), t._f = void 0, t._l = void 0, t[m] = 0, void 0 != i && u(i, n, t[c], t);
        });return a(d.prototype, { clear: function () {
            for (var t = this, e = t._i, n = t._f; n; n = n.n) n.r = !0, n.p && (n.p = n.p.n = void 0), delete e[n.i];t._f = t._l = void 0, t[m] = 0;
          }, delete: function (t) {
            var e = this,
                n = v(e, t);if (n) {
              var i = n.n,
                  r = n.p;delete e._i[n.i], n.r = !0, r && (r.n = i), i && (i.p = r), e._f == n && (e._f = i), e._l == n && (e._l = r), e[m]--;
            }return !!n;
          }, forEach: function (t) {
            s(this, d, "forEach");for (var e, n = o(t, arguments.length > 1 ? arguments[1] : void 0, 3); e = e ? e.n : this._f;) for (n(e.v, e.k, this); e && e.r;) e = e.p;
          }, has: function (t) {
            return !!v(this, t);
          } }), h && i(d.prototype, "size", { get: function () {
            return l(this[m]);
          } }), d;
      }, def: function (t, e, n) {
        var i,
            r,
            a = v(t, e);return a ? a.v = n : (t._l = a = { i: r = p(e, !0), k: e, v: n, p: i = t._l, n: void 0, r: !1 }, t._f || (t._f = a), i && (i.n = a), t[m]++, "F" !== r && (t._i[r] = a)), t;
      }, getEntry: v, setStrong: function (t, e, n) {
        c(t, e, function (t, e) {
          this._t = t, this._k = e, this._l = void 0;
        }, function () {
          for (var t = this, e = t._k, n = t._l; n && n.r;) n = n.p;return t._t && (t._l = n = n ? n.n : t._t._f) ? "keys" == e ? d(0, n.k) : "values" == e ? d(0, n.v) : d(0, [n.k, n.v]) : (t._t = void 0, d(1));
        }, n ? "entries" : "values", !n, !0), f(e);
      } };
  }, function (t, e, n) {
    var i = n(45),
        r = n(266);t.exports = function (t) {
      return function () {
        if (i(this) != t) throw TypeError(t + "#toJSON isn't generic");return r(this);
      };
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(7),
        r = n(13),
        a = n(52),
        o = n(14),
        s = n(10),
        l = n(84),
        u = n(48),
        c = n(77),
        d = n(18),
        f = n(33),
        h = n(8).f,
        p = n(268)(0),
        m = n(6);t.exports = function (t, e, n, v, y, g) {
      var b = i[t],
          x = b,
          C = y ? "set" : "add",
          _ = x && x.prototype,
          S = {};return m && "function" == typeof x && (g || _.forEach && !o(function () {
        new x().entries().next();
      })) ? (x = e(function (e, n) {
        c(e, x, t, "_c"), e._c = new b(), void 0 != n && u(n, y, e[C], e);
      }), p("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","), function (t) {
        var e = "add" == t || "set" == t;t in _ && (!g || "clear" != t) && s(x.prototype, t, function (n, i) {
          if (c(this, x, t), !e && g && !d(n)) return "get" == t && void 0;var r = this._c[t](0 === n ? 0 : n, i);return e ? this : r;
        });
      }), "size" in _ && h(x.prototype, "size", { get: function () {
          return this._c.size;
        } })) : (x = v.getConstructor(e, t, y, C), l(x.prototype, n), a.NEED = !0), f(x, t), S[t] = x, r(r.G + r.W + r.F, S), g || v.setStrong(x, t, y), x;
    };
  }, function (t, e, n) {
    var i = n(20),
        r = n(54),
        a = n(31);t.exports = function (t) {
      var e = i(t),
          n = r.f;if (n) for (var o, s = n(t), l = a.f, u = 0; s.length > u;) l.call(t, o = s[u++]) && e.push(o);return e;
    };
  }, function (t, e, n) {
    t.exports = n(7).document && document.documentElement;
  }, function (t, e, n) {
    var i = n(19),
        r = n(4)("iterator"),
        a = Array.prototype;t.exports = function (t) {
      return void 0 !== t && (i.Array === t || a[r] === t);
    };
  }, function (t, e, n) {
    var i = n(12);t.exports = function (t, e, n, r) {
      try {
        return r ? e(i(n)[0], n[1]) : e(n);
      } catch (e) {
        var a = t.return;throw void 0 !== a && i(a.call(t)), e;
      }
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(53),
        r = n(32),
        a = n(33),
        o = {};n(10)(o, n(4)("iterator"), function () {
      return this;
    }), t.exports = function (t, e, n) {
      t.prototype = i(o, { next: r(1, n) }), a(t, e + " Iterator");
    };
  }, function (t, e, n) {
    var i = n(20),
        r = n(16);t.exports = function (t, e) {
      for (var n, a = r(t), o = i(a), s = o.length, l = 0; s > l;) if (a[n = o[l++]] === e) return n;
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(20),
        r = n(54),
        a = n(31),
        o = n(34),
        s = n(49),
        l = Object.assign;t.exports = !l || n(14)(function () {
      var t = {},
          e = {},
          n = Symbol(),
          i = "abcdefghijklmnopqrst";return t[n] = 7, i.split("").forEach(function (t) {
        e[t] = t;
      }), 7 != l({}, t)[n] || Object.keys(l({}, e)).join("") != i;
    }) ? function (t, e) {
      for (var n = o(t), l = arguments.length, u = 1, c = r.f, d = a.f; l > u;) for (var f, h = s(arguments[u++]), p = c ? i(h).concat(c(h)) : i(h), m = p.length, v = 0; m > v;) d.call(h, f = p[v++]) && (n[f] = h[f]);return n;
    } : l;
  }, function (t, e, n) {
    var i = n(8),
        r = n(12),
        a = n(20);t.exports = n(6) ? Object.defineProperties : function (t, e) {
      r(t);for (var n, o = a(e), s = o.length, l = 0; s > l;) i.f(t, n = o[l++], e[n]);return t;
    };
  }, function (t, e, n) {
    var i = n(31),
        r = n(32),
        a = n(16),
        o = n(59),
        s = n(15),
        l = n(79),
        u = Object.getOwnPropertyDescriptor;e.f = n(6) ? u : function (t, e) {
      if (t = a(t), e = o(e, !0), l) try {
        return u(t, e);
      } catch (t) {}if (s(t, e)) return r(!i.f.call(t, e), t[e]);
    };
  }, function (t, e, n) {
    var i = n(16),
        r = n(82).f,
        a = {}.toString,
        o = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],
        s = function (t) {
      try {
        return r(t);
      } catch (t) {
        return o.slice();
      }
    };t.exports.f = function (t) {
      return o && "[object Window]" == a.call(t) ? s(t) : r(i(t));
    };
  }, function (t, e, n) {
    var i = n(15),
        r = n(34),
        a = n(55)("IE_PROTO"),
        o = Object.prototype;t.exports = Object.getPrototypeOf || function (t) {
      return t = r(t), i(t, a) ? t[a] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? o : null;
    };
  }, function (t, e, n) {
    var i = n(13),
        r = n(3),
        a = n(14);t.exports = function (t, e) {
      var n = (r.Object || {})[t] || Object[t],
          o = {};o[t] = e(n), i(i.S + i.F * a(function () {
        n(1);
      }), "Object", o);
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(7),
        r = n(3),
        a = n(8),
        o = n(6),
        s = n(4)("species");t.exports = function (t) {
      var e = "function" == typeof r[t] ? r[t] : i[t];o && e && !e[s] && a.f(e, s, { configurable: !0, get: function () {
          return this;
        } });
    };
  }, function (t, e, n) {
    var i = n(57),
        r = n(30);t.exports = function (t) {
      return function (e, n) {
        var a,
            o,
            s = String(r(e)),
            l = i(n),
            u = s.length;return l < 0 || l >= u ? t ? "" : void 0 : (a = s.charCodeAt(l), a < 55296 || a > 56319 || l + 1 === u || (o = s.charCodeAt(l + 1)) < 56320 || o > 57343 ? t ? s.charAt(l) : a : t ? s.slice(l, l + 2) : o - 56320 + (a - 55296 << 10) + 65536);
      };
    };
  }, function (t, e, n) {
    var i = n(57),
        r = Math.max,
        a = Math.min;t.exports = function (t, e) {
      return t = i(t), t < 0 ? r(t + e, 0) : a(t, e);
    };
  }, function (t, e, n) {
    var i = n(12),
        r = n(86);t.exports = n(3).getIterator = function (t) {
      var e = r(t);if ("function" != typeof e) throw TypeError(t + " is not iterable!");return i(e.call(t));
    };
  }, function (t, e, n) {
    var i = n(45),
        r = n(4)("iterator"),
        a = n(19);t.exports = n(3).isIterable = function (t) {
      var e = Object(t);return void 0 !== e[r] || "@@iterator" in e || a.hasOwnProperty(i(e));
    };
  }, function (t, e, n) {
    "use strict";
    var i = n(265),
        r = n(81),
        a = n(19),
        o = n(16);t.exports = n(50)(Array, "Array", function (t, e) {
      this._t = o(t), this._i = 0, this._k = e;
    }, function () {
      var t = this._t,
          e = this._k,
          n = this._i++;return !t || n >= t.length ? (this._t = void 0, r(1)) : "keys" == e ? r(0, n) : "values" == e ? r(0, t[n]) : r(0, [n, t[n]]);
    }, "values"), a.Arguments = a.Array, i("keys"), i("values"), i("entries");
  }, function (t, e, n) {
    var i = n(13);i(i.S + i.F, "Object", { assign: n(280) });
  }, function (t, e, n) {
    var i = n(13);i(i.S + i.F * !n(6), "Object", { defineProperty: n(8).f });
  }, function (t, e, n) {
    var i = n(34),
        r = n(20);n(285)("keys", function () {
      return function (t) {
        return r(i(t));
      };
    });
  }, function (t, e, n) {
    "use strict";
    var i = n(271);t.exports = n(273)("Set", function (t) {
      return function () {
        return t(this, arguments.length > 0 ? arguments[0] : void 0);
      };
    }, { add: function (t) {
        return i.def(this, t = 0 === t ? 0 : t, t);
      } }, i);
  }, function (t, e, n) {
    "use strict";
    var i = n(7),
        r = n(15),
        a = n(6),
        o = n(13),
        s = n(85),
        l = n(52).KEY,
        u = n(14),
        c = n(56),
        d = n(33),
        f = n(35),
        h = n(4),
        p = n(61),
        m = n(60),
        v = n(279),
        y = n(274),
        g = n(80),
        b = n(12),
        x = n(16),
        C = n(59),
        _ = n(32),
        S = n(53),
        w = n(283),
        k = n(282),
        $ = n(8),
        O = n(20),
        T = k.f,
        M = $.f,
        D = w.f,
        F = i.Symbol,
        E = i.JSON,
        P = E && E.stringify,
        A = "prototype",
        j = h("_hidden"),
        B = h("toPrimitive"),
        R = {}.propertyIsEnumerable,
        I = c("symbol-registry"),
        L = c("symbols"),
        z = c("op-symbols"),
        N = Object[A],
        H = "function" == typeof F,
        W = i.QObject,
        V = !W || !W[A] || !W[A].findChild,
        Y = a && u(function () {
      return 7 != S(M({}, "a", { get: function () {
          return M(this, "a", { value: 7 }).a;
        } })).a;
    }) ? function (t, e, n) {
      var i = T(N, e);i && delete N[e], M(t, e, n), i && t !== N && M(N, e, i);
    } : M,
        K = function (t) {
      var e = L[t] = S(F[A]);return e._k = t, e;
    },
        G = H && "symbol" == typeof F.iterator ? function (t) {
      return "symbol" == typeof t;
    } : function (t) {
      return t instanceof F;
    },
        X = function (t, e, n) {
      return t === N && X(z, e, n), b(t), e = C(e, !0), b(n), r(L, e) ? (n.enumerable ? (r(t, j) && t[j][e] && (t[j][e] = !1), n = S(n, { enumerable: _(0, !1) })) : (r(t, j) || M(t, j, _(1, {})), t[j][e] = !0), Y(t, e, n)) : M(t, e, n);
    },
        U = function (t, e) {
      b(t);for (var n, i = y(e = x(e)), r = 0, a = i.length; a > r;) X(t, n = i[r++], e[n]);return t;
    },
        q = function (t, e) {
      return void 0 === e ? S(t) : U(S(t), e);
    },
        Z = function (t) {
      var e = R.call(this, t = C(t, !0));return !(this === N && r(L, t) && !r(z, t)) && (!(e || !r(this, t) || !r(L, t) || r(this, j) && this[j][t]) || e);
    },
        J = function (t, e) {
      if (t = x(t), e = C(e, !0), t !== N || !r(L, e) || r(z, e)) {
        var n = T(t, e);return !n || !r(L, e) || r(t, j) && t[j][e] || (n.enumerable = !0), n;
      }
    },
        Q = function (t) {
      for (var e, n = D(x(t)), i = [], a = 0; n.length > a;) r(L, e = n[a++]) || e == j || e == l || i.push(e);return i;
    },
        tt = function (t) {
      for (var e, n = t === N, i = D(n ? z : x(t)), a = [], o = 0; i.length > o;) !r(L, e = i[o++]) || n && !r(N, e) || a.push(L[e]);return a;
    };H || (F = function () {
      if (this instanceof F) throw TypeError("Symbol is not a constructor!");var t = f(arguments.length > 0 ? arguments[0] : void 0),
          e = function (n) {
        this === N && e.call(z, n), r(this, j) && r(this[j], t) && (this[j][t] = !1), Y(this, t, _(1, n));
      };return a && V && Y(N, t, { configurable: !0, set: e }), K(t);
    }, s(F[A], "toString", function () {
      return this._k;
    }), k.f = J, $.f = X, n(82).f = w.f = Q, n(31).f = Z, n(54).f = tt, a && !n(51) && s(N, "propertyIsEnumerable", Z, !0), p.f = function (t) {
      return K(h(t));
    }), o(o.G + o.W + o.F * !H, { Symbol: F });for (var et = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), nt = 0; et.length > nt;) h(et[nt++]);for (var et = O(h.store), nt = 0; et.length > nt;) m(et[nt++]);o(o.S + o.F * !H, "Symbol", { for: function (t) {
        return r(I, t += "") ? I[t] : I[t] = F(t);
      }, keyFor: function (t) {
        if (G(t)) return v(I, t);throw TypeError(t + " is not a symbol!");
      }, useSetter: function () {
        V = !0;
      }, useSimple: function () {
        V = !1;
      } }), o(o.S + o.F * !H, "Object", { create: q, defineProperty: X, defineProperties: U, getOwnPropertyDescriptor: J, getOwnPropertyNames: Q, getOwnPropertySymbols: tt }), E && o(o.S + o.F * (!H || u(function () {
      var t = F();return "[null]" != P([t]) || "{}" != P({ a: t }) || "{}" != P(Object(t));
    })), "JSON", { stringify: function (t) {
        if (void 0 !== t && !G(t)) {
          for (var e, n, i = [t], r = 1; arguments.length > r;) i.push(arguments[r++]);return e = i[1], "function" == typeof e && (n = e), !n && g(e) || (e = function (t, e) {
            if (n && (e = n.call(this, t, e)), !G(e)) return e;
          }), i[1] = e, P.apply(E, i);
        }
      } }), F[A][B] || n(10)(F[A], B, F[A].valueOf), d(F, "Symbol"), d(Math, "Math", !0), d(i.JSON, "JSON", !0);
  }, function (t, e, n) {
    var i = n(13);i(i.P + i.R, "Set", { toJSON: n(272)("Set") });
  }, function (t, e, n) {
    n(60)("asyncIterator");
  }, function (t, e, n) {
    n(60)("observable");
  }, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e) {}, function (t, e, n) {
    n(308);var i = n(0)(n(144), n(493), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(327);var i = n(0)(n(145), n(514), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(326);var i = n(0)(n(146), n(513), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(373);var i = n(0)(n(147), n(555), "data-v-7fd436bc", null);t.exports = i.exports;
  }, function (t, e, n) {
    n(329);var i = n(0)(n(148), n(516), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(353);var i = n(0)(n(149), null, null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(316);var i = n(0)(n(150), n(503), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(370);var i = n(0)(n(151), n(552), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    var i = n(0)(n(152), n(574), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(357);var i = n(0)(n(153), n(540), "data-v-64be4c11", null);t.exports = i.exports;
  }, function (t, e, n) {
    n(379);var i = n(0)(n(154), n(561), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(339);var i = n(0)(n(155), n(525), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(309);var i = n(0)(n(156), n(494), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(347);var i = n(0)(n(157), n(532), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(396);var i = n(0)(n(158), n(581), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(348);var i = n(0)(n(159), n(533), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(333);var i = n(0)(n(160), n(519), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(394);var i = n(0)(n(161), n(579), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(368);var i = n(0)(n(162), n(550), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(365);var i = n(0)(n(163), n(548), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(332);var i = n(0)(n(164), n(518), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(318);var i = n(0)(n(165), n(505), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(374);var i = n(0)(n(166), n(556), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(382);var i = n(0)(n(167), n(564), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(371);var i = n(0)(n(168), n(553), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(364);var i = n(0)(n(169), n(547), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(321);var i = n(0)(n(170), null, null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(366);var i = n(0)(n(171), null, null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(317);var i = n(0)(n(172), n(504), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(351);var i = n(0)(n(173), n(536), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(352);var i = n(0)(n(174), n(537), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(331);var i = n(0)(n(175), n(517), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(313);var i = n(0)(n(176), n(499), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(383);var i = n(0)(n(177), n(565), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(367);var i = n(0)(n(178), n(549), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    var i = n(0)(n(179), n(566), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(380);var i = n(0)(n(180), n(562), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    var i = n(0)(n(181), n(502), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    var i = n(0)(n(182), n(495), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(384);var i = n(0)(n(183), n(567), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(354);var i = n(0)(n(184), n(538), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(306);var i = n(0)(n(185), null, null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(360);var i = n(0)(n(186), n(543), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(314);var i = n(0)(n(187), n(500), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(361);var i = n(0)(n(188), n(544), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(391);var i = n(0)(n(189), n(576), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(335);var i = n(0)(n(195), n(521), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(395);var i = n(0)(n(197), n(580), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(320);var i = n(0)(n(200), n(507), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(304);var i = n(0)(n(201), n(490), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(355);var i = n(0)(n(202), n(539), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(310);var i = n(0)(n(203), n(496), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(363);var i = n(0)(n(204), n(546), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(378);var i = n(0)(n(205), n(560), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(345);var i = n(0)(n(206), n(530), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(303);var i = n(0)(n(207), n(489), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(334);var i = n(0)(n(208), n(520), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(377);var i = n(0)(n(209), n(559), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(338);var i = n(0)(n(210), n(524), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(393);var i = n(0)(n(211), n(578), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(376);var i = n(0)(n(212), n(558), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(344);var i = n(0)(n(213), null, null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(359);var i = n(0)(n(214), n(542), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(350);var i = n(0)(n(215), n(535), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(301);var i = n(0)(n(216), n(487), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(389);var i = n(0)(n(218), null, null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(307);var i = n(0)(n(219), n(492), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(346);var i = n(0)(n(220), n(531), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(341);var i = n(0)(n(221), n(527), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    var i = n(0)(n(222), n(512), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    var i = n(0)(n(224), n(573), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(337);var i = n(0)(n(226), n(523), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(385);var i = n(0)(n(227), n(568), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(336);var i = n(0)(n(228), n(522), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(349);var i = n(0)(n(229), n(534), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(387);var i = n(0)(n(230), n(570), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(358);var i = n(0)(n(231), n(541), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(392);var i = n(0)(n(232), n(577), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(315);var i = n(0)(n(233), n(501), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(325);var i = n(0)(n(234), n(511), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    var i = n(0)(n(235), n(572), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(311);var i = n(0)(n(236), n(497), "data-v-10c9b411", null);t.exports = i.exports;
  }, function (t, e, n) {
    n(323);var i = n(0)(n(237), n(509), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(342);var i = n(0)(n(238), n(528), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(381);var i = n(0)(n(239), n(563), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(302);var i = n(0)(n(242), n(488), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(324);var i = n(0)(n(243), n(510), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(330);var i = n(0)(n(244), null, null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(375);var i = n(0)(n(245), n(557), null, null);t.exports = i.exports;
  }, function (t, e, n) {
    n(312);var i = n(0)(n(246), n(498), null, null);t.exports = i.exports;
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-step-content", class: { last: t.last } }, [n("div", { staticStyle: { position: "relative", overflow: "hidden", height: "100%" } }, [n("expand-transition", [t.active ? n("div", { ref: "inner", staticClass: "mu-step-content-inner" }, [t._t("default")], 2) : t._e()])], 1)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-time-display" }, [n("div", { staticClass: "mu-time-display-text" }, [n("div", { staticClass: "mu-time-display-affix" }), t._v(" "), n("div", { staticClass: "mu-time-display-time" }, [n("span", { staticClass: "mu-time-display-clickable", class: { inactive: "minute" === t.mode }, on: { click: t.handleSelectHour } }, [t._v(t._s(t.sanitizeTime[0]))]), t._v(" "), n("span", [t._v(":")]), t._v(" "), n("span", { staticClass: "mu-time-display-clickable", class: { inactive: "hour" === t.mode }, on: { click: t.handleSelectMin } }, [t._v(t._s(t.sanitizeTime[1]))])]), t._v(" "), n("div", { staticClass: "mu-time-display-affix" }, ["ampm" === t.format ? n("div", { staticClass: "mu-time-display-clickable", class: { inactive: "am" === t.affix }, on: { click: function (e) {
              t.handleSelectAffix("pm");
            } } }, [t._v("\n        PM\n      ")]) : t._e(), t._v(" "), "ampm" === t.format ? n("div", { staticClass: "mu-time-display-clickable mu-time-display-affix-top", class: { inactive: "pm" === t.affix }, on: { click: function (e) {
              t.handleSelectAffix("am");
            } } }, [t._v("\n        AM\n      ")]) : t._e()])])]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("label", { staticClass: "mu-radio", class: { "label-left": t.labelLeft, disabled: t.disabled, "no-label": !t.label }, on: { mousedown: t.handleMouseDown, mouseleave: t.handleMouseLeave, mouseup: t.handleMouseUp, touchstart: t.handleTouchStart, touchend: t.handleTouchEnd, touchcancel: t.handleTouchEnd, click: function (e) {
              e.stopPropagation(), t.handleClick(e);
            } } }, [n("input", { directives: [{ name: "model", rawName: "v-model", value: t.inputValue, expression: "inputValue" }], attrs: { type: "radio", disabled: t.disabled, name: t.name }, domProps: { value: t.nativeValue, checked: t._q(t.inputValue, t.nativeValue) }, on: { change: t.handleChange, __c: function (e) {
              t.inputValue = t.nativeValue;
            } } }), t._v(" "), t.disabled ? t._e() : n("touch-ripple", { staticClass: "mu-radio-wrapper", attrs: { rippleWrapperClass: "mu-radio-ripple-wrapper" } }, [t.label && t.labelLeft ? n("div", { staticClass: "mu-radio-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e(), t._v(" "), n("div", { staticClass: "mu-radio-icon" }, [t.checkedIcon ? t._e() : n("svg", { staticClass: "mu-radio-icon-uncheck mu-radio-svg-icon", class: t.iconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" } })]), t._v(" "), t.uncheckIcon ? t._e() : n("svg", { staticClass: "mu-radio-icon-checked mu-radio-svg-icon", class: t.iconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" } })]), t._v(" "), t.uncheckIcon ? n("icon", { staticClass: "mu-radio-icon-uncheck", class: t.iconClass, attrs: { value: t.uncheckIcon } }) : t._e(), t._v(" "), t.checkedIcon ? n("icon", { staticClass: "mu-radio-icon-checked", class: t.iconClass, attrs: { value: t.checkedIcon } }) : t._e()], 1), t._v(" "), t.label && !t.labelLeft ? n("div", { staticClass: "mu-radio-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e()]), t._v(" "), t.disabled ? n("div", { staticClass: "mu-radio-wrapper" }, [t.label && t.labelLeft ? n("div", { staticClass: "mu-radio-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e(), t._v(" "), n("div", { staticClass: "mu-radio-icon" }, [t.checkedIcon ? t._e() : n("svg", { staticClass: "mu-radio-icon-uncheck mu-radio-svg-icon", class: t.iconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" } })]), t._v(" "), t.uncheckIcon ? t._e() : n("svg", { staticClass: "mu-radio-icon-checked mu-radio-svg-icon", class: t.iconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" } })]), t._v(" "), t.uncheckIcon ? n("icon", { staticClass: "mu-radio-icon-uncheck", class: t.iconClass, attrs: { value: t.uncheckIcon } }) : t._e(), t._v(" "), t.checkedIcon ? n("icon", { staticClass: "mu-radio-icon-checked", class: t.iconClass, attrs: { value: t.checkedIcon } }) : t._e()], 1), t._v(" "), t.label && !t.labelLeft ? n("div", { staticClass: "mu-radio-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e()]) : t._e()], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return t.total ? n("div", { staticClass: "mu-pagination" }, [n("page-item", { attrs: { identifier: "singleBack", disabled: t.leftDisabled }, on: { click: t.handleClick } }, [n("svg", { staticClass: "mu-pagination-svg-icon", attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" } })])]), t._v(" "), n("page-item", { attrs: { index: 1, isActive: 1 === t.actualCurrent }, on: { click: t.handleClick } }), t._v(" "), t.totalPageCount > 5 && t.actualCurrent - 1 >= 4 ? n("page-item", { attrs: { identifier: "backs", title: "前5页" }, on: { click: t.handleClick } }, [n("span", [t._v("...")])]) : t._e(), t._v(" "), t._l(t.pageList, function (e) {
          return n("page-item", { key: e, attrs: { index: e, isActive: t.actualCurrent === e }, on: { click: t.handleClick } });
        }), t._v(" "), t.totalPageCount > 5 && t.totalPageCount - t.actualCurrent >= 4 ? n("page-item", { attrs: { identifier: "forwards", title: "后5页" }, on: { click: t.handleClick } }, [n("span", [t._v("...")])]) : t._e(), t._v(" "), 1 !== t.totalPageCount ? n("page-item", { attrs: { index: t.totalPageCount, isActive: t.actualCurrent === t.totalPageCount }, on: { click: t.handleClick } }) : t._e(), t._v(" "), n("page-item", { attrs: { identifier: "singleForward", disabled: t.rightDisabled }, on: { click: t.handleClick } }, [n("svg", { staticClass: "mu-pagination-svg-icon", attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" } })])]), t._v(" "), t.showSizeChanger ? n("select-field", { style: { width: "100px" }, model: { value: t.actualPageSize, callback: function (e) {
              t.actualPageSize = e;
            }, expression: "actualPageSize" } }, t._l(t.pageSizeOption, function (e) {
          return n("menu-item", { key: "mt_" + e, style: { width: "100px" }, attrs: { value: e, title: e + t.pageSizeChangerText } });
        })) : t._e()], 2) : t._e();
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("transition", { attrs: { name: "mu-expand" }, on: { "before-enter": t.beforeEnter, enter: t.enter, "after-enter": t.afterEnter, "before-leave": t.beforeLeave, leave: t.leave, "after-leave": t.afterLeave } }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-sub-header", class: { inset: t.inset } }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-appbar", class: ["mu-paper-" + t.zDepth] }, [n("div", { staticClass: "left" }, [t._t("left")], 2), t._v(" "), n("div", { staticClass: "mu-appbar-title", class: t.titleClass }, [t._t("default", [n("span", [t._v(t._s(t.title))])])], 2), t._v(" "), n("div", { staticClass: "right" }, [t._t("right")], 2)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-card-header" }, [t._t("avatar"), t._v(" "), t.title || t.subTitle ? n("div", { staticClass: "mu-card-header-title" }, [n("div", { staticClass: "mu-card-title", class: t.titleClass }, [t._v("\n      " + t._s(t.title) + "\n    ")]), t._v(" "), n("div", { staticClass: "mu-card-sub-title", class: t.subTitleClass }, [t._v("\n      " + t._s(t.subTitle) + "\n    ")])]) : t._e(), t._v(" "), t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "row", class: { "no-gutter": !t.gutter } }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-picker-slot", class: { "mu-picker-slot-divider": t.divider }, style: { width: t.width } }, [t.divider ? t._e() : n("div", { ref: "wrapper", staticClass: "mu-picker-slot-wrapper", class: { animate: t.animate }, style: { height: t.contentHeight + "px" } }, t._l(t.values, function (e, i) {
          return n("div", { key: i, staticClass: "mu-picker-item", class: { selected: e === t.value }, style: { "text-align": t.textAlign } }, [t._v(t._s(e.text || e))]);
        })), t._v(" "), t.divider ? n("div", [t._v(t._s(t.content))]) : t._e()]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-timeline-item" }, [t.last ? t._e() : n("div", { staticClass: "mu-timeline-item-line", style: t.lineStyle }), t._v(" "), n("div", { staticClass: "mu-timeline-item-icon" }, [t._t("icon", [n("div", { style: t.iconStyle })])], 2), t._v(" "), n("div", { staticClass: "mu-timeline-item-content", style: t.contentStyle }, [t._t("default", [n("div", { staticClass: "mu-timeline-item-time" }, [t._t("time")], 2), t._v(" "), n("div", { staticClass: "mu-timeline-item-des" }, [t._t("des")], 2)])], 2)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-tooltip", class: { touched: t.touch, "when-shown": t.show }, style: t.tooltipStyle }, [n("div", { ref: "ripple", staticClass: "mu-tooltip-ripple", class: { "when-shown": t.show }, style: t.rippleStyle }), t._v(" "), n("span", { staticClass: "mu-tooltip-label" }, [t._v(t._s(t.label))])]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-dropDown-menu", class: { disabled: t.disabled } }, [n("svg", { staticClass: "mu-dropDown-menu-icon", class: t.iconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M7 10l5 5 5-5z" } })]), t._v(" "), n("div", { staticClass: "mu-dropDown-menu-text", class: t.labelClass, on: { click: t.handleOpen } }, [n("div", { staticClass: "mu-dropDown-menu-text-overflow" }, [t._v(t._s(t.label))])]), t._v(" "), n("div", { staticClass: "mu-dropDown-menu-line", class: t.underlineClass }), t._v(" "), !t.disabled && t.$slots && t.$slots.default && t.$slots.default.length > 0 ? n("popover", { attrs: { scroller: t.scroller, open: t.openMenu, trigger: t.trigger, anchorOrigin: t.anchorOrigin }, on: { close: t.handleClose } }, [n("mu-menu", { class: t.menuClass, style: { width: t.menuWidth + "px" }, attrs: { listClass: t.menuListClass, value: t.value, multiple: t.multiple, autoWidth: t.autoWidth, popover: t.openMenu, desktop: "", maxHeight: t.maxHeight }, on: { change: t.change, itemClick: t.itemClick } }, [t._t("default")], 2)], 1) : t._e()], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-icon-menu" }, [n("icon-button", { attrs: { tooltip: t.tooltip, tooltipPosition: t.tooltipPosition, icon: t.icon, iconClass: t.iconClass }, on: { click: t.handleOpen } }, [t._t("icon")], 2), t._v(" "), t.$slots && t.$slots.default && t.$slots.default.length > 0 ? n("popover", { attrs: { open: t.openMenu, trigger: t.trigger, scroller: t.scroller, anchorOrigin: t.anchorOrigin, targetOrigin: t.targetOrigin }, on: { close: t.handleClose } }, [n("mu-menu", { class: t.menuClass, attrs: { popover: t.openMenu, value: t.value, listClass: t.menuListClass, multiple: t.multiple, desktop: t.desktop, maxHeight: t.maxHeight }, on: { change: t.change, itemClick: t.itemClick } }, [t._t("default")], 2)], 1) : t._e()], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-text-field-label", class: t.labelClass }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "col", class: t.classObj }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("abstract-button", { staticClass: "mu-buttom-item", class: { "mu-bottom-item-active": t.active }, attrs: { href: t.href, to: t.to, tag: t.tag, activeClass: t.activeClass, event: t.event, exact: t.exact, append: t.append, replace: t.replace, disableTouchRipple: t.shift, "center-ripple": !1, wrapperClass: "mu-buttom-item-wrapper" }, nativeOn: { click: function (e) {
              t.handleClick(e);
            } } }, [t.icon ? n("icon", { staticClass: "mu-bottom-item-icon", class: t.iconClass, attrs: { value: t.icon } }) : t._e(), t._v(" "), t._t("default"), t._v(" "), t.title ? n("span", { staticClass: "mu-bottom-item-text", class: t.titleClass }, [t._v(t._s(t.title))]) : t._e()], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("button", { staticClass: "mu-year-button", class: { selected: t.selected, hover: t.hover }, on: { click: t.handleClick, mouseenter: t.handleHover, mouseleave: t.handleHoverExit } }, [n("span", { staticClass: "mu-year-button-text" }, [t._v(t._s(t.year))])]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-calendar-monthday-content" }, t._l(t.weeksArray, function (e, i) {
          return n("div", { key: i, staticClass: "mu-calendar-monthday-row" }, t._l(e, function (e, r) {
            return n("day-button", { key: "dayButton" + i + r, attrs: { disabled: t.isDisableDate(e), selected: t.equalsDate(e), date: e }, on: { click: function (n) {
                  t.handleClick(e);
                } } });
          }));
        }));
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", [n("abstract-button", { ref: "button", staticClass: "mu-menu-item-wrapper", class: { active: t.active }, attrs: { href: t.href, target: t.target, centerRipple: !1, to: t.to, tag: t.tag, activeClass: t.activeClass, event: t.event, exact: t.exact, append: t.append, replace: t.replace, disableFocusRipple: t.disableFocusRipple, disabled: t.disabled, containerElement: "div" }, on: { click: t.handleClick, keyboardFocus: t.handleKeyboardFocus, hover: t.handleHover, hoverExit: t.handleHoverExit } }, [n("div", { staticClass: "mu-menu-item", class: { "have-left-icon": t.leftIcon || t.inset } }, [n("icon", { staticClass: "mu-menu-item-left-icon", class: t.leftIconClass, style: { color: t.filterColor(t.leftIconColor) }, attrs: { value: t.leftIcon } }), t._v(" "), n("div", { staticClass: "mu-menu-item-title", class: t.titleClass }, [t._t("title", [t._v("\n           " + t._s(t.title) + "\n         ")])], 2), t._v(" "), t.rightIcon ? t._e() : n("div", [t.showAfterText ? n("span", { class: t.afterTextClass }, [t._v(t._s(t.afterText))]) : t._e(), t._v(" "), t._t("after")], 2), t._v(" "), n("icon", { staticClass: "mu-menu-item-right-icon", class: t.rightIconClass, style: { color: t.filterColor(t.rightIconColor) }, attrs: { value: t.rightIcon } })], 1)]), t._v(" "), t.$slots && t.$slots.default && t.$slots.default.length > 0 ? n("popover", { attrs: { open: t.openMenu, anchorOrigin: { vertical: "top", horizontal: "right" }, trigger: t.trigger }, on: { close: t.close } }, [t.openMenu ? n("mu-menu", { class: t.nestedMenuClass, attrs: { desktop: t.$parent.desktop, popover: "", listClass: t.nestedMenuListClass, maxHeight: t.$parent.maxHeight, value: t.nestedMenuValue } }, [t._t("default")], 2) : t._e()], 1) : t._e()], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("abstract-button", { staticClass: "mu-pagination-item", class: { circle: t.isCircle, active: t.isActive }, attrs: { wrapperClass: "mu-pagination-item-wrapper", centerRipple: !1, disabled: t.disabled, containerElement: "div" }, on: { click: t.handleClick, hover: t.handleHover, hoverExit: t.handleHoverExit } }, [t.index ? n("span", [t._v(t._s(t.index))]) : t._e(), t._v(" "), t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { on: { mousedown: t.handleMouseDown, mouseup: function (e) {
              t.end();
            }, mouseleave: function (e) {
              t.end();
            }, touchstart: t.handleTouchStart, touchend: function (e) {
              t.end();
            }, touchcancel: function (e) {
              t.end();
            } } }, [n("div", { ref: "holder", staticClass: "mu-ripple-wrapper", class: t.rippleWrapperClass }, t._l(t.ripples, function (t) {
          return n("circle-ripple", { key: t.key, attrs: { color: t.color, opacity: t.opacity, "merge-style": t.style } });
        })), t._v(" "), t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-clock", class: { "mu-clock-landspace": t.landscape } }, [n("time-display", { attrs: { selectedTime: t.selectedTime, format: t.format, mode: t.mode, affix: t.getAffix() }, on: { selectMin: function (e) {
              t.mode = "minute";
            }, selectHour: function (e) {
              t.mode = "hour";
            }, selectAffix: t.handleSelectAffix } }), t._v(" "), n("div", { staticClass: "mu-clock-container" }, [n("div", { staticClass: "mu-clock-circle" }), t._v(" "), "hour" === t.mode ? n("clock-hours", { attrs: { format: t.format, initialHours: t.selectedTime.getHours() }, on: { change: t.handleChangeHours } }) : t._e(), t._v(" "), "minute" === t.mode ? n("clock-minutes", { attrs: { initialMinutes: t.selectedTime.getMinutes() }, on: { change: t.handleChangeMinutes } }) : t._e(), t._v(" "), n("div", { staticClass: "mu-clock-actions" }, [n("flat-button", { attrs: { label: t.cancelLabel, primary: "" }, on: { click: t.dismiss } }), t._v(" "), n("flat-button", { attrs: { label: t.okLabel, primary: "" }, on: { click: t.accept } })], 1)], 1)], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-time-picker", class: { fullWidth: t.fullWidth } }, [n("text-field", { attrs: { name: t.name, value: t.inputValue, fullWidth: t.fullWidth, inputClass: t.inputClass, label: t.label, labelFloat: t.labelFloat, labelClass: t.labelClass, labelFocusClass: t.labelFocusClass, hintText: t.hintText, hintTextClass: t.hintTextClass, helpText: t.helpText, helpTextClass: t.helpTextClass, disabled: t.disabled, errorText: t.errorText, errorColor: t.errorColor, icon: t.icon, iconClass: t.iconClass, underlineShow: t.underlineShow, underlineClass: t.underlineClass, underlineFocusClass: t.underlineFocusClass }, on: { focus: t.handleFocus, labelClick: t.handleClick } }), t._v(" "), t.disabled ? t._e() : n("time-picker-dialog", { ref: "dialog", attrs: { initialTime: t.dialogTime, format: t.format, mode: t.mode, container: t.container, autoOk: t.autoOk, okLabel: t.okLabel, cancelLabel: t.cancelLabel }, on: { accept: t.handleAccept } })], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", [n("hr", { staticClass: "mu-text-field-line", class: t.lineClass }), t._v(" "), t.disabled ? t._e() : n("hr", { staticClass: "mu-text-field-focus-line", class: t.focusLineClass, style: t.errorStyle })]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("tbody", [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-avatar", style: t.avatarStyle, on: { click: t.handleClick } }, [n("div", { staticClass: "mu-avatar-inner" }, [t.icon ? n("icon", { class: t.iconClass, attrs: { value: t.icon, size: t.iconSize } }) : t._e(), t._v(" "), t.src ? n("img", { class: t.imgClass, attrs: { src: t.src } }) : t._e(), t._v(" "), t._t("default")], 2)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-auto-complete", class: { fullWidth: t.fullWidth } }, [n("text-field", { ref: "textField", attrs: { value: t.searchText, disabled: t.disabled, inputClass: t.inputClass, label: t.label, labelFloat: t.labelFloat, labelClass: t.labelClass, labelFocusClass: t.labelFocusClass, hintText: t.hintText, hintTextClass: t.hintTextClass, helpText: t.helpText, helpTextClass: t.helpTextClass, errorText: t.errorText, errorColor: t.errorColor, icon: t.icon, iconClass: t.iconClass, fullWidth: t.fullWidth, underlineShow: t.underlineShow, underlineClass: t.underlineClass, underlineFocusClass: t.underlineFocusClass }, on: { focus: t.handleFocus, input: t.handleInput, blur: t.handleBlur }, nativeOn: { keydown: function (e) {
              t.handleKeyDown(e);
            } }, model: { value: t.searchText, callback: function (e) {
              t.searchText = e;
            }, expression: "searchText" } }), t._v(" "), n("popover", { attrs: { overlay: !1, autoPosition: !1, scroller: t.scroller, open: t.open && t.list.length > 0, trigger: t.anchorEl, anchorOrigin: t.anchorOrigin, targetOrigin: t.targetOrigin }, on: { close: t.handleClose } }, [t.open ? n("mu-menu", { ref: "menu", staticClass: "mu-auto-complete-menu", style: { width: (t.menuWidth && t.menuWidth > t.inputWidth ? t.menuWidth : t.inputWidth) + "px" }, attrs: { maxHeight: t.maxHeight, disableAutoFocus: t.focusTextField, initiallyKeyboardFocused: "", autoWidth: !1 }, on: { itemClick: t.handleItemClick }, nativeOn: { mousedown: function (e) {
              t.handleMouseDown(e);
            } } }, t._l(t.list, function (e, i) {
          return n("menu-item", { key: "auto_" + i, staticClass: "mu-auto-complete-menu-item", attrs: { disableFocusRipple: t.disableFocusRipple, afterText: "", leftIcon: e.leftIcon, leftIconColor: e.leftIconColor, rightIconColor: e.rightIconColor, rightIcon: e.rightIcon, value: e.value, title: e.text }, nativeOn: { mousedown: function (e) {
                t.handleMouseDown(e);
              } } });
        })) : t._e()], 1)], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { directives: [{ name: "clickoutside", rawName: "v-clickoutside", value: t.clickoutside, expression: "clickoutside" }], staticClass: "mu-menu", style: { width: t.contentWidth }, attrs: { tabindex: "0" }, on: { keydown: t.handleKeydown } }, [n("div", { ref: "list", staticClass: "mu-menu-list", class: t.menuListClass, style: { width: t.contentWidth, "max-height": t.maxHeight + "px" } }, [t._t("default")], 2)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-badge-container" }, [t._t("default"), t._v(" "), n("em", { staticClass: "mu-badge", class: t.badgeInternalClass, style: t.badgeStyle }, [t._t("content", [t._v("\n      " + t._s(t.content) + "\n    ")])], 2)], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("paper", { staticClass: "mu-drawer", class: { open: t.open, right: t.right }, style: t.drawerStyle, attrs: { zDepth: t.zDepth } }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-calendar", class: { "mu-calendar-landspace": "landscape" === t.mode } }, [n("date-display", { attrs: { monthDaySelected: t.displayMonthDay, disableYearSelection: t.disableYearSelection, selectedDate: t.selectedDate, dateTimeFormat: t.dateTimeFormat }, on: { selectYear: t.selectYear, selectMonth: t.selectMonth } }), t._v(" "), n("div", { staticClass: "mu-calendar-container" }, [t.displayMonthDay ? n("div", { staticClass: "mu-calendar-monthday-container" }, [n("calendar-toolbar", { attrs: { slideType: t.slideType, nextMonth: t.nextMonth, prevMonth: t.prevMonth, displayDates: t.displayDates, dateTimeFormat: t.dateTimeFormat }, on: { monthChange: t.handleMonthChange } }), t._v(" "), n("div", { staticClass: "mu-calendar-week" }, t._l(t.weekTexts, function (e, i) {
          return n("span", { key: i, staticClass: "mu-calendar-week-day" }, [t._v(t._s(e))]);
        })), t._v(" "), n("div", { staticClass: "mu-calendar-monthday" }, t._l(t.displayDates, function (e, i) {
          return n("transition", { key: i, attrs: { name: "mu-calendar-slide-" + t.slideType } }, [n("div", { key: e.getTime(), staticClass: "mu-calendar-monthday-slide" }, [n("calendar-month", { attrs: { shouldDisableDate: t.shouldDisableDate, displayDate: e, firstDayOfWeek: t.firstDayOfWeek, maxDate: t.maxDate, minDate: t.minDate, selectedDate: t.selectedDate }, on: { selected: t.handleSelected } })], 1)]);
        }))], 1) : t._e(), t._v(" "), t.displayMonthDay ? t._e() : n("calendar-year", { attrs: { selectedDate: t.selectedDate, maxDate: t.maxDate, minDate: t.minDate }, on: { change: t.handleYearChange } }), t._v(" "), n("div", { staticClass: "mu-calendar-actions" }, [n("flat-button", { attrs: { label: t.cancelLabel, primary: "" }, on: { click: t.handleCancel } }), t._v(" "), t.autoOk ? t._e() : n("flat-button", { attrs: { label: t.okLabel, primary: "" }, on: { click: t.handleOk } })], 1)], 1)], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("label", { staticClass: "mu-checkbox", class: { "label-left": t.labelLeft, disabled: t.disabled, "no-label": !t.label }, on: { mousedown: t.handleMouseDown, mouseup: t.handleMouseUp, mouseleave: t.handleMouseLeave, touchstart: t.handleTouchStart, touchend: t.handleTouchEnd, touchcancel: t.handleTouchEnd, click: function (e) {
              e.stopPropagation(), t.handleClick(e);
            } } }, [n("input", { directives: [{ name: "model", rawName: "v-model", value: t.inputValue, expression: "inputValue" }], attrs: { type: "checkbox", disabled: t.disabled, name: t.name }, domProps: { value: t.nativeValue, checked: Array.isArray(t.inputValue) ? t._i(t.inputValue, t.nativeValue) > -1 : t.inputValue }, on: { change: t.handleChange, __c: function (e) {
              var n = t.inputValue,
                  i = e.target,
                  r = !!i.checked;if (Array.isArray(n)) {
                var a = t.nativeValue,
                    o = t._i(n, a);r ? o < 0 && (t.inputValue = n.concat(a)) : o > -1 && (t.inputValue = n.slice(0, o).concat(n.slice(o + 1)));
              } else t.inputValue = r;
            } } }), t._v(" "), t.disabled ? t._e() : n("touch-ripple", { staticClass: "mu-checkbox-wrapper", attrs: { rippleWrapperClass: "mu-checkbox-ripple-wrapper" } }, [t.label && t.labelLeft ? n("div", { staticClass: "mu-checkbox-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e(), t._v(" "), n("div", { staticClass: "mu-checkbox-icon" }, [t.checkedIcon ? t._e() : n("svg", { staticClass: "mu-checkbox-icon-uncheck mu-checkbox-svg-icon", class: t.iconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" } })]), t._v(" "), t.uncheckIcon ? t._e() : n("svg", { staticClass: "mu-checkbox-icon-checked mu-checkbox-svg-icon", class: t.iconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" } })]), t._v(" "), t.uncheckIcon ? n("icon", { staticClass: "mu-checkbox-icon-uncheck", class: t.iconClass, attrs: { value: t.uncheckIcon } }) : t._e(), t._v(" "), t.checkedIcon ? n("icon", { staticClass: "mu-checkbox-icon-checked", class: t.iconClass, attrs: { value: t.checkedIcon } }) : t._e()], 1), t._v(" "), t.label && !t.labelLeft ? n("div", { staticClass: "mu-checkbox-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e()]), t._v(" "), t.disabled ? n("div", { staticClass: "mu-checkbox-wrapper" }, [t.label && t.labelLeft ? n("div", { staticClass: "mu-checkbox-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e(), t._v(" "), n("div", { staticClass: "mu-checkbox-icon" }, [t.checkedIcon ? t._e() : n("svg", { staticClass: "mu-checkbox-icon-uncheck mu-checkbox-svg-icon", class: t.iconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" } })]), t._v(" "), t.uncheckIcon ? t._e() : n("svg", { staticClass: "mu-checkbox-icon-checked mu-checkbox-svg-icon", class: t.iconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" } })]), t._v(" "), t.uncheckIcon ? n("icon", { staticClass: "mu-checkbox-icon-uncheck", class: t.iconClass, attrs: { value: t.uncheckIcon } }) : t._e(), t._v(" "), t.checkedIcon ? n("icon", { staticClass: "mu-checkbox-icon-checked", class: t.iconClass, attrs: { value: t.checkedIcon } }) : t._e()], 1), t._v(" "), t.label && !t.labelLeft ? n("div", { staticClass: "mu-checkbox-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e()]) : t._e()], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("abstract-button", { staticClass: "mu-raised-button", class: t.buttonClass, style: t.buttonStyle, attrs: { type: t.type, href: t.href, target: t.target, to: t.to, tag: t.tag, activeClass: t.activeClass, event: t.event, exact: t.exact, append: t.append, replace: t.replace, rippleColor: t.rippleColor, rippleOpacity: t.rippleOpacity, disabled: t.disabled, keyboardFocused: t.keyboardFocused, wrapperClass: "mu-raised-button-wrapper", centerRipple: !1 }, on: { KeyboardFocus: t.handleKeyboardFocus, hover: t.handleHover, hoverExit: t.handleHoverExit, click: t.handleClick } }, [t.label && "before" === t.labelPosition ? n("span", { staticClass: "mu-raised-button-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e(), t._v(" "), n("icon", { class: t.iconClass, attrs: { value: t.icon } }), t._v(" "), t._t("default"), t._v(" "), t.label && "after" === t.labelPosition ? n("span", { staticClass: "mu-raised-button-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e()], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-linear-progress", style: { height: t.size + "px", "border-radius": (t.size ? t.size / 2 : "") + "px" } }, [n("div", { class: t.linearClass, style: t.linearStyle })]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("abstract-button", { staticClass: "mu-tab-link", class: { "mu-tab-active": t.active }, attrs: { href: t.href, to: t.to, tag: t.tag, activeClass: t.activeClass, event: t.event, exact: t.exact, append: t.append, replace: t.replace, disabled: t.disabled, "center-ripple": !1 }, on: { click: t.tabClick } }, [t._t("default", [n("icon", { class: t.iconClass, attrs: { value: t.icon } })]), t._v(" "), t.title ? n("div", { staticClass: "mu-tab-text", class: t.textClass }, [t._v(t._s(t.title))]) : t._e()], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("thead", { staticClass: "mu-thead" }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("text-field", { ref: "textField", staticClass: "mu-select-field", attrs: { label: t.label, labelFloat: t.labelFloat, underlineShow: t.underlineShow, labelClass: t.labelClass, labelFocusClass: t.labelFocusClass, underlineClass: t.underlineClass, underlineFocusClass: t.underlineFocusClass, fullWidth: t.fullWidth, hintText: t.hintText, hintTextClass: t.hintTextClass, helpText: t.helpText, helpTextClass: t.helpTextClass, icon: t.icon, iconClass: t.iconClass, value: t.inputValue instanceof Array ? t.inputValue.join("") : t.inputValue, disabled: t.disabled, errorText: t.errorText, errorColor: t.errorColor } }, [n("input", { attrs: { type: "hidden", name: t.name }, domProps: { value: t.inputValue instanceof Array ? t.inputValue.join("") : t.inputValue } }), t._v(" "), n("dropDown-menu", { attrs: { anchorEl: t.anchorEl, scroller: t.scroller, value: t.inputValue, disabled: t.disabled, maxHeight: t.maxHeight, autoWidth: t.autoWidth, iconClass: t.dropDownIconClass, multiple: t.multiple, anchorOrigin: { vertical: "bottom", horizontal: "left" }, separator: t.separator }, on: { open: t.handleOpen, close: t.handleClose, change: t.handlehange } }, [t._t("default")], 2)], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-card-actions" }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("transition", { attrs: { name: "mu-overlay-fade" } }, [t.show ? n("div", { staticClass: "mu-overlay", style: t.overlayStyle, on: { click: t.handleClick, touchmove: t.prevent } }) : t._e()]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", [t.fixedHeader ? n("div", [n("table", { staticClass: "mu-table" }, [t._t("header")], 2)]) : t._e(), t._v(" "), n("div", { style: t.bodyStyle }, [n("table", { staticClass: "mu-table" }, [t.fixedHeader ? t._e() : t._t("header"), t._v(" "), t._t("default"), t._v(" "), t.fixedFooter ? t._e() : t._t("footer")], 2)]), t._v(" "), t.fixedFooter ? n("div", [n("table", { staticClass: "mu-table" }, [t._t("footer")], 2)]) : t._e()]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-clock-hours" }, [n("clock-pointer", { attrs: { hasSelected: "", value: t.getSelected(), type: "hour" } }), t._v(" "), t._l(t.hours, function (e) {
          return n("clock-number", { key: e, attrs: { selected: t.getSelected() === e, type: "hour", value: e } });
        }), t._v(" "), n("div", { ref: "mask", staticClass: "mu-clock-hours-mask", on: { mouseup: t.handleUp, mousemove: t.handleMove, touchmove: t.handleTouchMove, touchend: t.handleTouchEnd } })], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("span", { staticClass: "mu-clock-number", class: t.numberClass, style: t.numberStyle }, [t._v(t._s(0 === t.value ? "00" : t.value))]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("span", [n("transition", { attrs: { name: t.transition }, on: { "after-enter": function (e) {
              t.show();
            }, "after-leave": function (e) {
              t.hide();
            } } }, [t.open ? n("div", { ref: "popup", staticClass: "mu-popup", class: t.popupCss, style: { "z-index": t.zIndex } }, [t._t("default")], 2) : t._e()])], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("label", { staticClass: "mu-switch", class: { "label-left": t.labelLeft, disabled: t.disabled, "no-label": !t.label }, on: { mousedown: t.handleMouseDown, mouseleave: t.handleMouseLeave, mouseup: t.handleMouseUp, touchstart: t.handleTouchStart, touchend: t.handleTouchEnd, touchcancel: t.handleTouchEnd, click: function (e) {
              e.stopPropagation(), t.handleClick(e);
            } } }, [n("input", { directives: [{ name: "model", rawName: "v-model", value: t.inputValue, expression: "inputValue" }], attrs: { type: "checkbox", disabled: t.disabled, name: t.name }, domProps: { checked: Array.isArray(t.inputValue) ? t._i(t.inputValue, null) > -1 : t.inputValue }, on: { change: t.handleChange, __c: function (e) {
              var n = t.inputValue,
                  i = e.target,
                  r = !!i.checked;if (Array.isArray(n)) {
                var a = null,
                    o = t._i(n, a);r ? o < 0 && (t.inputValue = n.concat(a)) : o > -1 && (t.inputValue = n.slice(0, o).concat(n.slice(o + 1)));
              } else t.inputValue = r;
            } } }), t._v(" "), n("div", { staticClass: "mu-switch-wrapper" }, [t.label && t.labelLeft ? n("div", { staticClass: "mu-switch-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e(), t._v(" "), n("div", { staticClass: "mu-switch-container" }, [n("div", { staticClass: "mu-switch-track", class: t.trackClass }), t._v(" "), t.disabled ? n("div", { staticClass: "mu-switch-thumb", class: t.thumbClass }) : t._e(), t._v(" "), t.disabled ? t._e() : n("touch-ripple", { staticClass: "mu-switch-thumb", attrs: { rippleWrapperClass: "mu-switch-ripple-wrapper" } })], 1), t._v(" "), t.label && !t.labelLeft ? n("div", { staticClass: "mu-switch-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e()])]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-card-media" }, [t._t("default"), t._v(" "), t.title || t.subTitle ? n("div", { staticClass: "mu-card-media-title" }, [t.title ? n("div", { staticClass: "mu-card-title", class: t.titleClass }, [t._v("\n      " + t._s(t.title) + "\n    ")]) : t._e(), t._v(" "), t.subTitle ? n("div", { staticClass: "mu-card-sub-title", class: t.subTitleClass }, [t._v("\n      " + t._s(t.subTitle) + "\n    ")]) : t._e()]) : t._e()], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-card-title-container" }, [n("div", { staticClass: "mu-card-title", class: t.titleClass }, [t._v("\n    " + t._s(t.title) + "\n  ")]), t._v(" "), n("div", { staticClass: "mu-card-sub-title", class: t.subTitleClass }, [t._v("\n    " + t._s(t.subTitle) + "\n  ")])]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-tabs" }, [t._t("default"), t._v(" "), n("span", { ref: "highlight", staticClass: "mu-tab-link-highlight", class: t.lineClass })], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;t._self._c;return t._m(0);
      }, staticRenderFns: [function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-step-connector" }, [n("span", { staticClass: "mu-step-connector-line" })]);
      }] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("span", [n("transition", { attrs: { name: "mu-dialog-slide" }, on: { "after-enter": function (e) {
              t.show();
            }, "after-leave": function (e) {
              t.hide();
            } } }, [t.open ? n("div", { ref: "popup", staticClass: "mu-dialog-wrapper", style: { "z-index": t.zIndex }, on: { click: t.handleWrapperClick } }, [n("div", { ref: "dialog", staticClass: "mu-dialog", class: t.dialogClass }, [t.showTitle ? n("h3", { ref: "title", staticClass: "mu-dialog-title", class: t.headerClass }, [t._t("title", [t._v("\n            " + t._s(t.title) + "\n          ")])], 2) : t._e(), t._v(" "), n("div", { ref: "elBody", staticClass: "mu-dialog-body ", class: t.bodyClass, style: t.bodyStyle }, [t._t("default")], 2), t._v(" "), t.showFooter ? n("div", { ref: "footer", staticClass: "mu-dialog-actions", class: t.footerClass }, [t._t("actions")], 2) : t._e()])]) : t._e()])], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("hr", { staticClass: "mu-divider", class: { inset: t.inset, "shallow-inset": t.shallowInset } });
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { style: t.style }, [n("div", { staticClass: "mu-grid-tile", class: t.tileClass }, [t._t("default"), t._v(" "), n("div", { staticClass: "mu-grid-tile-titlebar", class: t.titleBarClass }, [n("div", { staticClass: "mu-grid-tile-title-container" }, [n("div", { staticClass: "mu-grid-tile-title" }, [t._t("title", [t._v("\n            " + t._s(t.title) + "\n          ")])], 2), t._v(" "), n("div", { staticClass: "mu-grid-tile-subtitle" }, [t._t("subTitle", [t._v("\n            " + t._s(t.subTitle) + "\n          ")])], 2)]), t._v(" "), n("div", { staticClass: "mu-grid-tile-action" }, [t._t("action")], 2)])], 2)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-paper", class: t.paperClass }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("span", [t.href ? n("a", { class: t.linkClass, attrs: { href: t.href } }, [t._t("default")], 2) : n("span", { class: t.currentClass }, [t._t("default")], 2), t._v(" "), t.href ? n("span", { class: t.separatorClass }, [t._v("\n    " + t._s(this.separator) + "\n  ")]) : t._e()]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-text-field", class: t.textFieldClass, style: t.isFocused ? t.errorStyle : {} }, [t.icon ? n("icon", { staticClass: "mu-text-field-icon", class: t.iconClass, attrs: { value: t.icon } }) : t._e(), t._v(" "), n("div", { ref: "content", staticClass: "mu-text-field-content", on: { click: t.handleLabelClick } }, [t.label ? n("text-field-label", { attrs: { float: t.float, focus: t.isFocused, normalClass: t.labelClass, focusClass: t.labelFocusClass } }, [t._v(t._s(t.label))]) : t._e(), t._v(" "), t.hintText ? n("text-field-hint", { class: t.hintTextClass, attrs: { text: t.hintText, show: t.showHint } }) : t._e(), t._v(" "), t._t("default", [t.multiLine ? t._e() : n("input", { ref: "input", staticClass: "mu-text-field-input", class: t.inputClass, attrs: { name: t.name, type: t.type, disabled: t.disabled, max: t.max, min: t.min, required: t.required }, domProps: { value: t.inputValue }, on: { change: t.handleChange, focus: t.handleFocus, input: t.handleInput, blur: t.handleBlur } }), t._v(" "), t.multiLine ? n("enhanced-textarea", { ref: "textarea", attrs: { name: t.name, normalClass: t.inputClass, value: t.inputValue, disabled: t.disabled, rows: t.rows, rowsMax: t.rowsMax }, on: { change: t.handleChange, input: t.handleInput, focus: t.handleFocus, blur: t.handleBlur } }) : t._e()]), t._v(" "), t.underlineShow ? n("underline", { attrs: { error: !!t.errorText, disabled: t.disabled, errorColor: t.errorColor, focus: t.isFocused, normalClass: t.underlineClass, focusClass: t.underlineFocusClass } }) : t._e(), t._v(" "), t.errorText || t.helpText || t.maxLength > 0 ? n("div", { staticClass: "mu-text-field-help", class: t.helpTextClass, style: t.errorStyle }, [n("div", [t._v("\n            " + t._s(t.errorText || t.helpText) + "\n        ")]), t._v(" "), t.maxLength > 0 ? n("div", [t._v("\n            " + t._s(t.charLength) + "/" + t._s(t.maxLength) + "\n        ")]) : t._e()]) : t._e()], 2)], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("abstract-button", { staticClass: "mu-step-button", attrs: { centerRipple: !1, disabled: t.disabled }, on: { click: t.handleClick } }, [t.childrenInLabel ? n("step-label", { attrs: { active: t.active, completed: t.completed, num: t.num, disabled: t.disabled } }, [t._t("default"), t._v(" "), t._t("icon", null, { slot: "icon" })], 2) : t._e(), t._v(" "), t.childrenInLabel ? t._e() : t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("abstract-button", { staticClass: "mu-icon-button", attrs: { to: t.to, tag: t.tag, activeClass: t.activeClass, event: t.event, exact: t.exact, append: t.append, replace: t.replace, type: t.type, href: t.href, target: t.target, disabled: t.disabled, keyboardFocused: t.keyboardFocused }, on: { click: t.handleClick, hover: t.handleHover, hoverExit: t.handleHoverExit, keyboardFocus: t.handleKeyboardFocus } }, [t._t("default", [n("icon", { class: t.iconClass, attrs: { value: t.icon } })]), t._v(" "), t.tooltip ? n("tooltip", { attrs: { trigger: t.tooltipTrigger, verticalPosition: t.verticalPosition, horizontalPosition: t.horizontalPosition, show: t.tooltipShown, label: t.tooltip, touch: t.touch } }) : t._e()], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-infinite-scroll" }, [n("circular", { directives: [{ name: "show", rawName: "v-show", value: t.loading, expression: "loading" }], attrs: { size: 24 } }), t._v(" "), n("span", { directives: [{ name: "show", rawName: "v-show", value: t.loading, expression: "loading" }], staticClass: "mu-infinite-scroll-text" }, [t._v(t._s(t.loadingText))])], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-focus-ripple-wrapper" }, [n("div", { ref: "innerCircle", staticClass: "mu-focus-ripple", style: t.style })]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-picker" }, [t._l(t.slots, function (e, i) {
          return n("picker-slot", { key: i, attrs: { divider: e.divider, content: e.content, "text-align": e.textAlign, width: e.width, value: t.values[i], values: e.values, "visible-item-count": t.visibleItemCount }, on: { change: function (e) {
                t.change(i, arguments);
              } } });
        }), t._v(" "), n("div", { staticClass: "mu-picker-center-highlight" })], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-date-picker", class: { fullWidth: t.fullWidth } }, [n("text-field", { attrs: { value: t.inputValue, disabled: t.disabled, fullWidth: t.fullWidth, label: t.label, labelFloat: t.labelFloat, labelClass: t.labelClass, labelFocusClass: t.labelFocusClass, hintText: t.hintText, hintTextClass: t.hintTextClass, helpText: t.helpText, helpTextClass: t.helpTextClass, errorText: t.errorText, errorColor: t.errorColor, icon: t.icon, iconClass: t.iconClass, inputClass: t.inputClass, underlineShow: t.underlineShow, underlineClass: t.underlineClass, underlineFocusClass: t.underlineFocusClass }, on: { focus: t.handleFocus, labelClick: t.handleClick } }), t._v(" "), t.disabled ? t._e() : n("date-picker-dialog", { ref: "dialog", attrs: { initialDate: t.dialogDate, mode: t.mode, maxDate: t.maxLimitDate, minDate: t.minLimitDate, shouldDisableDate: t.shouldDisableDate, firstDayOfWeek: t.firstDayOfWeek, container: t.container, disableYearSelection: t.disableYearSelection, dateTimeFormat: t.dateTimeFormat, autoOk: t.autoOk, okLabel: t.okLabel, cancelLabel: t.cancelLabel }, on: { monthChange: t.handleMonthChange, yearChange: t.handleYearChange, accept: t.handleAccept, dismiss: t.dismiss } })], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-content-block" }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-flexbox", class: { "mu-flex-col": "vertical" === t.orient, "mu-flex-row": "horizontal" === t.orient }, style: t.styles }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-circular-progress", style: { width: t.size + "px", height: t.size + "px" } }, ["indeterminate" === t.mode ? n("circular", { attrs: { size: t.size, color: t.color, borderWidth: t.strokeWidth } }) : t._e(), t._v(" "), "determinate" === t.mode ? n("svg", { staticClass: "mu-circular-progress-determinate", style: t.circularSvgStyle, attrs: { viewBox: "0 0 " + t.size + " " + t.size } }, [n("circle", { staticClass: "mu-circular-progress-determinate-path", style: t.circularPathStyle, attrs: { r: t.radius, cx: t.size / 2, cy: t.size / 2, fill: "none", "stroke-miterlimit": "20", "stroke-width": t.strokeWidth } })]) : t._e()], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-circle-wrapper active", style: { width: t.size + "px", height: t.size + "px" } }, [n("div", { staticClass: "mu-circle-spinner active", class: { "mu-circle-secondary": t.secondary }, style: t.spinnerStyle }, [n("div", { staticClass: "mu-circle-clipper left" }, [n("div", { staticClass: "mu-circle", style: { "border-width": t.borderWidth + "px" } })]), t._v(" "), t._m(0), t._v(" "), n("div", { staticClass: "mu-circle-clipper right" }, [n("div", { staticClass: "mu-circle", style: { "border-width": t.borderWidth + "px" } })])])]);
      }, staticRenderFns: [function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-circle-gap-patch" }, [n("div", { staticClass: "mu-circle" })]);
      }] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("span", [n("transition", { attrs: { name: "mu-bottom-sheet" }, on: { "after-enter": function (e) {
              t.show();
            }, "after-leave": function (e) {
              t.hide();
            } } }, [t.open ? n("div", { ref: "popup", staticClass: "mu-bottom-sheet", class: t.sheetClass, style: { "z-index": t.zIndex } }, [t._t("default")], 2) : t._e()])], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-date-display", class: t.displayClass }, [n("div", { staticClass: "mu-date-display-year", class: { disabled: t.disableYearSelection }, on: { click: t.handleSelectYear } }, t._l(t.displayDates, function (e, i) {
          return n("transition", { key: i, attrs: { name: "mu-date-display-" + t.slideType } }, [n("div", { key: e.getFullYear(), staticClass: "mu-date-display-slideIn-wrapper" }, [n("div", { staticClass: "mu-date-display-year-title" }, [t._v("\n          " + t._s(e.getFullYear()) + "\n        ")])])]);
        })), t._v(" "), n("div", { staticClass: "mu-date-display-monthday", on: { click: t.handleSelectMonth } }, t._l(t.displayDates, function (e, i) {
          return n("transition", { key: i, attrs: { name: "mu-date-display-" + t.slideType } }, [n("div", { key: t.dateTimeFormat.formatDisplay(e), staticClass: "mu-date-display-slideIn-wrapper" }, [n("div", { staticClass: "mu-date-display-monthday-title" }, [t._v("\n          " + t._s(t.dateTimeFormat.formatDisplay(e)) + "\n        ")])])]);
        }))]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-list" }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return t.backShow ? n("div", { staticClass: "mu-back-up", style: t.propsStyle, on: { click: t.moveTop } }, [t._t("default", [n("div", { staticClass: "mu-back-up-default" }, [n("icon", { attrs: { value: "keyboard_arrow_up" } })], 1)])], 2) : t._e();
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-calendar-toolbar" }, [n("icon-button", { attrs: { disabled: !t.prevMonth }, on: { click: function (e) {
              e.stopPropagation(), t.prev(e);
            } } }, [n("svg", { staticClass: "mu-calendar-svg-icon", attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" } })])]), t._v(" "), n("div", { staticClass: "mu-calendar-toolbar-title-wrapper" }, t._l(t.displayDates, function (e, i) {
          return n("transition", { key: i, attrs: { name: "mu-calendar-slide-" + t.slideType } }, [n("div", { key: e.getTime(), staticClass: "mu-calendar-toolbar-title" }, [t._v("\n        " + t._s(t.dateTimeFormat.formatMonth(e)) + "\n      ")])]);
        })), t._v(" "), n("icon-button", { attrs: { disabled: !t.nextMonth }, on: { click: function (e) {
              e.stopPropagation(), t.next(e);
            } } }, [n("svg", { staticClass: "mu-calendar-svg-icon", attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" } })])])], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("transition", { attrs: { name: "mu-toast" } }, [n("div", { directives: [{ name: "clickoutside", rawName: "v-clickoutside", value: t.clickOutSide, expression: "clickOutSide" }], staticClass: "mu-toast", style: { "z-index": t.zIndex } }, [t._v("\n    " + t._s(t.message) + "\n  ")])]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("transition", { attrs: { name: "mu-snackbar" } }, [n("div", { directives: [{ name: "clickoutside", rawName: "v-clickoutside", value: t.clickOutSide, expression: "clickOutSide" }], staticClass: "mu-snackbar", style: { "z-index": t.zIndex } }, [n("div", { staticClass: "mu-snackbar-message" }, [t._v("\n      " + t._s(t.message) + "\n    ")]), t._v(" "), t.action ? n("flat-button", { staticClass: "mu-snackbar-action", attrs: { color: t.actionColor, rippleColor: "#FFF", rippleOpacity: .3, secondary: "", label: t.action }, on: { click: t.handleActionClick } }) : t._e()], 1)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-refresh-control", class: t.refreshClass, style: t.refreshStyle }, [n("svg", { directives: [{ name: "show", rawName: "v-show", value: !t.refreshing && t.draging, expression: "!refreshing && draging" }], staticClass: "mu-refresh-svg-icon", style: t.circularStyle, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" } })]), t._v(" "), n("circular", { directives: [{ name: "show", rawName: "v-show", value: t.refreshing, expression: "refreshing" }], attrs: { size: 24, "border-width": 2 } })], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("span", [n("transition", { attrs: { name: "mu-popover" }, on: { "after-enter": function (e) {
              t.show();
            }, "after-leave": function (e) {
              t.hide();
            } } }, [t.open ? n("div", { ref: "popup", staticClass: "mu-popover", class: t.popoverClass, style: { "z-index": t.zIndex } }, [t._t("default")], 2) : t._e()])], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-card" }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("abstract-button", { staticClass: "mu-float-button", class: [t.buttonClass], style: t.buttonStyle, attrs: { type: t.type, href: t.href, target: t.target, to: t.to, tag: t.tag, activeClass: t.activeClass, event: t.event, exact: t.exact, append: t.append, replace: t.replace, disabled: t.disabled }, on: { click: t.handleClick, keyboardFocus: t.handleKeyboardFocus, hover: t.handleHover, hoverExit: t.handleHoverExit } }, [n("div", { staticClass: "mu-float-button-wrapper" }, [t._t("default", [n("icon", { class: t.iconClass, attrs: { value: this.icon } })])], 2)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-clock-minutes" }, [n("clock-pointer", { attrs: { hasSelected: "", value: t.minutes.selected, hasSelected: t.minutes.hasSelected, type: "minute" } }), t._v(" "), t._l(t.minutes.numbers, function (t) {
          return n("clock-number", { key: t.minute, attrs: { selected: t.isSelected, type: "minute", value: t.minute } });
        }), t._v(" "), n("div", { ref: "mask", staticClass: "mu-clock-minutes-mask", on: { mouseup: t.handleUp, mousemove: t.handleMove, touchmove: t.handleTouch, touchend: t.handleTouch } })], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-calendar-year-container" }, [n("div", { ref: "container", staticClass: "mu-calendar-year" }, [n("div", { staticClass: "mu-calendar-year-list" }, t._l(t.years, function (e) {
          return n("year-button", { key: "yearButton" + e, attrs: { year: e, selected: e === t.selectedDate.getFullYear() }, on: { click: function (n) {
                t.handleClick(e);
              } } });
        }))])]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("abstract-button", { staticClass: "mu-flat-button", class: t.buttonClass, style: t.buttonStyle, attrs: { disabled: t.disabled, keyboardFocused: t.keyboardFocused, wrapperClass: "mu-flat-button-wrapper", type: t.type, href: t.href, target: t.target, to: t.to, tag: t.tag, activeClass: t.activeClass, event: t.event, exact: t.exact, append: t.append, replace: t.replace, rippleColor: t.rippleColor, rippleOpacity: t.rippleOpacity, centerRipple: !1 }, on: { click: t.handleClick, keyboardFocus: t.handleKeyboardFocus, hover: t.handleHover, hoverExit: t.handleHoverExit } }, [t.label && "before" === t.labelPosition ? n("span", { staticClass: "mu-flat-button-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e(), t._v(" "), n("icon", { class: t.iconClass, attrs: { value: t.icon } }), t._v(" "), t._t("default"), t._v(" "), t.label && "after" === t.labelPosition ? n("span", { staticClass: "mu-flat-button-label", class: t.labelClass }, [t._v(t._s(t.label))]) : t._e()], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-flexbox-item", style: t.itemStyle }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-grid-list", style: t.gridListStyle }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("tr", { key: t.rowId, staticClass: "mu-tr", class: t.className, on: { click: t.handleClick, mouseenter: t.handleHover, mouseleave: t.handleExit } }, [t.isTh && t.showCheckbox ? n("mu-th", { staticClass: "mu-checkbox-col" }, [n("checkbox", { attrs: { value: t.isSelectAll && t.enableSelectAll, disabled: !t.enableSelectAll || !t.multiSelectable }, on: { change: t.handleSelectAllChange } })], 1) : t._e(), t._v(" "), t.isTb && t.showCheckbox ? n("mu-td", { staticClass: "mu-checkbox-col" }, [n("checkbox", { ref: "checkLabel", attrs: { disabled: !t.selectable || !t.$parent.selectable, value: t.isSelected }, on: { change: t.handleCheckboxChange }, nativeOn: { click: function (e) {
              t.handleCheckboxClick(e);
            } } })], 1) : t._e(), t._v(" "), t.isTf && t.showCheckbox ? n("mu-td", { staticClass: "mu-checkbox-col" }) : t._e(), t._v(" "), t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("th", { staticClass: "mu-th", on: { mouseenter: t.showTooltip, mouseleave: t.hideTooltip } }, [n("div", { ref: "wrapper", staticClass: "mu-th-wrapper" }, [t._t("default"), t._v(" "), t.tooltip ? n("tooltip", { attrs: { trigger: t.tooltipTrigger, verticalPosition: t.verticalPosition, horizontalPosition: t.horizontalPosition, show: t.tooltipShown, label: t.tooltip, touch: t.touch } }) : t._e()], 2)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-text-field-multiline" }, [n("textarea", { ref: "textareaHidden", staticClass: "mu-text-field-textarea-hide mu-text-field-input", attrs: { rows: "1" }, domProps: { value: t.value } }), t._v(" "), n("textarea", { ref: "textarea", staticClass: "mu-text-field-input mu-text-field-textarea", class: t.normalClass, attrs: { name: t.name, placeholder: t.placeholder, disabled: t.disabled, required: t.required }, domProps: { value: t.value }, on: { change: t.handleChange, input: t.handleInput, focus: t.handleFocus, blur: t.handleBlur } })]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("td", { staticClass: "mu-td", on: { mouseenter: t.handleMouseEnter, mouseleave: t.handleMouseLeave, click: t.handleClick } }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("tfoot", { staticClass: "mu-tfoot" }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("span", { staticClass: "mu-step-label", class: { active: t.active, completed: t.completed, disabled: t.disabled } }, [t.num || t.$slots.icon && t.$slots.length > 0 ? n("span", { staticClass: "mu-step-label-icon-container" }, [t._t("icon", [t.completed ? n("svg", { staticClass: "mu-step-label-icon", attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" } })]) : t._e(), t._v(" "), t.completed ? t._e() : n("div", { staticClass: "mu-step-label-circle" }, [t._v("\n        " + t._s(t.num) + "\n      ")])])], 2) : t._e(), t._v(" "), t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("transition", { attrs: { name: "mu-ripple" } }, [n("div", { staticClass: "mu-circle-ripple", style: t.styles })]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-text-field-hint", class: { show: t.show } }, [t._v("\n  " + t._s(t.text) + "\n")]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-slider", class: t.sliderClass, attrs: { tabindex: "0" }, on: { focus: t.handleFocus, blur: t.handleBlur, keydown: t.handleKeydown, touchstart: t.handleTouchStart, touchend: t.handleTouchEnd, touchcancel: t.handleTouchEnd, mousedown: t.handleMouseDown, mouseup: t.handleMouseUp, mouseenter: t.handleMouseEnter, mouseleave: t.handleMouseLeave } }, [n("input", { attrs: { type: "hidden", name: t.name }, domProps: { value: t.inputValue } }), t._v(" "), n("div", { staticClass: "mu-slider-track" }), t._v(" "), n("div", { staticClass: "mu-slider-fill", style: t.fillStyle }), t._v(" "), n("div", { staticClass: "mu-slider-thumb", style: t.thumbStyle }, [!t.focused && !t.hover || t.active ? t._e() : n("focus-ripple")], 1)]);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "mu-chip", class: t.classNames, style: t.style, on: { mouseenter: t.onMouseenter, mouseup: t.onMouseup, mousedown: t.onMousedown, mouseleave: t.onMouseleave, touchstart: t.onTouchstart, click: t.handleClick, touchend: t.onTouchend, touchcancel: t.onTouchend } }, [t._t("default"), t._v(" "), t.showDelete && !t.disabled ? n("svg", { staticClass: "mu-chip-delete-icon", class: t.deleteIconClass, attrs: { viewBox: "0 0 24 24" }, on: { click: function (e) {
              e.stopPropagation(), t.handleDelete(e);
            } } }, [n("path", { attrs: { d: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" } })]) : t._e()], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", [n("abstract-button", { staticClass: "mu-item-wrapper", style: t.disabled ? t.itemStyle : {}, attrs: { containerElement: "div", href: t.href, disabled: t.disabled, disableFocusRipple: t.disableRipple, disableTouchRipple: t.disableRipple, target: t.target, to: t.to, tag: t.tag, activeClass: t.activeClass, event: t.event, exact: t.exact, append: t.append, replace: t.replace, wrapperStyle: t.itemStyle, centerRipple: !1 }, on: { click: t.handleClick, keyboardFocus: t.handleKeyboardFocus, hover: t.handleHover, hoverExit: t.handleHoverExit } }, [n("div", { class: t.itemClass }, [t.showLeft ? n("div", { staticClass: "mu-item-left" }, [t._t("left"), t._v(" "), t._t("leftAvatar")], 2) : t._e(), t._v(" "), n("div", { staticClass: "mu-item-content" }, [t.showTitleRow ? n("div", { staticClass: "mu-item-title-row" }, [n("div", { staticClass: "mu-item-title", class: t.titleClass }, [t._t("title", [t._v("\n               " + t._s(t.title) + "\n             ")])], 2), t._v(" "), n("div", { staticClass: "mu-item-after", class: t.afterTextClass }, [t._t("after", [t._v("\n                " + t._s(t.afterText) + "\n              ")])], 2)]) : t._e(), t._v(" "), t.showDescribe ? n("div", { staticClass: "mu-item-text", class: t.describeTextClass, style: t.textStyle }, [t._t("describe", [t._v("\n            " + t._s(t.describeText) + "\n          ")])], 2) : t._e(), t._v(" "), t._t("default")], 2), t._v(" "), t.showRight ? n("div", { staticClass: "mu-item-right" }, [t.toggleNested ? n("icon-button", { on: { click: function (e) {
              e.stopPropagation(), t.handleToggleNested(e);
            } }, nativeOn: { mousedown: function (e) {
              t.stop(e);
            }, touchstart: function (e) {
              t.stop(e);
            } } }, [t.nestedOpen ? n("svg", { staticClass: "mu-item-svg-icon", class: t.toggleIconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M6 15L12 9L18 15" } })]) : t._e(), t._v(" "), t.nestedOpen ? t._e() : n("svg", { staticClass: "mu-item-svg-icon", class: t.toggleIconClass, attrs: { viewBox: "0 0 24 24" } }, [n("path", { attrs: { d: "M6 9L12 15L18 9" } })])]) : t._e(), t._v(" "), t._t("right"), t._v(" "), t._t("rightAvatar")], 2) : t._e()])]), t._v(" "), n("expand-transition", [t.showNested ? n("mu-list", { class: t.nestedListClass, attrs: { nestedLevel: t.nestedLevel, value: t.nestedSelectValue }, on: { change: t.handleNestedChange } }, [t._t("nested")], 2) : t._e()], 1)], 1);
      }, staticRenderFns: [] };
  }, function (t, e) {
    t.exports = { render: function () {
        var t = this,
            e = t.$createElement;return (t._self._c || e)("div", { staticClass: "mu-card-text" }, [t._t("default")], 2);
      }, staticRenderFns: [] };
  }, function (t, e) {
    var n;n = function () {
      return this;
    }();try {
      n = n || Function("return this")() || (0, eval)("this");
    } catch (t) {
      "object" == typeof window && (n = window);
    }t.exports = n;
  }, function (t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = n(68),
        r = n.n(i),
        a = n(41),
        o = n.n(a),
        s = n(139),
        l = (n.n(s), n(1)),
        u = n(2),
        c = n(103),
        d = n(104),
        f = n(107),
        h = n(100),
        p = n(24),
        m = n(23),
        v = n(127),
        y = n(116),
        g = n(111),
        b = n(122),
        x = n(132),
        C = n(113),
        _ = n(128),
        S = n(120),
        w = n(102),
        k = n(135),
        $ = n(66),
        O = n(105),
        T = n(108),
        M = n(109),
        D = n(69),
        F = n.n(D),
        E = n(39),
        P = n(138),
        A = n(130),
        j = n(125),
        B = n(25),
        R = n(106),
        I = n(11),
        L = n(119),
        z = n(65),
        N = n(114),
        H = n(124),
        W = n(40),
        V = n(17),
        Y = n(67),
        K = n(63),
        G = n(126),
        X = n(133),
        U = n(129),
        q = n(121),
        Z = n(110),
        J = n(118),
        Q = n(134),
        tt = n(112),
        et = n(137),
        nt = n(131),
        it = n(101),
        rt = n(123),
        at = n(136),
        ot = n(117),
        st = n(115),
        lt = n(64);n.d(e, "config", function () {
      return lt.a;
    }), n.d(e, "install", function () {
      return ct;
    });var ut = o()({ icon: u.a, backTop: c.a, badge: d.a }, f, { appBar: h.a, iconButton: p.a, flatButton: m.a, raisedButton: v.a, floatButton: y.a, contentBlock: g.a }, b, { subHeader: x.a, divider: C.a, refreshControl: _.a, infiniteScroll: S.a, avatar: w.a }, k, { paper: $.a }, O, T, { chip: M.a, overlay: F.a, dialog: E.a, toast: P.a, snackbar: A.a, popup: j.a }, B, { bottomSheet: R.a, popover: I.a, iconMenu: L.a, dropDownMenu: z.a, drawer: N.a, picker: H.a, tooltip: W.a, textField: V.a, selectField: Y.a, checkbox: K.a, radio: G.a, _switch: X.a, slider: U.a }, at, { linearProgress: q.a, circularProgress: Z.a }, J, Q, { datePicker: tt.a, timePicker: et.a }, nt, { autoComplete: it.a }, ot, st, { pagination: rt.a }),
        ct = function (t) {
      r()(ut).forEach(function (e) {
        t.component(ut[e].name, ut[e]);
      }), n.i(l.a)();
    };"undefined" != typeof window && window.Vue && ct(window.Vue), e.default = { config: lt.a, install: ct };
  }]);
});

/***/ }),
/* 14 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 15 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_06de6a06_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_home_vue__ = __webpack_require__(19);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(17)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_06de6a06_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_home_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\vue\\home.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] home.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-06de6a06", Component.options)
  } else {
    hotAPI.reload("data-v-06de6a06", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			treeholes: []
		};
	},
	mounted() {
		this.$http.get('./treehole/getAccount').then(function (res) {
			let resArr = [];
			res.body.forEach(function (element, index) {
				let tdate = new Date(element.date),
				    date = tdate.getFullYear() + '-' + (tdate.getMonth() + 1) + '-' + tdate.getDate() + ' ' + (tdate.getHours() + 1) + ':' + tdate.getMinutes();
				resArr[index] = {
					content: element.content,
					date: date,
					comment: element.comment,
					support: element.support
				};
			});
			this.treeholes = resArr.reverse();
		}, function (res) {
			//失败
			console.log(res);
		});
	},
	methods: {},
	components: {}
});

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "home"
  }, [_c('div', {
    staticClass: "paper-conta"
  }, _vm._l((_vm.treeholes), function(item) {
    return _c('mu-paper', {
      staticClass: "demo-paper",
      attrs: {
        "zDepth": 1
      }
    }, [_c('p', [_vm._v(_vm._s(item.content))]), _vm._v(" "), _c('div', {
      staticClass: "opea"
    }, [_c('div', {
      staticClass: "opea-content-left"
    }, [_vm._v(_vm._s(item.date))]), _vm._v(" "), _c('div', {
      staticClass: "opea-content-right"
    }, [_c('mu-avatar', {
      attrs: {
        "icon": "favorite",
        "color": "orange200",
        "backgroundColor": "pink400",
        "size": 22,
        "iconSize": 14
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "icon-title"
    }, [_vm._v("赞 " + _vm._s(item.support))]), _vm._v(" "), _c('mu-avatar', {
      attrs: {
        "icon": "folder",
        "color": "orange200",
        "backgroundColor": "pink400",
        "size": 22,
        "iconSize": 14
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "icon-title"
    }, [_vm._v("评论")])], 1)])])
  })), _vm._v(" "), _c('mu-float-button', {
    staticClass: "demo-float-button",
    attrs: {
      "icon": "add",
      "to": "/new"
    }
  })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-06de6a06", esExports)
  }
}

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_square_vue__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_square_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_square_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4f073784_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_square_vue__ = __webpack_require__(23);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(21)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_square_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4f073784_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_square_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\vue\\square.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] square.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4f073784", Component.options)
  } else {
    hotAPI.reload("data-v-4f073784", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */
/***/ (function(module, exports) {

//
//
//
//

//js

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat"
  }, [_vm._v("blog")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4f073784", esExports)
  }
}

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_me_vue__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_me_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_me_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f32c9402_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_me_vue__ = __webpack_require__(27);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(25)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_me_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f32c9402_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_me_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\vue\\me.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] me.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f32c9402", Component.options)
  } else {
    hotAPI.reload("data-v-f32c9402", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 25 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 26 */
/***/ (function(module, exports) {

//
//
//
//

//js

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "stat"
  }, [_vm._v("Me")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-f32c9402", esExports)
  }
}

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_vue__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f974449_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_vue__ = __webpack_require__(31);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(29)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f974449_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\vue\\new.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7f974449", Component.options)
  } else {
    hotAPI.reload("data-v-7f974449", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 29 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			content: ''
		};
	},
	methods: {
		setTreehole() {
			if (!this.content) {
				alert('发条空的是怎么个意思~');
				return false;
			}
			this.$http.post('./treehole/createAccount', { content: this.content }).then(function (res) {
				//成功
				alert('嗯，树又多了一个洞~');
			}, function (res) {
				//失败
				console.log(res);
			});
		}
	}
});

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "new"
  }, [_c('mu-paper', {
    staticClass: "new-wrap demo-paper",
    attrs: {
      "zDepth": 2
    }
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.content),
      expression: "content"
    }],
    staticClass: "input",
    attrs: {
      "placeholder": "发条树洞散散心~",
      "autofocus": ""
    },
    domProps: {
      "value": (_vm.content)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.content = $event.target.value
      }
    }
  }), _vm._v(" "), _c('mu-raised-button', {
    staticClass: "demo-raised-button submit",
    attrs: {
      "label": "传送",
      "primary": ""
    },
    on: {
      "click": _vm.setTreehole
    }
  })], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7f974449", esExports)
  }
}

/***/ })
],[2]);