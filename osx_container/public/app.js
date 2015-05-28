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
require.register("actions/projects", function(exports, require, module) {
module.exports = Reflux.createActions(['add', 'addTask']);
});

;require.register("actions/tasks", function(exports, require, module) {
module.exports = Reflux.createActions(['add', 'addTimeslot', 'stopTimeslot']);
});

;require.register("app", function(exports, require, module) {
var Link;

Link = ReactRouter.Link;

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": 'APP'
    }, React.createElement(Link, {
      "to": 'timeline',
      "params": {
        date: moment().format('YYYY-MM-DD')
      }
    }, "timeline"), " |", React.createElement(Link, {
      "to": 'new-task'
    }, "new task"), " |", React.createElement(Link, {
      "to": 'new-project'
    }, "new project"), React.createElement("hr", null), React.createElement(ReactRouter.RouteHandler, null));
  }
});
});

;require.register("components/autocomplete/index", function(exports, require, module) {
module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: '',
      activeItem: {}
    };
  },
  onChange: function(e) {
    var filteredList, reg, value;
    value = e.target.value;
    reg = new RegExp("^" + value, 'i');
    filteredList = _.filter(this.props.list, (function(_this) {
      return function(i) {
        return reg.test(i[_this.props.titleKey]);
      };
    })(this));
    return this.setState({
      list: filteredList,
      value: value
    });
  },
  handleFocus: function() {
    return this.setState({
      isOpen: true
    });
  },
  handleBlur: function() {
    return setTimeout((function(_this) {
      return function() {
        return _this.setState({
          isOpen: false
        });
      };
    })(this), 10);
  },
  handleEnter: function() {
    this.selectItem(this.state.activeItem);
    return this.setState({
      isOpen: false
    });
  },
  selectItem: function(item) {
    this.setState({
      value: item[this.props.titleKey]
    });
    return this.props.onSelect(item);
  },
  handleKeyDown: function(e) {
    switch (e.key) {
      case 'ArrowDown':
        return this.updateIndex('down');
      case 'ArrowUp':
        return this.updateIndex('up');
      case 'Enter':
        return this.handleEnter();
      case 'Escape':
        return console.log('ESC');
    }
  },
  updateIndex: function(direction) {
    var current, currentId, lastId, nextId;
    current = this.state.activeItem;
    currentId = this.state.list.indexOf(current);
    lastId = this.state.list.length - 1;
    nextId = direction === 'down' ? this.indexDown(currentId, lastId) : this.indexUp(currentId, lastId);
    return this.setState({
      activeItem: this.state.list[nextId]
    });
  },
  indexDown: function(cur, last) {
    if (cur < 0 || cur === last) {
      return 0;
    }
    if (cur < last) {
      return cur + 1;
    }
    return last;
  },
  indexUp: function(cur, last) {
    if (cur <= 0) {
      return last;
    }
    if (cur <= last) {
      return cur - 1;
    }
    return last;
  },
  renderItem: function(item) {
    var styles;
    styles = {
      isActive: this.state.activeItem[this.props.valueKey] === item[this.props.valueKey]
    };
    return React.createElement("li", {
      "className": classNames(styles),
      "key": item[this.props.valueKey],
      "onClick": this.selectItem.bind(this, item)
    }, item[this.props.titleKey]);
  },
  render: function() {
    var listClasses, _ref;
    listClasses = {
      list: true,
      isOpen: this.state.isOpen
    };
    return React.createElement("div", {
      "className": 'autocomplete'
    }, React.createElement("input", {
      "value": this.state.value,
      "onChange": this.onChange,
      "onKeyDown": this.handleKeyDown,
      "onFocus": this.handleFocus,
      "onBlur": this.handleBlur
    }), React.createElement("ul", {
      "className": classNames(listClasses)
    }, (_ref = this.state.list) != null ? _ref.map((function(_this) {
      return function(item) {
        return _this.renderItem(item);
      };
    })(this)) : void 0));
  }
});
});

;require.register("components/dateribbon", function(exports, require, module) {
var Link;

Link = ReactRouter.Link;

module.exports = React.createClass({
  generateArray: function() {
    var array, i, _i;
    array = [];
    for (i = _i = 0; _i <= 30; i = ++_i) {
      array.push(moment().subtract(i, 'd'));
    }
    return array;
  },
  date: function(m) {
    return React.createElement(Link, {
      "to": 'timeline',
      "params": {
        date: m.format('YYYY-MM-DD')
      }
    }, m.format('D ddd'));
  },
  render: function() {
    return React.createElement("ul", null, this.generateArray().map((function(_this) {
      return function(m) {
        return _this.date(m);
      };
    })(this)), " ");
  }
});
});

;require.register("components/taskItem", function(exports, require, module) {
var Link;

Link = ReactRouter.Link;

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", null, React.createElement(Link, {
      "to": 'task',
      "params": {
        id: this.props.task.id
      }
    }, this.props.task.title, " ", this.props.task.project));
  }
});
});

;require.register("layouts/new-project/index", function(exports, require, module) {
var ProjectsActions;

ProjectsActions = require('actions/projects');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      title: '',
      rate: '',
      currency: '$'
    };
  },
  addProject: function() {
    return ProjectsActions.add(this.state);
  },
  onChange: function(key, e) {
    var obj;
    obj = {};
    obj[key] = e.target.value;
    return this.setState(obj);
  },
  render: function() {
    return React.createElement("div", {
      "className": 'new-task'
    }, React.createElement("input", {
      "value": this.state.title,
      "onChange": this.onChange.bind(this, 'title'),
      "placeholder": 'title'
    }), React.createElement("br", null), React.createElement("input", {
      "value": this.state.rate,
      "onChange": this.onChange.bind(this, 'rate'),
      "placeholder": 'default rate'
    }), React.createElement("br", null), React.createElement("input", {
      "value": this.state.project,
      "onChange": this.onChange.bind(this, 'currency'),
      "placeholder": 'currency'
    }), React.createElement("br", null), React.createElement("button", {
      "onClick": this.addProject
    }, "add project"));
  }
});
});

;require.register("layouts/new-task/index", function(exports, require, module) {
var Autocomplete, ProjectsActions, ProjectsStore, TasksActions, TasksStore;

TasksStore = require('store/tasks');

TasksActions = require('actions/tasks');

ProjectsActions = require('actions/projects');

ProjectsStore = require('store/projects');

Autocomplete = require('components/autocomplete');

module.exports = React.createClass({
  mixins: [Reflux.connect(ProjectsStore, 'projects')],
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
    var state;
    state = this.state;
    delete state.projects;
    return TasksActions.add(state);
  },
  projectSelect: function(i) {
    return this.setState({
      'project': i.id
    });
  },
  onChange: function(key, e) {
    var obj;
    obj = {};
    obj[key] = e.target.value;
    return this.setState(obj);
  },
  render: function() {
    return React.createElement("div", {
      "className": 'new-task'
    }, React.createElement("input", {
      "value": this.state.title,
      "onChange": this.onChange.bind(this, 'title'),
      "placeholder": 'title'
    }), React.createElement("br", null), React.createElement(Autocomplete, {
      "list": this.state.projects,
      "valueKey": 'id',
      "titleKey": 'title',
      "onSelect": this.projectSelect
    }), React.createElement("input", {
      "value": this.state.rate,
      "onChange": this.onChange.bind(this, 'rate'),
      "placeholder": 'rate'
    }), React.createElement("br", null), React.createElement("input", {
      "value": this.state.currency,
      "placeholder": 'currency',
      "readOnly": true
    }), React.createElement("br", null), React.createElement("input", {
      "placeholder": 'estimate',
      "readOnly": true
    }), React.createElement("br", null), React.createElement("input", {
      "placeholder": 'deadline',
      "readOnly": true
    }), React.createElement("br", null), React.createElement("input", {
      "value": this.state.complexity,
      "onChange": this.onChange.bind(this, 'complexity'),
      "placeholder": 'complexity'
    }), React.createElement("br", null), React.createElement("button", {
      "onClick": this.addTask
    }, "add task"));
  }
});
});

;require.register("layouts/task/index", function(exports, require, module) {
var TasksActions, TasksStore;

TasksStore = require('store/tasks');

TasksActions = require('actions/tasks');

module.exports = React.createClass({
  mixins: [
    Reflux.connectFilter(TasksStore, 'task', function(tasks) {
      return _.filter(tasks, 'id', this.props.params.id)[0];
    })
  ],
  start: function() {
    return TasksActions.addTimeslot(this.state.task.id);
  },
  stop: function() {
    return TasksActions.stopTimeslot(this.state.task.id);
  },
  totalWorked: function() {
    return this.state.task.timeslots.reduce((function(i, n) {
      return i + n.duration;
    }), 0);
  },
  render: function() {
    return React.createElement("div", null, this.state.task.title, React.createElement("br", null), this.state.task.rate, this.state.task.currency, React.createElement("br", null), "worked : ", this.totalWorked(), "s", React.createElement("br", null), "earned : ", this.totalWorked() / 3600 * this.state.task.rate, this.state.task.currency, React.createElement("br", null), React.createElement("button", {
      "onClick": this.start
    }, "Start"), React.createElement("button", {
      "onClick": this.stop
    }, "Stop"));
  }
});
});

;require.register("layouts/timeline/index", function(exports, require, module) {
var Dateribbon, ProjectsStore, TaskItem, TasksStore;

TasksStore = require('store/tasks');

ProjectsStore = require('store/projects');

TaskItem = require('components/taskItem');

Dateribbon = require('components/dateribbon');

module.exports = React.createClass({
  mixins: [Reflux.connect(TasksStore, 'tasks')],
  tasksByDay: function() {
    var tasks, _ref;
    console.time('start');
    tasks = _.filter((_ref = this.state) != null ? _ref.tasks : void 0, (function(_this) {
      return function(task) {
        return moment(task.lastStart).isSame(_this.props.params.date, 'day') || _.some(task.timeslots, function(slot) {
          return moment(slot).isSame(_this.props.params.date, 'day');
        });
      };
    })(this));
    console.log(tasks);
    console.timeEnd('start');
    return '';
  },
  render: function() {
    return React.createElement("div", {
      "className": 'timeline'
    }, React.createElement(Dateribbon, {
      "onSelect": this.showByDate
    }), this.tasksByDay());
  }
});
});

;require.register("router", function(exports, require, module) {
var App, NewProject, NewTask, Route, Task, Timeline, routes;

App = require('app');

Timeline = require('layouts/timeline');

NewTask = require('layouts/new-task');

NewProject = require('layouts/new-project');

Task = require('layouts/task');

Route = ReactRouter.Route;

routes = React.createElement(Route, {
  "handler": App
}, React.createElement(Route, {
  "name": 'new-task',
  "handler": NewTask
}), React.createElement(Route, {
  "name": 'new-project',
  "handler": NewProject
}), React.createElement(Route, {
  "name": 'timeline',
  "path": '/timeline/:date',
  "handler": Timeline
}), React.createElement(Route, {
  "name": 'task',
  "path": '/task/:id',
  "handler": Task
}));

ReactRouter.run(routes, function(Trakr) {
  return React.render(React.createElement(Trakr, null), document.body);
});
});

;require.register("store/projects", function(exports, require, module) {
var ProjectsActions;

ProjectsActions = require('actions/projects');

module.exports = Reflux.createStore({
  listenables: [ProjectsActions],
  getInitialState: function() {
    return this.projects || [];
  },
  init: function() {
    return this.projects = _.load('projects') || [];
  },
  update: function() {
    this.trigger(this.projects);
    return _.save(this.projects, 'projects');
  },
  onAdd: function(params) {
    this.projects.push({
      title: params.title,
      rate: params.rate,
      currency: params.currency,
      tasks: []
    });
    return this.update();
  },
  onAddTask: function(id, task) {
    this.projects = this.projects.map(function(project) {
      if (project.id === id) {
        project.tasks.push(task);
      }
      return project;
    });
    return this.update();
  }
});
});

;require.register("store/tasks", function(exports, require, module) {
var ProjectsActions, TasksActions;

TasksActions = require('actions/tasks');

ProjectsActions = require('actions/projects');

module.exports = Reflux.createStore({
  listenables: [TasksActions],
  getInitialState: function() {
    return this.tasks || [];
  },
  init: function() {
    this.tasks = _.load('tasks');
    return setInterval(((function(_this) {
      return function() {
        return _this.updateTimeslot();
      };
    })(this)), 1000);
  },
  getSession: function(id, key) {
    var task;
    task = _.get(this.tasks, id);
    return task.sessions[key] || [];
  },
  update: function() {
    this.trigger(this.tasks);
    return _.save(this.tasks, 'tasks');
  },
  updateTimeslot: function() {
    this.tasks = this.tasks.map(function(task) {
      if (task.isActive) {
        task.sessions[task.sessions.length - 1].duration += 1;
      }
      return task;
    });
    return this.update();
  },
  onAdd: function(params) {
    var id;
    id = uuid();
    this.tasks.push({
      id: id,
      title: params.title,
      rate: params.rate,
      currency: params.currency,
      lastStart: moment().toISOString(),
      project: params.project,
      sessions: {}
    });
    ProjectsActions.addTask(params.project, id);
    return this.update();
  },
  onAddTimeslot: function(id) {
    var key, task;
    task = this.get(id);
    key = moment().format('YYYY-MM-DD');
    if (!task.sessions[key]) {
      task.sessions[key] = [];
    }
    task.sessions[key].push({
      duration: 0,
      start: moment().toISOString()
    });
    return this.update();
  },
  onStopTimeslot: function(id) {
    this.tasks = this.tasks.map(function(task) {
      task.isActive = false;
      if (task.id === id) {
        task.lastStart = moment().toISOString();
        task.isActive = false;
        task.sessions.push({
          start: moment().toISOString(),
          duration: 0
        });
      }
      return task;
    });
    return this.update();
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

;
//# sourceMappingURL=app.js.map