ProjectsStore  = require 'store/projects'
TimeslotsStore = require 'store/timeslots'
TasksStore     = require 'store/tasks'
hhmm           = require 'utils/formatSeconds'
Link           = ReactRouter.Link

module.exports = React.createClass
  mixins: [
    Reflux.connectFilter(ProjectsStore, 'project',
      (i) -> i[@props.task.project])
    Reflux.connectFilter(TimeslotsStore, 'timeslots',
      (i) -> i[@props.task.id])
  ]

  worked : (date) ->
    hhmm _.reduce @state.timeslots, (acc, i) ->
      if date.isSame i.start, 'd' then acc + i.duration else acc
    , 0

  isActive : ->
    TasksStore.isActive @props.task.id

  render : ->
    worked = @worked moment @props.date
    <li>
      <p className="worked-earned #{'-active' if @isActive()}">
        <span className='worked'>
          {Number worked[0]}:{worked[1]}
        </span>
      </p>
      <Link to='task' params={id : @props.task.id}>
        <span className='title'>{@props.task.title}</span>
        <span className='info'>
          {@state.project.title}, {moment(@props.task.deadline).fromNow(true)} left
        </span>
      </Link>
    </li>
