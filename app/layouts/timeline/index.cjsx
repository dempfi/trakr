TasksStore    = require 'store/tasks'
ActivityStore = require 'store/activity'
TaskItem      = require 'components/taskItem'
Dateribbon    = require 'components/dateribbon'

module.exports = React.createClass
  mixins: [
    Reflux.connect(TasksStore, 'tasks'),
    Reflux.connect(ActivityStore, 'activity')
  ]

  tasksByDay : ->
    _.map @state.activity[@props.params.date], (taskId) =>
      <TaskItem key={taskId} task={@state.tasks[taskId]}/>

  render : ->
    <div className='timeline'>
      <Dateribbon dates={_.keys @state.activity}/>
      {@tasksByDay()}
    </div>
