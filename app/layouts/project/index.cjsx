TasksStore    = require 'store/tasks'
ProjectsStore = require 'store/projects'
TaskItem      = require 'components/timelineItem'

module.exports = React.createClass
  mixins: [
    Reflux.ListenerMethods
    Reflux.connectFilter(ProjectsStore, 'project', (i) -> i[@props.params.id])
  ]

  setTasks : (allTasks) ->
    projectTasks = @state.project.tasks
    @setState tasks : _.filter allTasks, (_, key) -> key in projectTasks

  componentWillMount : ->
    @setTasks TasksStore.tasks
    @listenTo TasksStore, @setTasks

  render : ->
    <div>
      {@state.project.title}<br/>
      <ul>{_.map @state.tasks, (t, i) -> <TaskItem key={i} task={t} />}</ul>
    </div>
