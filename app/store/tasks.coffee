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

  update : ->
    @trigger(@tasks)
    db('tasks', @tasks)

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
