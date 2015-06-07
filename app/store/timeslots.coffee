TimeslotsActions = require 'actions/timeslots'

module.exports = Reflux.createStore
  listenables    : [TimeslotsActions]

  getInitialState : ->
    @timeslots or {}

  init: ->
    @timeslots =  _.load('timeslots') or {}

  inform : ->
    @trigger @timeslots
    _.save @timeslots, 'timeslots'

  get : (key) ->
    @timeslots[key] or []

  set : (key, taskTimeslots) ->
    @timeslots[key] = taskTimeslots

  onAdd : (taskId) ->
    taskTimeslots = @get taskId
    taskTimeslots.push
      start    : moment().toISOString()
      duration : 0
    @set taskId, taskTimeslots
    @inform()

  onUpdate : (taskId) ->
    taskTimeslots = @get taskId
    taskTimeslots[taskTimeslots.length - 1].duration += 1
    @set taskId, taskTimeslots
    @inform()
