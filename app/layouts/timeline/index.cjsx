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
    <div>
      <header className='timeline'>
        <Link to='projects'>Projects</Link>
        <div className='dateribbon-wrap'>
          <Dateribbon dates={_.keys @state.activity}/>
        </div>
        <Link to='new-task' className='action'></Link>
      </header>
      <main className='timeline'>
        <ul className='list'>
          {if tasks then @renderTasks tasks else @noActivity date}
        </ul>
      </main>
    </div>
