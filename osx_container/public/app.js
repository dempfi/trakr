(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("actions/tasks", function(exports, require, module) {
module.exports = Reflux.createActions(['addTask']);
});

;require.register("app", function(exports, require, module) {
var Link;

Link = ReactRouter.Link;

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": 'APP'
    }, React.createElement(Link, {
      "to": 'timeline'
    }, "timeline"), " |", React.createElement(Link, {
      "to": 'new'
    }, "new task"), React.createElement("hr", null), React.createElement(ReactRouter.RouteHandler, null));
  }
});
});

;require.register("components/taskItem", function(exports, require, module) {
module.exports = React.createClass({
  render: function() {
    return React.createElement("div", null, this.props.task.title, " ", this.props.task.project);
  }
});
});

;require.register("layouts/new-task/index", function(exports, require, module) {
var TasksActions, TasksStore;

TasksStore = require('store/tasks');

TasksActions = require('actions/tasks');

module.exports = React.createClass({
  mixins: [Reflux.connect(TasksStore, 'tasks')],
  getInitialState: function() {
    return {
      title: '',
      project: '',
      rate: 0,
      currency: '$',
      estimate: '',
      deadline: '',
      complexity: 0
    };
  },
  addTask: function() {
    return TasksActions.addTask({
      title: 'some cool title',
      rate: 34,
      currency: '$',
      project: 'project',
      estimate: [7, 9],
      deadline: moment().toISOString(),
      complexity: 8
    });
  },
  onChange: function(key, e) {
    var obj;
    obj = {};
    obj[key] = e.target.value;
    return this.setState(obj);
  },
  render: function() {
    console.log(new Date().toUTCString());
    return React.createElement("div", {
      "className": 'new-task'
    }, React.createElement("input", {
      "value": this.state.title,
      "onChange": this.onChange.bind(this, 'title'),
      "placeholder": 'title'
    }), React.createElement("br", null), React.createElement("input", {
      "value": this.state.title,
      "onChange": this.onChange.bind(this, 'title'),
      "placeholder": 'project'
    }), React.createElement("br", null), React.createElement("input", {
      "placeholder": 'rate'
    }), React.createElement("br", null), React.createElement("input", {
      "placeholder": 'currency'
    }), React.createElement("br", null), React.createElement("input", {
      "placeholder": 'estimate'
    }), React.createElement("br", null), React.createElement("input", {
      "placeholder": 'deadline'
    }), React.createElement("br", null), React.createElement("input", {
      "placeholder": 'complexity'
    }), React.createElement("br", null), React.createElement("button", {
      "onClick": this.addTask
    }, "add task"));
  }
});
});

;require.register("layouts/timeline/index", function(exports, require, module) {
var TaskItem, TasksStore;

TasksStore = require('store/tasks');

TaskItem = require('components/taskItem');

module.exports = React.createClass({
  mixins: [Reflux.connect(TasksStore, 'tasks')],
  render: function() {
    var _ref;
    return React.createElement("div", {
      "className": 'timeline'
    }, (_ref = this.state.tasks) != null ? _ref.map(function(task) {
      return React.createElement(TaskItem, {
        "key": task.id,
        "task": task
      });
    }) : void 0);
  }
});
});

;require.register("router", function(exports, require, module) {
var App, NewTask, Route, Timeline, routes;

App = require('app');

Timeline = require('layouts/timeline');

NewTask = require('layouts/new-task');

Route = ReactRouter.Route;

routes = React.createElement(Route, {
  "handler": App
}, React.createElement(Route, {
  "name": 'new',
  "handler": NewTask
}), React.createElement(Route, {
  "name": 'timeline',
  "handler": Timeline
}));

ReactRouter.run(routes, function(Trakr) {
  return React.render(React.createElement(Trakr, null), document.body);
});
});

;require.register("store/tasks", function(exports, require, module) {
var TasksActions, db, uuid;

TasksActions = require('actions/tasks');

db = require('utils/storage');

uuid = require('utils/uuid');

module.exports = Reflux.createStore({
  listenables: [TasksActions],
  getInitialState: function() {
    return this.tasks || [];
  },
  init: function() {
    return this.tasks = db('tasks') || [];
  },
  updateTasks: function() {
    this.trigger(this.tasks);
    return db('tasks', this.tasks);
  },
  onAddTask: function(params) {
    this.tasks.push({
      id: uuid(),
      title: params.title,
      rate: params.rate,
      currency: params.currency,
      lastStart: moment().toISOString(),
      project: params.project,
      timeslots: []
    });
    return this.updateTasks();
  }
});
});

;require.register("utils", function(exports, require, module) {
module.exports = {
  uuid: function() {
    var i, random, uuid;
    i = void 0;
    random = void 0;
    uuid = '';
    i = 0;
    while (i < 32) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : i === 16 ? random & 3 | 8 : random).toString(16);
      i++;
    }
    return uuid;
  },
  store: function(namespace, data) {
    var store;
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }
    store = localStorage.getItem(namespace);
    return store && JSON.parse(store) || [];
  },
  extend: function() {
    var i, key, newObj, obj;
    newObj = {};
    i = 0;
    while (i < arguments.length) {
      obj = arguments[i];
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
      i++;
    }
    return newObj;
  }
};
});

;require.register("utils/storage", function(exports, require, module) {
module.exports = function(namespace, data) {
  var store;
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }
  store = localStorage.getItem(namespace);
  return store && JSON.parse(store) || void 0;
};
});

;require.register("utils/uuid", function(exports, require, module) {
module.exports = function() {
  var i, random, uuid;
  uuid = '';
  i = 0;
  while (i < 32) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : i === 16 ? random & 3 | 8 : random).toString(16);
    i++;
  }
  return uuid;
};
});

;
//# sourceMappingURL=app.js.map