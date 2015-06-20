TasksStore    = require 'store/tasks'
ActivityStore = require 'store/activity'
ListItem      = require 'components/timelineItem'
Dateribbon    = require 'components/dateribbon'

module.exports = React.createClass
  mixins: [
    Reflux.connect(TasksStore, 'tasks'),
    Reflux.connect(ActivityStore, 'activity')
  ]

  tasksByDay : ->
    _.map @state.activity[@props.params.date], (taskId) =>
      <ListItem
        key={taskId}
        task={@state.tasks[taskId]}
        date={@props.params.date}
      />

  render : ->
    <div className='-screen timeline'>
      <Dateribbon dates={_.keys @state.activity}/>
      <div className='list'>
        {@tasksByDay()}
      </div>
    </div>
