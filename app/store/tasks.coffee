TasksActions  = require 'actions/tasks'
db            = require 'utils/storage'
uuid          = require 'utils/uuid'

module.exports = Reflux.createStore
  listenables    : [TasksActions]

  getInitialState : ->
    @tasks or []

  init: ->
    @tasks = [] or db('tasks')
    console.log 'init'

  updateTasks : ->
    @trigger(@tasks)
    db('tasks', @tasks)

  onAddTask : (params) ->
    @tasks.push
      id          : uuid()
      title       : params.title
      rate        : params.rate
      currency    : params.currency
      lastStart   : moment().toISOString()
      project     : params.project
      timeslots   : []
    @updateTasks()
