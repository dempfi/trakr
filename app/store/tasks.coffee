TasksActions  = require 'actions/tasks'
Utils         = require 'utils'

module.exports = Reflux.createStore
  listenables    : [TasksActions]

  getInitialState: ->
    @tasks = [
      id          : Utils.uuid()
      title       : 'some cool task'
      rate        : 45
      lastStart   : moment().toISOString()
      project     : 'some cool project'
      timeslots   : []
    ]


  updateTasks : (tasks) ->
    @tasks = tasks
    @trigger(tasks)


  onAddTask : (params) ->
    unless @tasks
      @tasks = []
    @updateTasks @tasks.push
      id          : Utils.uuid()
      title       : params.title
      rate        : params.rate
      currency    : params.currency
      lastStart   : moment().toISOString()
      project     : params.project
      timeslots   : []
