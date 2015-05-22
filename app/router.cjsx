app = window.app or {}

Utils      = app.Utils
TasksList  = app.TasksList
ActiveTask = app.ActiveTask
MainList   = require 'layouts/timeline'
NewTask    = app.NewTask
TaskScreen = app.TaskScreen


module.exports = class Router
  constructor : (start) ->
    @route = @routes[start]

  onChanges   : []

  routes      :
    newTask   : (self) ->
      <NewTask model={self.props.model}/>

    tasksList : (self) ->
      <MainList model={self.props.model}/>

    taskScreen : (self) ->
      task = _.find(self.props.model.tasks, id : @args)
      <TaskScreen task={task} model={self.props.model}/>

    activeScreen : (self) ->
      activeTask = _.find(self.props.model.tasks, isActive : true)
      return <ActiveTask task={activeTask}/> if activeTask


  subscribe     : (onChange) -> @onChanges.push(onChange)
  inform        : -> @onChanges.forEach (cb) -> cb()
  navigate      : (route, args) ->
    if route is 'back'
      @route = @prevRoute
      @args = @prevArgs
    else
      @prevRoute = @route
      @prevArgs = @args
      @args = args
      @route = @routes[route]
    @inform()
