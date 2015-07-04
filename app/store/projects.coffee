ProjectsActions = require 'actions/projects'

module.exports  = Reflux.createStore
  listenables : [ProjectsActions]

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

  onAdd : (title) ->
    id = _.createId()
    project = tasks : [], id : id, title : title
    @set id, project
    @inform()
    return id

  onAddTask : (id, task) ->
    project = @get id
    console.log id
    project.tasks.push task
    @set id, project
    @inform()

  find : (title) ->
    _.find @projects, 'title', title
