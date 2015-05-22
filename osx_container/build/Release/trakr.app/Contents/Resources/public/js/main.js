(function() {
  window.app = window.app || {};

  app.Utils = {
    uuid: function() {

      /*jshint bitwise:false */
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
    pluralize: function(count, word) {
      if (count === 1) {
        return word;
      } else {
        return word + 's';
      }
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
    },
    dayTitle: function(day) {
      var date, months;
      date = new Date(parseInt(day));
      months = 'Jan,Feb,Mar,Apr,May,June,July,Aug,Sep,Oct,Nov,Dec'.split(',');
      return date.getDate() + ' ' + months[date.getMonth()];
    },
    today: function() {
      var date;
      date = new Date;
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      return date.getTime();
    }
  };

}).call(this);

(function() {
  var DEF_RATE, TaskModel, Utils;

  window.app = window.app || {};

  Utils = app.Utils;

  DEF_RATE = 20;

  app.TaskModel = TaskModel = (function() {
    function TaskModel(key) {
      this.key = key;
      this.tasks = Utils.store(key);
      this.onChanges = [];
    }

    TaskModel.prototype.subscribe = function(onChange) {
      return this.onChanges.push(onChange);
    };

    TaskModel.prototype.inform = function() {
      Utils.store(this.key, this.tasks);
      return this.onChanges.forEach(function(cb) {
        return cb();
      });
    };

    TaskModel.prototype.addTask = function(title, rate, project) {
      this.tasks = this.tasks.concat({
        id: Utils.uuid(),
        title: title,
        rate: rate || DEF_RATE,
        lastStart: moment().toISOString(),
        project: project,
        timeslots: []
      });
      return this.inform();
    };

    TaskModel.prototype.removeTask = function(id) {
      this.tasks = this.tasks.filter(function(task) {
        return task.id !== id;
      });
      return this.inform();
    };

    TaskModel.prototype.addTimeslot = function(id) {
      this.tasks = this.tasks.map(function(task) {
        task.isActive = false;
        if (task.id === id) {
          task.lastStart = moment().toISOString();
          task.isActive = true;
          task.timeslots.push({
            start: moment().toISOString(),
            duration: 0
          });
        }
        return task;
      });
      return this.inform();
    };

    TaskModel.prototype.stopTimeslot = function(id) {
      this.tasks = this.tasks.map(function(task) {
        if (task.id === id) {
          task.isActive = false;
        }
        return task;
      });
      return this.inform();
    };

    TaskModel.prototype.updateActiveTask = function() {
      this.tasks = this.tasks.map(function(task) {
        if (task.isActive) {
          task.timeslots[task.timeslots.length - 1].duration += 1;
        }
        return task;
      });
      return this.inform();
    };

    return TaskModel;

  })();

}).call(this);

(function() {
  var Utils;

  window.app = window.app || {};

  Utils = app.Utils;

  app.TaskScreen = React.createClass({
    back: function() {
      return app.navigate('back');
    },
    timeslot: function() {
      if (this.props.task.isActive) {
        return this.props.model.stopTimeslot(this.props.task.id);
      } else {
        return this.props.model.addTimeslot(this.props.task.id);
      }
    },
    getTimeslots: function() {
      var timeslots;
      timeslots = this.props.task.timeslots;
      return _.reduce(timeslots, (function(_this) {
        return function(accumulutor, ts) {
          var end, rate, start, worked;
          rate = (_this.props.task.rate / 3600 * ts.duration).toFixed(2);
          start = moment(ts.start);
          end = moment(ts.start).add(ts.duration, 's').format('HH:mm');
          worked = moment.duration(ts.duration, 's').format('hh:mm', {
            trim: false
          });
          accumulutor.push(React.createElement("div", {
            "className": 'timeslot'
          }, React.createElement("span", {
            "className": 'worked-time'
          }, worked), React.createElement("span", {
            "className": 'date'
          }, start.format('D MMM'), ", ", start.format('HH:mm'), " \u2014 ", end), React.createElement("span", {
            "className": 'earned'
          }, "$", rate)));
          return accumulutor;
        };
      })(this), []);
    },
    getLastTimeslot: function() {
      var earned, slot, time;
      slot = this.props.task.timeslots[this.props.task.timeslots.length - 1];
      earned = String((this.props.task.rate * slot.duration / 3600).toFixed(2)).split('.');
      time = moment.duration(slot.duration, 's').format('hh/mm/ss', {
        trim: false
      }).split('/');
      return {
        worked: time,
        earned: earned
      };
    },
    render: function() {
      var activeClass, timeslots, ts;
      timeslots = this.getTimeslots();
      activeClass = this.props.task.isActive ? 'counter-cube active' : 'counter-cube';
      ts = this.getLastTimeslot();
      return React.createElement("div", {
        "className": 'task-screen'
      }, React.createElement("header", null, React.createElement("span", {
        "className": 'title'
      }, this.props.task.title), React.createElement("span", {
        "className": 'divider'
      }), React.createElement("span", {
        "className": 'back',
        "onClick": this.back
      }), React.createElement("span", {
        "className": 'edit'
      })), React.createElement("div", {
        "className": activeClass,
        "onClick": this.timeslot
      }, React.createElement("div", {
        "className": 'counter'
      }, React.createElement("div", {
        "className": 'top'
      }, React.createElement("div", {
        "className": 'start'
      }, "Start")), React.createElement("div", {
        "className": 'center'
      }, React.createElement("div", {
        "className": 'worked'
      }, ts.worked[0], ":", ts.worked[1], React.createElement("span", {
        "className": 'small'
      }, ":", ts.worked[2]), React.createElement("span", {
        "className": 'description'
      }, "worked")), React.createElement("div", {
        "className": 'earned'
      }, React.createElement("span", {
        "className": 'currency'
      }, "$"), ts.earned[0], React.createElement("span", {
        "className": 'small'
      }, ".", ts.earned[1]), React.createElement("span", {
        "className": 'description'
      }, "earned"))), React.createElement("div", {
        "className": 'bottom'
      }, React.createElement("div", {
        "className": 'stop'
      }, "Stop")))), React.createElement("div", {
        "className": 'timeslots'
      }, timeslots));
    }
  });

}).call(this);

(function() {
  var Utils;

  window.app = window.app || {};

  Utils = app.Utils;

  app.TaskItem = React.createClass({
    toTaskScreen: function() {
      return app.navigate('taskScreen', this.props.task.id);
    },
    getDots: function(seconds) {
      var activeDots, i, inactiveDots;
      seconds = seconds % 5;
      activeDots = (function() {
        var j, ref, results;
        results = [];
        for (i = j = ref = seconds; ref <= 0 ? j < 0 : j > 0; i = ref <= 0 ? ++j : --j) {
          results.push(React.createElement("span", {
            "className": 'active-dot'
          }));
        }
        return results;
      })();
      inactiveDots = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 4, ref = seconds; 4 <= ref ? j < ref : j > ref; i = 4 <= ref ? ++j : --j) {
          results.push(React.createElement("span", null));
        }
        return results;
      })();
      return activeDots.concat(inactiveDots);
    },
    startTimeslot: function() {
      if (this.props.task.isActive) {
        return this.props.stopTimeslot(this.props.key);
      } else {
        return this.props.startTimeslot(this.props.key);
      }
    },
    worked: function() {
      var count, date, timeslots;
      timeslots = this.props.task.timeslots;
      date = moment(this.props.date);
      count = _.reduce(timeslots, function(sum, slot) {
        if (moment(slot.start).isAfter(date)) {
          sum += slot.duration;
        }
        return sum;
      }, 0);
      return moment.duration(count, 's');
    },
    render: function() {
      var active, dots, time, worked;
      worked = this.worked();
      time = worked.format('hh:mm', {
        trim: false
      });
      dots = this.getDots(worked.asSeconds());
      active = this.props.task.isActive ? 'task -active' : 'task';
      return React.createElement("div", {
        "onDoubleClick": this.props.destroy,
        "className": active,
        "onClick": this.toTaskScreen
      }, React.createElement("div", {
        "className": 'task-actions',
        "onClick": this.startTimeslot
      }, React.createElement("div", {
        "className": 'task-actions-cube'
      }, React.createElement("div", {
        "className": 'task-actions-front'
      }, React.createElement("div", {
        "className": 'task-dots'
      }, dots), React.createElement("div", {
        "className": 'task-time'
      }, time)), React.createElement("div", {
        "className": 'task-actions-left'
      }, React.createElement("div", {
        "className": 'task-start'
      }, "Start"), React.createElement("div", {
        "className": 'task-stop'
      }, "Stop")))), React.createElement("div", {
        "className": 'task-title'
      }, this.props.task.title), React.createElement("div", {
        "className": 'task-project'
      }, "for ", this.props.task.project));
    }
  });

}).call(this);

(function() {
  var TaskItem, Utils;

  window.app = window.app || {};

  Utils = app.Utils;

  TaskItem = app.TaskItem;

  app.TasksList = React.createClass({
    scroll: function(e) {
      var els, scrollTop;
      els = document.getElementsByClassName('day-title');
      scrollTop = e.target.scrollTop;
      return _.each(els, (function(_this) {
        return function(el) {
          if (el.offsetTop < scrollTop) {
            return _this.props.setTitle(el.innerHTML);
          }
        };
      })(this));
    },
    destroy: function(id) {
      return this.props.model.removeTask(id);
    },
    stopTimeslot: function(id) {
      return this.props.model.stopTimeslot(id);
    },
    startTimeslot: function(id) {
      return this.props.model.addTimeslot(id);
    },
    render: function() {
      var list, sortedTasks, tasks;
      tasks = _.groupBy(this.props.model.tasks, function(task) {
        return moment(task.lastStart).startOf('day').toISOString();
      });
      sortedTasks = _(tasks).keys().sort().reverse().reduce(function(obj, key) {
        obj[key] = tasks[key];
        return obj;
      }, {});
      list = _.reduce(sortedTasks, (function(_this) {
        return function(accumulator, item, day) {
          var dayTasks;
          dayTasks = _.map(item, function(task) {
            return React.createElement(TaskItem, {
              "key": task.id,
              "task": task,
              "date": day,
              "destroy": _this.destroy.bind(_this, task.id),
              "stopTimeslot": _this.stopTimeslot.bind(_this, task.id),
              "startTimeslot": _this.startTimeslot.bind(_this, task.id)
            });
          });
          accumulator.push(React.createElement("div", {
            "className": 'day-title'
          }, Utils.dayTitle(day)));
          accumulator.push(dayTasks);
          return accumulator;
        };
      })(this), []);
      return React.createElement("div", {
        "className": 'tasks-list',
        "onScroll": this.scroll
      }, list);
    }
  });

}).call(this);

(function() {
  var ENTER_KEY, ESCAPE_KEY, find;

  window.app = window.app || {};

  ESCAPE_KEY = 27;

  ENTER_KEY = 13;

  find = React.findDOMNode;

  app.NewTask = React.createClass({
    addTask: function() {
      var project, rate, title;
      title = find(this.refs.newTaskTitle).value;
      project = find(this.refs.newTaskProject).value;
      rate = find(this.refs.newTaskRate).value;
      this.props.model.addTask(title, rate, project);
      return this.close();
    },
    close: function() {
      return app.navigate('back');
    },
    render: function() {
      return React.createElement("div", {
        "className": 'new-task'
      }, React.createElement("header", null, React.createElement("span", {
        "className": 'title'
      }, "New task"), React.createElement("span", {
        "className": 'divider'
      }), React.createElement("span", {
        "className": 'close',
        "onClick": this.close
      })), React.createElement("form", {
        "autoComplete": "off"
      }, React.createElement("div", {
        "className": 'input'
      }, React.createElement("input", {
        "ref": 'newTaskTitle',
        "id": 'title',
        "type": 'text',
        "required": true,
        "autoFocus": 'true'
      }), React.createElement("label", {
        "htmlFor": 'title'
      }, "Title")), React.createElement("div", {
        "className": 'input -half'
      }, React.createElement("input", {
        "ref": 'newTaskProject',
        "id": 'project',
        "type": 'text',
        "required": true
      }), React.createElement("label", {
        "htmlFor": 'project'
      }, "Project")), React.createElement("div", {
        "className": 'input -half'
      }, React.createElement("input", {
        "ref": 'newTaskRate',
        "id": 'rate',
        "type": 'text',
        "required": true
      }), React.createElement("label", {
        "htmlFor": 'rate'
      }, "Hourly rate"))), React.createElement("div", {
        "className": 'add-task-btn',
        "onClick": this.addTask
      }, "Add task"));
    }
  });

}).call(this);

(function() {
  var Utils;

  window.app = window.app || {};

  Utils = app.Utils;

  app.ActiveTask = React.createClass({
    countWorkedtime: function() {
      var active;
      active = this.props.task;
      return active.timeslots[active.timeslots.length - 1].duration;
    },
    backToList: function() {
      return app.navigate('tasksList');
    },
    render: function() {
      var hours, mins, seconds, workedFormated;
      workedFormated = this.countWorkedtime();
      mins = Math.floor(workedFormated / 60);
      hours = Math.floor(mins / 60);
      mins = mins - 60 * hours;
      seconds = Math.floor(workedFormated - (hours * 3600 + mins * 60));
      return React.createElement("div", null, React.createElement("a", {
        "onClick": this.backToList
      }, "back to list"), this.props.task.title, "  $", (this.props.task.rate / 3600 * workedFormated).toFixed(2), "  ", hours, "h ", mins, "m ", seconds, "s");
    }
  });

}).call(this);

(function() {
  var TasksList;

  window.app = window.app || {};

  TasksList = app.TasksList;

  app.MainList = React.createClass({
    getInitialState: function() {
      return {
        title: ''
      };
    },
    toNewtask: function() {
      return app.navigate('newTask');
    },
    updateTitle: function(title) {
      return this.setState({
        title: title
      });
    },
    render: function() {
      return React.createElement("div", {
        "className": 'main-task'
      }, React.createElement("header", null, React.createElement("span", {
        "className": 'title'
      }, this.state.title), React.createElement("span", {
        "className": 'divider'
      }), React.createElement("span", {
        "className": 'add-task',
        "onClick": this.toNewtask
      })), React.createElement(TasksList, {
        "model": this.props.model,
        "setTitle": this.updateTitle
      }));
    }
  });

}).call(this);

(function() {
  var ActiveTask, MainList, NewTask, Router, TaskScreen, TasksList, Utils;

  Utils = app.Utils;

  TasksList = app.TasksList;

  ActiveTask = app.ActiveTask;

  MainList = app.MainList;

  NewTask = app.NewTask;

  TaskScreen = app.TaskScreen;

  app.Router = Router = (function() {
    function Router(start) {
      this.route = this.routes[start];
    }

    Router.prototype.onChanges = [];

    Router.prototype.routes = {
      newTask: function(self) {
        return React.createElement(NewTask, {
          "model": self.props.model
        });
      },
      tasksList: function(self) {
        return React.createElement(MainList, {
          "model": self.props.model
        });
      },
      taskScreen: function(self) {
        var task;
        task = _.find(self.props.model.tasks, {
          id: this.args
        });
        return React.createElement(TaskScreen, {
          "task": task,
          "model": self.props.model
        });
      },
      activeScreen: function(self) {
        var activeTask;
        activeTask = _.find(self.props.model.tasks, {
          isActive: true
        });
        if (activeTask) {
          return React.createElement(ActiveTask, {
            "task": activeTask
          });
        }
      }
    };

    Router.prototype.subscribe = function(onChange) {
      return this.onChanges.push(onChange);
    };

    Router.prototype.inform = function() {
      return this.onChanges.forEach(function(cb) {
        return cb();
      });
    };

    Router.prototype.navigate = function(route, args) {
      if (route === 'back') {
        this.route = this.prevRoute;
        this.args = this.prevArgs;
      } else {
        this.prevRoute = this.route;
        this.prevArgs = this.args;
        this.args = args;
        this.route = this.routes[route];
      }
      return this.inform();
    };

    return Router;

  })();

}).call(this);

(function() {
  var Trakr, Utils, model, render, router;

  window.app = window.app || {};

  Utils = app.Utils;

  model = new app.TaskModel('trakr');

  router = new app.Router('tasksList');

  Trakr = React.createClass({
    render: function() {
      return this.props.router.route(this);
    }
  });

  app.navigate = function() {
    return router.navigate.apply(router, arguments);
  };

  setInterval(function() {
    return model.updateActiveTask();
  }, 1000);

  render = function() {
    return React.render(React.createElement(Trakr, {
      "model": model,
      "router": router
    }), document.body);
  };

  model.subscribe(render);

  router.subscribe(render);

  render();

}).call(this);
