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

  getInitialState : ->
    date : moment().format('YYYY-MM-DD')

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

  onDateSelected : (date) ->
    @setState date : date

  render : ->
    date  = @state.date
    tasks = @state.activity[date]
    <div>
      <header className='timeline'>
        <div className='title-row'>
          <div className='title'>Timeline</div>
          <Link to='new-task' className='action'></Link>
        </div>
        <div className='actions-row'>
          <Link to='timeline' className='timeline'></Link>
          <Link to='projects' className='projects'></Link>
          <Link to='projects' className='archive'></Link>
        </div>

        <div className='dateribbon-wrap'>
          <Dateribbon
            dates={_.keys @state.activity}
            onSelect={@onDateSelected}
            active={date}
          />
        </div>
      </header>
      <main className='timeline'>
        <ul className='list'>
          {if tasks then @renderTasks tasks else @noActivity date}
        </ul>
      </main>
    </div>
