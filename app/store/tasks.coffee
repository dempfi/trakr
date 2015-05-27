TasksActions  = require 'actions/tasks'
ProjectsActions  = require 'actions/projects'
db            = require 'utils/storage'
uuid          = require 'utils/uuid'

module.exports = Reflux.createStore
  listenables    : [TasksActions]

  getInitialState : ->
    @tasks or []

  init: ->
    @tasks =  db('tasks') or []
    setInterval (=> @updateTimeslot()), 1000

  update : ->
    @trigger(@tasks)
    db('tasks', @tasks)


  updateTimeslot : ->
    @tasks = @tasks.map (task) ->
      if task.isActive
        task.timeslots[task.timeslots.length-1].duration += 1
      task
    @update()


  onAdd : (params) ->
    id = uuid()
    @tasks.push
      id          : id
      title       : params.title
      rate        : params.rate
      currency    : params.currency
      lastStart   : moment().toISOString()
      project     : params.project
      timeslots   : []
    ProjectsActions.addTask params.project, id
    @update()


  onAddTimeslot : (id) ->
    @tasks = @tasks.map (task) ->
      task.isActive = false
      if task.id is id
        task.lastStart = moment().toISOString()
        task.isActive = true
        task.timeslots.push(
          start     : moment().toISOString()
          duration  : 0
        )
      task
    @update()


  onStopTimeslot : (id) ->
    @tasks = @tasks.map (task) ->
      task.isActive = false
      if task.id is id
        task.lastStart = moment().toISOString()
        task.isActive = false
        task.timeslots.push(
          start     : moment().toISOString()
          duration  : 0
        )
      task
    @update()
