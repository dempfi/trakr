TasksStore        = require 'store/tasks'
TimeslotsStore    = require 'store/timeslots'
TasksActions      = require 'actions/tasks'

module.exports = React.createClass
  mixins: [
    Reflux.connectFilter(TasksStore, 'task', (i) -> i[@props.params.id]),
    Reflux.connectFilter(TimeslotsStore, 'timeslots', (i) -> i[@props.params.id]),
  ]

  start : ->
    TasksActions.addTimeslot @props.params.id

  stop : ->
    TasksActions.stopTimeslot @props.params.id

  totalWorked : ->
    _.reduce @state.timeslots, ((c, i) -> i.duration + c), 0

  render : ->
    return (
      <div>
        {@state.task.title}<br/>
        {@state.task.rate}{@state.task.currency}<br/>
        worked : {@totalWorked()}s<br/>
        earned : {@totalWorked() / 3600 * @state.task.rate}{@state.task.currency}<br/>
        <button onClick={@start}>Start</button>
        <button onClick={@stop}>Stop</button>
      </div>
    )