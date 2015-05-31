TasksActions = require 'actions/tasks'
Projects     = require 'actions/projects'
Timeslots    = require 'actions/timeslots'
Activity     = require 'actions/activity'

module.exports = Reflux.createStore
  listenables    : [TasksActions]

  getInitialState : ->
    @tasks or {}

  init: ->
    @tasks =  _.load('tasks') or {}
    @activeTask = ''
    setInterval (=> @updateTimeslot()), 1000

  inform : ->
    @trigger @tasks
    _.save @tasks, 'tasks'

  get : (id) ->
    @tasks[id] or {}

  set : (id, task) ->
    @tasks[id] = task

  onAdd : (payload) ->
    id = _.createId()
    @set id, _.merge payload, id : id
    Projects.addTask payload.project, id
    Activity.add id
    @inform()

  updateTimeslot : ->
    return unless @activeTask
    Timeslots.update @activeTask
    Activity.add @activeTask
    @inform()

  onAddTimeslot : (id) ->
    @activeTask = id
    Timeslots.add id
    Activity.add id
    @inform()

  onStopTimeslot : ->
    @activeTask = ''
    @inform()