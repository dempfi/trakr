TasksStore        = require 'store/tasks'
TasksActions      = require 'actions/tasks'

module.exports = React.createClass
  mixins: [
    Reflux.connectFilter TasksStore, 'task', (tasks) ->
      _.filter(tasks, 'id', @props.params.id)[0]
  ]

  start : ->
    TasksActions.addTimeslot @state.task.id

  stop : ->
    TasksActions.stopTimeslot @state.task.id

  totalWorked : ->
    @state.task.timeslots.reduce ((i, n) -> i + n.duration), 0

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
