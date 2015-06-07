ActivityActions  = require 'actions/activity'

module.exports = Reflux.createStore
  listenables    : [ActivityActions]

  getInitialState : ->
    @activity or {}

  init: ->
    @activity =  _.load('activity') or {}

  inform : ->
    @trigger @activity
    _.save @activity, 'activity'

  get : (key) ->
    @activity[key] or []

  set : (key, day) ->
    @activity[key] = _.uniq day

  todayKey : ->
    moment().format('YYYY-MM-DD')

  onAdd : (taskId) ->
    key   = @todayKey()
    day   = @get key
    day.push taskId
    @set key, day
    @inform()
