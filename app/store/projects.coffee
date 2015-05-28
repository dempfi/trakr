ProjectsActions = require 'actions/projects'

module.exports  = Reflux.createStore
  listenables    : [ProjectsActions]

  getInitialState : ->
    @projects or []

  init: ->
    @projects =  _.load('projects') or []

  update : ->
    @trigger(@projects)
    _.save(@projects, 'projects')

  onAdd : (params) ->
    @projects.push
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
