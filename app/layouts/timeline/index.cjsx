TasksStore      = require 'store/tasks'
ProjectsStore   = require 'store/projects'
TaskItem        = require 'components/taskItem'

module.exports = React.createClass
  mixins: [Reflux.connect(TasksStore, 'tasks')]

  render : ->
    return (
      <div className='timeline'>
        {@state.tasks?.map (task) -> <TaskItem key={task.id} task={task}/>}
      </div>
    )
