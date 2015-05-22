TasksStore      = require 'store/tasks'
TaskItem        = require 'components/taskItem'

module.exports = React.createClass
  mixins: [Reflux.connect(TasksStore, 'tasks')]

  render : ->
    tasks = @state.tasks
    return (
      <div className='timeline'>
        {tasks.map (task) -> <TaskItem key={task.get('id')} task={task}/>}
      </div>
    )