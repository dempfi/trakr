TasksActions      = require 'actions/tasks'
ProjectsActions   = require 'actions/projects'

module.exports = Reflux.createStore
  listenables    : [TasksActions]

  getInitialState : ->
    @tasks or []

  init: ->
    @tasks =  _.load('tasks')
    setInterval (=> @updateTimeslot()), 1000


  getSession : (id, key) ->
    task  = _.get(@tasks, id)
    return task.sessions[key] or []


  update : ->
    @trigger(@tasks)
    _.save(@tasks,'tasks')


  updateTimeslot : ->
    @tasks = @tasks.map (task) ->
      if task.isActive
        task.sessions[task.sessions.length-1].duration += 1
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
      sessions   : {}
    ProjectsActions.addTask params.project, id
    @update()


  onAddTimeslot : (id) ->
    task = @get id
    key  = moment().format('YYYY-MM-DD')
    task.sessions[key] = [] unless task.sessions[key]
    task.sessions[key].push
      duration  : 0
      start     : moment().toISOString()

    @update()





  onStopTimeslot : (id) ->
    @tasks = @tasks.map (task) ->
      task.isActive = false
      if task.id is id
        task.lastStart = moment().toISOString()
        task.isActive = false
        task.sessions.push(
          start     : moment().toISOString()
          duration  : 0
        )
      task
    @update()
