TasksStore        = require 'store/tasks'
TimeslotsStore    = require 'store/timeslots'
ProjectsStore     = require 'store/projects'
TasksActions      = require 'actions/tasks'
hhmm              = require 'utils/formatSeconds'

module.exports = React.createClass
  mixins: [
    Reflux.connectFilter(TasksStore, 'task',
      (i) -> i[@props.params.id]),
    Reflux.connectFilter(TimeslotsStore, 'timeslots',
      (i) -> i[@props.params.id])
  ]

  start : ->
    TasksActions.addTimeslot @props.params.id

  stop : ->
    TasksActions.stopTimeslot @props.params.id

  worked : ->
    hhmm _.reduce @state.timeslots, ((c, i) -> i.duration + c), 0

  render : ->
    worked = @worked()
    return (
      <div>
        {@state.task.title}<br/>
        {@state.task.rate}{@state.task.currency}<br/>
        worked : {worked[0]}h {worked[1]}m {worked[2]}s<br/>
        earned : {worked[3] / 3600 * @state.task.rate}{@state.task.currency}<br/>
        <button onClick={@start}>Start</button>
        <button onClick={@stop}>Stop</button>
      </div>
    )