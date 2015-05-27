TasksStore      = require 'store/tasks'
ProjectsStore   = require 'store/projects'
TaskItem        = require 'components/taskItem'
Dateribbon      = require 'components/dateribbon'

module.exports = React.createClass
  mixins: [Reflux.connect(TasksStore, 'tasks')]

  tasksByDay : ->
    db = new loki('Example')
    console.log loki
    console.time('start')
    tasks = _.filter @state?.tasks, (task) =>
      moment(task.lastStart).isSame(@props.params.date, 'day') or
      _.some task.timeslots, (slot) => moment(slot).isSame(@props.params.date, 'day')
    console.log tasks
    console.timeEnd('start')
    return ''

    # @state?.tasks.map (task) =>
    #   if moment(task.lastStart).isSame(@props.params.date, 'day')
    #     return <TaskItem key={task.id} task={task}/>
    #   else
    #     return _.find task.timeslots, (t) =>
    #       moment(t).isSame(@props.params.date, 'day')

  render : ->
    return (
      <div className='timeline'>
        <Dateribbon onSelect={@showByDate}/>
        {@tasksByDay()}
      </div>
    )
