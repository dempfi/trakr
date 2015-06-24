TasksStore    = require 'store/tasks'
ActivityStore = require 'store/activity'
ListItem      = require 'components/timelineItem'
Dateribbon    = require 'components/dateribbon'
Link          = ReactRouter.Link

module.exports = React.createClass
  mixins: [
    Reflux.connect(TasksStore, 'tasks'),
    Reflux.connect(ActivityStore, 'activity')
  ]

  renderTasks : (tasks) ->
    _.map tasks, (taskId) =>
      <ListItem
        key={taskId}
        task={@state.tasks[taskId]}
        date={@props.params.date}
      />

  noActivity : (date) ->
    today = moment()
    date  =
      if today.isSame date, 'day' then'today'
      else "at #{moment(date).format 'MMMM DD'}"
    <div>No activity {date}</div>

  render : ->
    date  = @props.params.date
    tasks = @state.activity[date]
    <div className='-screen timeline'>
      <header>
        <Link to='projects'>Projects</Link>
      </header>
      <Dateribbon dates={_.keys @state.activity}/>
      <div className='list'>
        {if tasks then @renderTasks tasks else @noActivity date}
      </div>
    </div>
