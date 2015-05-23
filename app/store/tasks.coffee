TasksActions  = require 'actions/tasks'
Utils         = require 'utils'

module.exports = Reflux.createStore
  listenables    : [TasksActions]

  # getInitialState: ->
  #   @tasks = Immutable.fromJS([
  #     id          : Utils.uuid()
  #     title       : 'some cool task'
  #     rate        : 45
  #     lastStart   : moment().toISOString()
  #     project     : Utils.uuid()
  #     timeslots   : []
  #   ])


  updateTasks : (tasks) ->
    @tasks = tasks
    console.log @tasks
    @trigger(tasks)


  onAddTask : (params) ->
    unless @tasks
      @tasks = Immutable.List()
    @updateTasks @tasks.push Immutable.Map
      id          : Utils.uuid()
      title       : params.title
      rate        : params.rate
      currency    : params.currency
      lastStart   : moment().toISOString()
      project     : params.project
      timeslots   : []