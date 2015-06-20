Link           = ReactRouter.Link
ProjectsStore  = require 'store/projects'
TimeslotsStore = require 'store/timeslots'
hhmm           = require 'utils/formatSeconds'

module.exports = React.createClass
  mixins: [
    Reflux.connectFilter(ProjectsStore, 'project',
      (i) -> i[@props.task.project])
    Reflux.connectFilter(TimeslotsStore, 'timeslots',
      (i) -> i[@props.task.id])
  ]

  worked : (date) ->
    hhmm _.reduce @state.timeslots, (acc, i) ->
      acc += i.duration if date.isSame i.start, 'day'
      acc
    , 0

  render : ->
    worked = @worked moment @props.date
    <Link to='task' params={id : @props.task.id}>
      {worked[0]}:{worked[1]}:{worked[2]} <br/>
      {@props.task.title} <br/> {@state.project.title}
    </Link>
