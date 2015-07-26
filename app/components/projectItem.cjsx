ProjectsStore  = require 'store/projects'
TimeslotsStore = require 'store/timeslots'
TasksStore     = require 'store/tasks'
hhmm           = require 'utils/formatSeconds'
Link           = ReactRouter.Link

module.exports = React.createClass
  mixins: [
    Reflux.connectFilter TasksStore, 'tasks', (T) ->
      _.reduce @props.tasks, ((A, i) -> A.concat T[i]), []
    Reflux.connectFilter TimeslotsStore, 'timeslots', (T) ->
      _.reduce @props.tasks, ((A, i) -> if T[i] then A.concat T[i] else A), []
  ]

  worked : ->
    hhmm _.reduce @state.timeslots, (acc, i) ->
      if i.duration then acc + i.duration else acc
    , 0

  render : ->
    {tasks} = @state
    W = @worked()

    subtext =
      unless tasks.length then 'No tasks'
      else if tasks.length is 1 then "#{tasks.length} task"
      else "#{tasks.length} tasks"

    <Link to='project' params={id : @props.id}>
      <span className='worked'>
        {if Number W[0] > 0 then "#{W[0]}h"
        else "#{W[0]}:#{W[1]}"}
      </span>
      <span className='title'>{@props.title}</span>
      <span className='info'>{subtext}</span>
    </Link>
