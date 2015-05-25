ProjectsActions = require 'actions/projects'
db              = require 'utils/storage'
uuid            = require 'utils/uuid'

module.exports  = Reflux.createStore
  listenables    : [ProjectsActions]

  getInitialState : ->
    @projects or []

  init: ->
    @projects =  db('projects') or []

  update : ->
    @trigger(@projects)
    console.log @projects
    db('projects', @projects)

  onAdd : (params) ->
    @projects.push
      id        : uuid()
      title     : params.title
      rate      : params.rate
      currency  : params.currency
      tasks     : []
    @update()

  onAddTask : (id, task) ->
    @projects = @projects.map (project) ->
      project.tasks.push task if project.id is id
      project
    @update()
