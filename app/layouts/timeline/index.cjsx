TasksStore      = require 'store/tasks'
ProjectsStore   = require 'store/projects'
TaskItem        = require 'components/taskItem'
Dateribbon      = require 'components/dateribbon'

module.exports = React.createClass
  mixins: [Reflux.connect(TasksStore, 'tasks')]

  showByDate : (d) ->
    console.log d

  render : ->
    return (
      <div className='timeline'>
        <Dateribbon onSelect={@showByDate}/>
        {@state.tasks?.map (task) -> <TaskItem key={task.id} task={task}/>}
      </div>
    )
