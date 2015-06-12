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
require.register("actions/activity", function(exports, require, module) {
module.exports = Reflux.createActions(['add']);
});

;require.register("actions/projects", function(exports, require, module) {
module.exports = Reflux.createActions(['add', 'addTask']);
});

;require.register("actions/tasks", function(exports, require, module) {
module.exports = Reflux.createActions(['add', 'addTimeslot', 'stopTimeslot']);
});

;require.register("actions/timeslots", function(exports, require, module) {
module.exports = Reflux.createActions(['add', 'update']);
});

;require.register("app", function(exports, require, module) {
var Link;

Link = ReactRouter.Link;

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": '-app'
    }, React.createElement("div", {
      "className": 'dev-menu'
    }, React.createElement(Link, {
      "to": 'timeline',
      "params": {
        date: moment().format('YYYY-MM-DD')
      }
    }, "timeline"), " |", React.createElement(Link, {
      "to": 'projects'
    }, "projects"), " |", React.createElement(Link, {
      "to": 'new-task'
    }, "new task"), " |", React.createElement(Link, {
      "to": 'new-project'
    }, "new project"), " |"), React.createElement(ReactRouter.RouteHandler, null));
  }
});
});

;require.register("components/autocomplete/index", function(exports, require, module) {
module.exports = React.createClass({
  propTypes: {
    onFilter: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    renderItem: React.PropTypes.func,
    list: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]),
    titleKey: React.PropTypes.string,
    valueKey: React.PropTypes.string,
    placeholder: React.PropTypes.string
  },
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
        if (_this.props.onFilter) {
          return _this.props.onFilter(value, i);
        }
        return reg.test(i[_this.props.titleKey]) || reg.test(i[_this.props.valueKey]);
      };
    })(this));
    return this.setState({
      list: filteredList,
      value: value
    });
  },
  handleFocus: function(e) {
    this.setState({
      isOpen: true
    });
    return this.onChange(e);
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
    return this.props.onSelect(item[this.props.valueKey], item);
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
      "onBlur": this.handleBlur,
      "placeholder": this.props.placeholder,
      "tabIndex": '1'
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

;require.register("components/datepicker/index", function(exports, require, module) {
var Month, ToTuple;

ToTuple = require('utils/momentToTuple');

Month = require('components/datepicker/month');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      currentMonth: ToTuple(moment()),
      isOpen: false,
      isHideable: true
    };
  },
  setMonth: function(inc) {
    var d, m, y, _ref;
    _ref = this.state.currentMonth, y = _ref[0], m = _ref[1], d = _ref[2];
    if (m + inc > 11) {
      m = 0;
      y += 1;
    } else if (m + inc < 0) {
      m = 11;
      y -= 1;
    } else {
      m += inc;
    }
    return this.setState({
      currentMonth: [y, m, d]
    });
  },
  onSelect: function(date) {
    var curMonth, curYear, _ref;
    _ref = this.state.currentMonth, curYear = _ref[0], curMonth = _ref[1];
    if (date[0] !== curYear || date[1] !== curMonth) {
      return;
    }
    this.props.onSelect(moment(date).format('YYYY-MM-DD'));
    return this.hide();
  },
  hide: function() {
    return this.setState({
      'isOpen': false
    });
  },
  show: function() {
    return this.setState({
      'isOpen': true
    });
  },
  handleBlur: function() {
    if (this.state.isHideable) {
      return this.hide();
    }
  },
  mouseDown: function() {
    this.setState({
      'isHideable': false
    });
    return React.findDOMNode(this.refs.input).focus();
  },
  mouseUp: function() {
    this.setState({
      'isHideable': true
    });
    return React.findDOMNode(this.refs.input).focus();
  },
  render: function() {
    var isActive, title;
    title = moment(this.state.currentMonth);
    isActive = {
      active: this.state.isOpen
    };
    return React.createElement("div", null, React.createElement("span", {
      "ref": 'input',
      "className": classNames('input', isActive),
      "onFocus": this.show,
      "onClick": this.show,
      "onBlur": this.handleBlur,
      "children": this.props.selected,
      "tabIndex": '1'
    }), React.createElement("div", {
      "className": classNames('-datepicker', isActive),
      "onMouseDown": this.mouseDown,
      "onMouseUp": this.mouseUp
    }, React.createElement("div", {
      "className": 'header'
    }, React.createElement("span", {
      "onClick": this.setMonth.bind(this, -1)
    }, "prev"), React.createElement("span", null, title.format('MMMM YYYY')), React.createElement("span", {
      "onClick": this.setMonth.bind(this, 1)
    }, "next")), React.createElement(Month, {
      "month": this.state.currentMonth,
      "onSelect": this.onSelect,
      "selected": this.props.selected
    })));
  }
});
});

;require.register("components/datepicker/month", function(exports, require, module) {
var ToTuple;

ToTuple = require('utils/momentToTuple');

module.exports = React.createClass({
  getMonth: function() {
    var end, month, ret, start;
    month = this.props.month;
    start = moment(month).startOf('month').startOf('week');
    end = moment(month).endOf('month').endOf('week');
    ret = [];
    moment.range(start, end).by('day', (function(_this) {
      return function(date) {
        return ret.push(ToTuple(date));
      };
    })(this));
    return ret;
  },
  renderDate: function(day) {
    var className;
    if (day[1] !== this.props.month[1]) {
      className = 'other-month';
    }
    if (moment(day).format('YYYY-MM-DD') === this.props.selected) {
      className = 'active';
    }
    return React.createElement("li", {
      "key": day.join('-'),
      "className": className,
      "onClick": this.props.onSelect.bind(null, day)
    }, day[2]);
  },
  render: function() {
    return React.createElement("ul", null, _.map(this.getMonth(), (function(_this) {
      return function(date) {
        return _this.renderDate(date);
      };
    })(this)));
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
  date: function(date, i) {
    return React.createElement(Link, {
      "key": i,
      "to": 'timeline',
      "params": {
        date: date
      }
    }, moment(date).format('D ddd'));
  },
  render: function() {
    var dates;
    dates = this.props.dates.sort().reverse();
    return React.createElement("ul", null, _.map(dates, (function(_this) {
      return function(d, i) {
        return _this.date(d, i);
      };
    })(this)), " ");
  }
});
});

;require.register("components/projectItem", function(exports, require, module) {
var Link;

Link = ReactRouter.Link;

module.exports = React.createClass({
  render: function() {
    return React.createElement(Link, {
      "to": 'project',
      "params": {
        id: this.props.project.id
      }
    }, this.props.project.title);
  }
});
});

;require.register("components/taskItem", function(exports, require, module) {
var Link, ProjectsStore;

Link = ReactRouter.Link;

ProjectsStore = require('store/projects');

module.exports = React.createClass({
  mixins: [
    Reflux.connectFilter(ProjectsStore, 'project', function(i) {
      return i[this.props.task.project];
    })
  ],
  render: function() {
    return React.createElement(Link, {
      "to": 'task',
      "params": {
        id: this.props.task.id
      }
    }, this.props.task.title, " ", this.state.project.title);
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
var Autocomplete, Currencies, Datepicker, ProjectsActions, ProjectsStore, TasksActions, TasksStore;

TasksStore = require('store/tasks');

TasksActions = require('actions/tasks');

ProjectsActions = require('actions/projects');

ProjectsStore = require('store/projects');

Autocomplete = require('components/autocomplete');

Currencies = require('utils/currencies');

Datepicker = require('components/datepicker');

module.exports = React.createClass({
  mixins: [Reflux.connect(ProjectsStore, 'projects')],
  getInitialState: function() {
    return {
      title: '',
      project: '',
      rate: 0,
      currency: '',
      estimate: '',
      deadline: '',
      complexity: 0
    };
  },
  addTask: function() {
    return TasksActions.add(this.state);
  },
  set: function(key, value) {
    var obj;
    obj = {};
    obj[key] = value;
    return this.setState(obj);
  },
  onChange: function(key, e) {
    return this.set(key, e.target.value);
  },
  render: function() {
    return React.createElement("div", {
      "className": '-screen new-task'
    }, React.createElement("header", null, React.createElement("p", null, "New task")), React.createElement("label", {
      "className": 'row'
    }, React.createElement("input", {
      "value": this.state.title,
      "onChange": this.onChange.bind(this, 'title'),
      "tabIndex": '1',
      "required": true
    }), React.createElement("span", null, "Task")), React.createElement("br", null), React.createElement("br", null), React.createElement("br", null), React.createElement(Autocomplete, {
      "list": this.state.projects,
      "valueKey": 'id',
      "titleKey": 'title',
      "onSelect": this.set.bind(this, 'project'),
      "placeholder": 'project'
    }), React.createElement("input", {
      "value": this.state.rate,
      "onChange": this.onChange.bind(this, 'rate'),
      "placeholder": 'rate',
      "tabIndex": '1'
    }), React.createElement("br", null), React.createElement(Autocomplete, {
      "list": Currencies(),
      "valueKey": 'currency',
      "titleKey": 'name',
      "onSelect": this.set.bind(this, 'currency'),
      "placeholder": 'currency'
    }), React.createElement("input", {
      "placeholder": 'estimate',
      "readOnly": true
    }), React.createElement("br", null), React.createElement(Datepicker, {
      "onSelect": this.set.bind(this, 'deadline'),
      "selected": this.state.deadline
    }), React.createElement("input", {
      "type": 'range',
      "value": this.state.complexity,
      "onChange": this.onChange.bind(this, 'complexity'),
      "min": 0.,
      "step": 1.,
      "max": 10.,
      "tabIndex": '1'
    }), React.createElement("br", null), React.createElement("button", {
      "onClick": this.addTask
    }, "add task"));
  }
});
});

;require.register("layouts/project/index", function(exports, require, module) {
var ProjectsStore, TaskItem, TasksStore,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

TasksStore = require('store/tasks');

ProjectsStore = require('store/projects');

TaskItem = require('components/taskItem');

module.exports = React.createClass({
  mixins: [
    Reflux.ListenerMethods, Reflux.connectFilter(ProjectsStore, 'project', function(i) {
      return i[this.props.params.id];
    })
  ],
  setTasks: function(allTasks) {
    var projectTasks;
    projectTasks = this.state.project.tasks;
    return this.setState({
      tasks: _.filter(allTasks, function(_, key) {
        return __indexOf.call(projectTasks, key) >= 0;
      })
    });
  },
  componentWillMount: function() {
    this.setTasks(TasksStore.tasks);
    return this.listenTo(TasksStore, this.setTasks);
  },
  render: function() {
    return React.createElement("div", null, this.state.project.title, React.createElement("br", null), React.createElement("ul", null, _.map(this.state.tasks, function(t, i) {
      return React.createElement(TaskItem, {
        "key": i,
        "task": t
      });
    })));
  }
});
});

;require.register("layouts/projects/index", function(exports, require, module) {
var ProjectItem, ProjectsStore;

ProjectsStore = require('store/projects');

ProjectItem = require('components/projectItem');

module.exports = React.createClass({
  mixins: [Reflux.connect(ProjectsStore, 'projects')],
  tasksByDay: function() {
    return _.map(this.state.activity[this.props.params.date], (function(_this) {
      return function(taskId) {
        return React.createElement(TaskItem, {
          "key": taskId,
          "task": _this.state.tasks[taskId]
        });
      };
    })(this));
  },
  render: function() {
    return React.createElement("div", {
      "className": '-screen timeline'
    }, _.map(this.state.projects, (function(_this) {
      return function(project, id) {
        return React.createElement(ProjectItem, {
          "key": id,
          "project": project
        });
      };
    })(this)));
  }
});
});

;require.register("layouts/task/index", function(exports, require, module) {
var Link, ProjectsStore, TasksActions, TasksStore, TimeslotsStore, hhmm;

TasksStore = require('store/tasks');

TimeslotsStore = require('store/timeslots');

ProjectsStore = require('store/projects');

TasksActions = require('actions/tasks');

hhmm = require('utils/formatSeconds');

Link = ReactRouter.Link;

module.exports = React.createClass({
  mixins: [
    Reflux.ListenerMethods, Reflux.connectFilter(TasksStore, 'task', function(i) {
      return i[this.props.params.id];
    }), Reflux.connectFilter(TimeslotsStore, 'timeslots', function(i) {
      return i[this.props.params.id];
    })
  ],
  setProject: function(projects) {
    return this.setState({
      project: projects[this.state.task.project]
    });
  },
  componentWillMount: function() {
    this.setProject(ProjectsStore.projects);
    return this.listenTo(ProjectsStore, this.setProject);
  },
  start: function() {
    return TasksActions.addTimeslot(this.props.params.id);
  },
  stop: function() {
    return TasksActions.stopTimeslot(this.props.params.id);
  },
  worked: function() {
    return hhmm(_.reduce(this.state.timeslots, (function(c, i) {
      return i.duration + c;
    }), 0));
  },
  render: function() {
    var worked;
    worked = this.worked();
    return React.createElement("div", null, this.state.task.title, React.createElement("br", null), React.createElement(Link, {
      "to": 'project',
      "params": {
        id: this.state.task.project
      }
    }, this.state.project.title), this.state.task.rate, this.state.task.currency, React.createElement("br", null), "worked : ", worked[0], "h ", worked[1], "m ", worked[2], "s", React.createElement("br", null), "earned : ", worked[3] / 3600 * this.state.task.rate, this.state.task.currency, React.createElement("br", null), React.createElement("button", {
      "onClick": this.start
    }, "Start"), React.createElement("button", {
      "onClick": this.stop
    }, "Stop"));
  }
});
});

;require.register("layouts/timeline/index", function(exports, require, module) {
var ActivityStore, Dateribbon, TaskItem, TasksStore;

TasksStore = require('store/tasks');

ActivityStore = require('store/activity');

TaskItem = require('components/taskItem');

Dateribbon = require('components/dateribbon');

module.exports = React.createClass({
  mixins: [Reflux.connect(TasksStore, 'tasks'), Reflux.connect(ActivityStore, 'activity')],
  tasksByDay: function() {
    return _.map(this.state.activity[this.props.params.date], (function(_this) {
      return function(taskId) {
        return React.createElement(TaskItem, {
          "key": taskId,
          "task": _this.state.tasks[taskId]
        });
      };
    })(this));
  },
  render: function() {
    return React.createElement("div", {
      "className": 'timeline'
    }, React.createElement(Dateribbon, {
      "dates": _.keys(this.state.activity)
    }), this.tasksByDay());
  }
});
});

;require.register("router", function(exports, require, module) {
var App, NewProject, NewTask, Project, Projects, Route, Task, Timeline, routes;

App = require('app');

Timeline = require('layouts/timeline');

NewTask = require('layouts/new-task');

NewProject = require('layouts/new-project');

Task = require('layouts/task');

Projects = require('layouts/projects');

Project = require('layouts/project');

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
  "name": 'projects',
  "handler": Projects
}), React.createElement(Route, {
  "name": 'project',
  "path": '/project/:id',
  "handler": Project
}), React.createElement(Route, {
  "name": 'task',
  "path": '/task/:id',
  "handler": Task
}));

ReactRouter.run(routes, function(Trakr) {
  return React.render(React.createElement(Trakr, null), document.body);
});
});

;require.register("store/activity", function(exports, require, module) {
var ActivityActions;

ActivityActions = require('actions/activity');

module.exports = Reflux.createStore({
  listenables: [ActivityActions],
  getInitialState: function() {
    return this.activity || {};
  },
  init: function() {
    return this.activity = _.load('activity') || {};
  },
  inform: function() {
    this.trigger(this.activity);
    return _.save(this.activity, 'activity');
  },
  get: function(key) {
    return this.activity[key] || [];
  },
  set: function(key, day) {
    return this.activity[key] = _.uniq(day);
  },
  todayKey: function() {
    return moment().format('YYYY-MM-DD');
  },
  onAdd: function(taskId) {
    var day, key;
    key = this.todayKey();
    day = this.get(key);
    day.push(taskId);
    this.set(key, day);
    return this.inform();
  }
});
});

;require.register("store/projects", function(exports, require, module) {
var ProjectsActions;

ProjectsActions = require('actions/projects');

module.exports = Reflux.createStore({
  listenables: [ProjectsActions],
  getInitialState: function() {
    return this.projects;
  },
  init: function() {
    return this.projects = _.load('projects') || {};
  },
  inform: function() {
    this.trigger(this.projects);
    return _.save(this.projects, 'projects');
  },
  get: function(id) {
    return this.projects[id] || {};
  },
  set: function(id, project) {
    return this.projects[id] = project;
  },
  onAdd: function(payload) {
    var id, project;
    id = _.createId();
    project = _.merge(payload, {
      tasks: [],
      id: id
    });
    this.set(id, project);
    return this.inform();
  },
  onAddTask: function(id, task) {
    var project;
    project = this.get(id);
    project.tasks.push(task);
    this.set(id, project);
    return this.inform();
  }
});
});

;require.register("store/tasks", function(exports, require, module) {
var Activity, Projects, TasksActions, Timeslots;

TasksActions = require('actions/tasks');

Projects = require('actions/projects');

Timeslots = require('actions/timeslots');

Activity = require('actions/activity');

module.exports = Reflux.createStore({
  listenables: [TasksActions],
  getInitialState: function() {
    return this.tasks || {};
  },
  init: function() {
    this.tasks = _.load('tasks') || {};
    this.activeTask = null;
    return setInterval(((function(_this) {
      return function() {
        return _this.updateTimeslot();
      };
    })(this)), 1000);
  },
  inform: function() {
    this.trigger(this.tasks);
    return _.save(this.tasks, 'tasks');
  },
  get: function(id) {
    return this.tasks[id] || {};
  },
  set: function(id, task) {
    return this.tasks[id] = task;
  },
  onAdd: function(payload) {
    var id;
    id = _.createId();
    this.set(id, _.merge(payload, {
      id: id
    }));
    Projects.addTask(payload.project, id);
    Activity.add(id);
    return this.inform();
  },
  updateTimeslot: function() {
    if (!this.activeTask) {
      return;
    }
    Timeslots.update(this.activeTask);
    Activity.add(this.activeTask);
    return this.inform();
  },
  onAddTimeslot: function(id) {
    this.activeTask = id;
    Timeslots.add(id);
    Activity.add(id);
    return this.inform();
  },
  onStopTimeslot: function() {
    this.activeTask = null;
    return this.inform();
  }
});
});

;require.register("store/timeslots", function(exports, require, module) {
var TimeslotsActions;

TimeslotsActions = require('actions/timeslots');

module.exports = Reflux.createStore({
  listenables: [TimeslotsActions],
  getInitialState: function() {
    return this.timeslots || {};
  },
  init: function() {
    return this.timeslots = _.load('timeslots') || {};
  },
  inform: function() {
    this.trigger(this.timeslots);
    return _.save(this.timeslots, 'timeslots');
  },
  get: function(key) {
    return this.timeslots[key] || [];
  },
  set: function(key, taskTimeslots) {
    return this.timeslots[key] = taskTimeslots;
  },
  onAdd: function(taskId) {
    var taskTimeslots;
    taskTimeslots = this.get(taskId);
    taskTimeslots.push({
      start: moment().toISOString(),
      duration: 0
    });
    this.set(taskId, taskTimeslots);
    return this.inform();
  },
  onUpdate: function(taskId) {
    var taskTimeslots;
    taskTimeslots = this.get(taskId);
    taskTimeslots[taskTimeslots.length - 1].duration += 1;
    this.set(taskId, taskTimeslots);
    return this.inform();
  }
});
});

;require.register("utils/currencies", function(exports, require, module) {
module.exports = function() {
  return [
    {
      currency: 'AED',
      symbol: '\u062f.\u0625;',
      name: 'UAE dirham'
    }, {
      currency: 'AFN',
      symbol: 'Afs',
      name: 'Afghan afghani'
    }, {
      currency: 'ALL',
      symbol: 'L',
      name: 'Albanian lek'
    }, {
      currency: 'AMD',
      symbol: 'AMD',
      name: 'Armenian dram'
    }, {
      currency: 'ANG',
      symbol: 'NA\u0192',
      name: 'Netherlands Antillean gulden'
    }, {
      currency: 'AOA',
      symbol: 'Kz',
      name: 'Angolan kwanza'
    }, {
      currency: 'ARS',
      symbol: '$',
      name: 'Argentine peso'
    }, {
      currency: 'AUD',
      symbol: '$',
      name: 'Australian dollar'
    }, {
      currency: 'AWG',
      symbol: '\u0192',
      name: 'Aruban florin'
    }, {
      currency: 'AZN',
      symbol: 'AZN',
      name: 'Azerbaijani manat'
    }, {
      currency: 'BAM',
      symbol: 'KM',
      name: 'Bosnia and Herzegovina konvertibilna marka'
    }, {
      currency: 'BBD',
      symbol: 'Bds$',
      name: 'Barbadian dollar'
    }, {
      currency: 'BDT',
      symbol: '\u09f3',
      name: 'Bangladeshi taka'
    }, {
      currency: 'BGN',
      symbol: 'BGN',
      name: 'Bulgarian lev'
    }, {
      currency: 'BHD',
      symbol: '.\u062f.\u0628',
      name: 'Bahraini dinar'
    }, {
      currency: 'BIF',
      symbol: 'FBu',
      name: 'Burundi franc'
    }, {
      currency: 'BMD',
      symbol: 'BD$',
      name: 'Bermudian dollar'
    }, {
      currency: 'BND',
      symbol: 'B$',
      name: 'Brunei dollar'
    }, {
      currency: 'BOB',
      symbol: 'Bs.',
      name: 'Bolivian boliviano'
    }, {
      currency: 'BRL',
      symbol: 'R$',
      name: 'Brazilian real'
    }, {
      currency: 'BSD',
      symbol: 'B$',
      name: 'Bahamian dollar'
    }, {
      currency: 'BTN',
      symbol: 'Nu.',
      name: 'Bhutanese ngultrum'
    }, {
      currency: 'BWP',
      symbol: 'P',
      name: 'Botswana pula'
    }, {
      currency: 'BYR',
      symbol: 'Br',
      name: 'Belarusian ruble'
    }, {
      currency: 'BZD',
      symbol: 'BZ$',
      name: 'Belize dollar'
    }, {
      currency: 'CAD',
      symbol: '$',
      name: 'Canadian dollar'
    }, {
      currency: 'CDF',
      symbol: 'F',
      name: 'Congolese franc'
    }, {
      currency: 'CHF',
      symbol: 'Fr.',
      name: 'Swiss franc'
    }, {
      currency: 'CLP',
      symbol: '$',
      name: 'Chilean peso'
    }, {
      currency: 'CNY',
      symbol: '\u00a5',
      name: 'Chinese/Yuan renminbi'
    }, {
      currency: 'COP',
      symbol: 'Col$',
      name: 'Colombian peso'
    }, {
      currency: 'CRC',
      symbol: '\u20a1',
      name: 'Costa Rican colon'
    }, {
      currency: 'CUC',
      symbol: '$',
      name: 'Cuban peso'
    }, {
      currency: 'CVE',
      symbol: 'Esc',
      name: 'Cape Verdean escudo'
    }, {
      currency: 'CZK',
      symbol: 'K\u010d',
      name: 'Czech koruna'
    }, {
      currency: 'DJF',
      symbol: 'Fdj',
      name: 'Djiboutian franc'
    }, {
      currency: 'DKK',
      symbol: 'Kr',
      name: 'Danish krone'
    }, {
      currency: 'DOP',
      symbol: 'RD$',
      name: 'Dominican peso'
    }, {
      currency: 'DZD',
      symbol: '\u062f.\u062c',
      name: 'Algerian dinar'
    }, {
      currency: 'EEK',
      symbol: 'KR',
      name: 'Estonian kroon'
    }, {
      currency: 'EGP',
      symbol: '\u00a3',
      name: 'Egyptian pound'
    }, {
      currency: 'ERN',
      symbol: 'Nfa',
      name: 'Eritrean nakfa'
    }, {
      currency: 'ETB',
      symbol: 'Br',
      name: 'Ethiopian birr'
    }, {
      currency: 'EUR',
      symbol: '\u20ac',
      name: 'European Euro'
    }, {
      currency: 'FJD',
      symbol: 'FJ$',
      name: 'Fijian dollar'
    }, {
      currency: 'FKP',
      symbol: '\u00a3',
      name: 'Falkland Islands pound'
    }, {
      currency: 'GBP',
      symbol: '\u00a3',
      name: 'British pound'
    }, {
      currency: 'GEL',
      symbol: 'GEL',
      name: 'Georgian lari'
    }, {
      currency: 'GHS',
      symbol: 'GH\u20b5',
      name: 'Ghanaian cedi'
    }, {
      currency: 'GIP',
      symbol: '\u00a3',
      name: 'Gibraltar pound'
    }, {
      currency: 'GMD',
      symbol: 'D',
      name: 'Gambian dalasi'
    }, {
      currency: 'GNF',
      symbol: 'FG',
      name: 'Guinean franc'
    }, {
      currency: 'GQE',
      symbol: 'CFA',
      name: 'Central African CFA franc'
    }, {
      currency: 'GTQ',
      symbol: 'Q',
      name: 'Guatemalan quetzal'
    }, {
      currency: 'GYD',
      symbol: 'GY$',
      name: 'Guyanese dollar'
    }, {
      currency: 'HKD',
      symbol: 'HK$',
      name: 'Hong Kong dollar'
    }, {
      currency: 'HNL',
      symbol: 'L',
      name: 'Honduran lempira'
    }, {
      currency: 'HRK',
      symbol: 'kn',
      name: 'Croatian kuna'
    }, {
      currency: 'HTG',
      symbol: 'G',
      name: 'Haitian gourde'
    }, {
      currency: 'HUF',
      symbol: 'Ft',
      name: 'Hungarian forint'
    }, {
      currency: 'IDR',
      symbol: 'Rp',
      name: 'Indonesian rupiah'
    }, {
      currency: 'ILS',
      symbol: '\u20aa',
      name: 'Israeli new sheqel'
    }, {
      currency: 'INR',
      symbol: '\u20B9',
      name: 'Indian rupee'
    }, {
      currency: 'IQD',
      symbol: '\u062f.\u0639',
      name: 'Iraqi dinar'
    }, {
      currency: 'IRR',
      symbol: 'IRR',
      name: 'Iranian rial'
    }, {
      currency: 'ISK',
      symbol: 'kr',
      name: 'Icelandic kr\u00f3na'
    }, {
      currency: 'JMD',
      symbol: 'J$',
      name: 'Jamaican dollar'
    }, {
      currency: 'JOD',
      symbol: 'JOD',
      name: 'Jordanian dinar'
    }, {
      currency: 'JPY',
      symbol: '\u00a5',
      name: 'Japanese yen'
    }, {
      currency: 'KES',
      symbol: 'KSh',
      name: 'Kenyan shilling'
    }, {
      currency: 'KGS',
      symbol: '\u0441\u043e\u043c',
      name: 'Kyrgyzstani som'
    }, {
      currency: 'KHR',
      symbol: '\u17db',
      name: 'Cambodian riel'
    }, {
      currency: 'KMF',
      symbol: 'KMF',
      name: 'Comorian franc'
    }, {
      currency: 'KPW',
      symbol: 'W',
      name: 'North Korean won'
    }, {
      currency: 'KRW',
      symbol: 'W',
      name: 'South Korean won'
    }, {
      currency: 'KWD',
      symbol: 'KWD',
      name: 'Kuwaiti dinar'
    }, {
      currency: 'KYD',
      symbol: 'KY$',
      name: 'Cayman Islands dollar'
    }, {
      currency: 'KZT',
      symbol: 'T',
      name: 'Kazakhstani tenge'
    }, {
      currency: 'LAK',
      symbol: 'KN',
      name: 'Lao kip'
    }, {
      currency: 'LBP',
      symbol: '\u00a3',
      name: 'Lebanese lira'
    }, {
      currency: 'LKR',
      symbol: 'Rs',
      name: 'Sri Lankan rupee'
    }, {
      currency: 'LRD',
      symbol: 'L$',
      name: 'Liberian dollar'
    }, {
      currency: 'LSL',
      symbol: 'M',
      name: 'Lesotho loti'
    }, {
      currency: 'LTL',
      symbol: 'Lt',
      name: 'Lithuanian litas'
    }, {
      currency: 'LVL',
      symbol: 'Ls',
      name: 'Latvian lats'
    }, {
      currency: 'LYD',
      symbol: 'LD',
      name: 'Libyan dinar'
    }, {
      currency: 'MAD',
      symbol: 'MAD',
      name: 'Morocurrencyan dirham'
    }, {
      currency: 'MDL',
      symbol: 'MDL',
      name: 'Moldovan leu'
    }, {
      currency: 'MGA',
      symbol: 'FMG',
      name: 'Malagasy ariary'
    }, {
      currency: 'MKD',
      symbol: 'MKD',
      name: 'Macedonian denar'
    }, {
      currency: 'MMK',
      symbol: 'K',
      name: 'Myanma kyat'
    }, {
      currency: 'MNT',
      symbol: '\u20ae',
      name: 'Mongolian tugrik'
    }, {
      currency: 'MOP',
      symbol: 'P',
      name: 'Macanese pataca'
    }, {
      currency: 'MRO',
      symbol: 'UM',
      name: 'Mauritanian ouguiya'
    }, {
      currency: 'MUR',
      symbol: 'Rs',
      name: 'Mauritian rupee'
    }, {
      currency: 'MVR',
      symbol: 'Rf',
      name: 'Maldivian rufiyaa'
    }, {
      currency: 'MWK',
      symbol: 'MK',
      name: 'Malawian kwacha'
    }, {
      currency: 'MXN',
      symbol: '$',
      name: 'Mexican peso'
    }, {
      currency: 'MYR',
      symbol: 'RM',
      name: 'Malaysian ringgit'
    }, {
      currency: 'MZM',
      symbol: 'MTn',
      name: 'Mozambican metical'
    }, {
      currency: 'NAD',
      symbol: 'N$',
      name: 'Namibian dollar'
    }, {
      currency: 'NGN',
      symbol: '\u20a6',
      name: 'Nigerian naira'
    }, {
      currency: 'NIO',
      symbol: 'C$',
      name: 'Nicaraguan c\u00f3rdoba'
    }, {
      currency: 'NOK',
      symbol: 'kr',
      name: 'Norwegian krone'
    }, {
      currency: 'NPR',
      symbol: 'NRs',
      name: 'Nepalese rupee'
    }, {
      currency: 'NZD',
      symbol: 'NZ$',
      name: 'New Zealand dollar'
    }, {
      currency: 'OMR',
      symbol: 'OMR',
      name: 'Omani rial'
    }, {
      currency: 'PAB',
      symbol: 'B./',
      name: 'Panamanian balboa'
    }, {
      currency: 'PEN',
      symbol: 'S/.',
      name: 'Peruvian nuevo sol'
    }, {
      currency: 'PGK',
      symbol: 'K',
      name: 'Papua New Guinean kina'
    }, {
      currency: 'PHP',
      symbol: '\u20b1',
      name: 'Philippine peso'
    }, {
      currency: 'PKR',
      symbol: 'Rs.',
      name: 'Pakistani rupee'
    }, {
      currency: 'PLN',
      symbol: 'z\u0142',
      name: 'Polish zloty'
    }, {
      currency: 'PYG',
      symbol: '\u20b2',
      name: 'Paraguayan guarani'
    }, {
      currency: 'QAR',
      symbol: 'QR',
      name: 'Qatari riyal'
    }, {
      currency: 'RON',
      symbol: 'L',
      name: 'Romanian leu'
    }, {
      currency: 'RSD',
      symbol: 'din.',
      name: 'Serbian dinar'
    }, {
      currency: 'RUB',
      symbol: 'R',
      name: 'Russian ruble'
    }, {
      currency: 'SAR',
      symbol: 'SR',
      name: 'Saudi riyal'
    }, {
      currency: 'SBD',
      symbol: 'SI$',
      name: 'Solomon Islands dollar'
    }, {
      currency: 'SCR',
      symbol: 'SR',
      name: 'Seychellois rupee'
    }, {
      currency: 'SDG',
      symbol: 'SDG',
      name: 'Sudanese pound'
    }, {
      currency: 'SEK',
      symbol: 'kr',
      name: 'Swedish krona'
    }, {
      currency: 'SGD',
      symbol: 'S$',
      name: 'Singapore dollar'
    }, {
      currency: 'SHP',
      symbol: '\u00a3',
      name: 'Saint Helena pound'
    }, {
      currency: 'SLL',
      symbol: 'Le',
      name: 'Sierra Leonean leone'
    }, {
      currency: 'SOS',
      symbol: 'Sh.',
      name: 'Somali shilling'
    }, {
      currency: 'SRD',
      symbol: '$',
      name: 'Surinamese dollar'
    }, {
      currency: 'SYP',
      symbol: 'LS',
      name: 'Syrian pound'
    }, {
      currency: 'SZL',
      symbol: 'E',
      name: 'Swazi lilangeni'
    }, {
      currency: 'THB',
      symbol: '\u0e3f',
      name: 'Thai baht'
    }, {
      currency: 'TJS',
      symbol: 'TJS',
      name: 'Tajikistani somoni'
    }, {
      currency: 'TMT',
      symbol: 'm',
      name: 'Turkmen manat'
    }, {
      currency: 'TND',
      symbol: 'DT',
      name: 'Tunisian dinar'
    }, {
      currency: 'TRY',
      symbol: 'TRY',
      name: 'Turkish new lira'
    }, {
      currency: 'TTD',
      symbol: 'TT$',
      name: 'Trinidad and Tobago dollar'
    }, {
      currency: 'TWD',
      symbol: 'NT$',
      name: 'New Taiwan dollar'
    }, {
      currency: 'TZS',
      symbol: 'TZS',
      name: 'Tanzanian shilling'
    }, {
      currency: 'UAH',
      symbol: 'UAH',
      name: 'Ukrainian hryvnia'
    }, {
      currency: 'UGX',
      symbol: 'USh',
      name: 'Ugandan shilling'
    }, {
      currency: 'USD',
      symbol: 'US$',
      name: 'United States dollar'
    }, {
      currency: 'UYU',
      symbol: '$U',
      name: 'Uruguayan peso'
    }, {
      currency: 'UZS',
      symbol: 'UZS',
      name: 'Uzbekistani som'
    }, {
      currency: 'VEB',
      symbol: 'Bs',
      name: 'Venezuelan bolivar'
    }, {
      currency: 'VND',
      symbol: '\u20ab',
      name: 'Vietnamese dong'
    }, {
      currency: 'VUV',
      symbol: 'VT',
      name: 'Vanuatu vatu'
    }, {
      currency: 'WST',
      symbol: 'WS$',
      name: 'Samoan tala'
    }, {
      currency: 'XAF',
      symbol: 'CFA',
      name: 'Central African CFA franc'
    }, {
      currency: 'XCD',
      symbol: 'EC$',
      name: 'East Caribbean dollar'
    }, {
      currency: 'XDR',
      symbol: 'SDR',
      name: 'Special Drawing Rights'
    }, {
      currency: 'XOF',
      symbol: 'CFA',
      name: 'West African CFA franc'
    }, {
      currency: 'XPF',
      symbol: 'F',
      name: 'CFP franc'
    }, {
      currency: 'YER',
      symbol: 'YER',
      name: 'Yemeni rial'
    }, {
      currency: 'ZAR',
      symbol: 'R',
      name: 'South African rand'
    }, {
      currency: 'ZMK',
      symbol: 'ZK',
      name: 'Zambian kwacha'
    }, {
      currency: 'ZWR',
      symbol: 'Z$',
      name: 'Zimbabwean dollar'
    }
  ];
};
});

;require.register("utils/formatSeconds", function(exports, require, module) {
module.exports = function(total) {
  var hours, minutes, seconds;
  hours = Math.floor(total / 3600);
  minutes = Math.floor((total - hours * 3600) / 60);
  seconds = total - hours * 3600 - minutes * 60;
  return [hours, minutes, seconds, total];
};
});

;require.register("utils/momentToTuple", function(exports, require, module) {
module.exports = function(moment) {
  return [moment.get('year'), moment.get('month'), moment.get('date')];
};
});

;
//# sourceMappingURL=app.js.map