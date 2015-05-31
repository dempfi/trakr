ProjectsActions = require 'actions/projects'

module.exports  = Reflux.createStore
  listenables    : [ProjectsActions]

  getInitialState : ->
    @projects

  init: ->
    @projects = _.load('projects') or {}

  inform : ->
    @trigger @projects
    _.save @projects, 'projects'

  get : (id) ->
    @projects[id] or {}

  set : (id, project) ->
    @projects[id] = project

  onAdd : (payload) ->
    id = _.createId()
    project = _.merge payload,
      tasks : []
      id    : id
    @set id, project
    @inform()

  onAddTask : (id, task) ->
    project = @get id
    project.tasks.push task
    @set id, project
    @inform()
