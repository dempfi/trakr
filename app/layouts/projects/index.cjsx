ProjectsStore = require 'store/projects'
ProjectItem      = require 'components/projectItem'

module.exports = React.createClass
  mixins: [Reflux.connect(ProjectsStore, 'projects')]

  tasksByDay : ->
    _.map @state.activity[@props.params.date], (taskId) =>
      <TaskItem key={taskId} task={@state.tasks[taskId]}/>


  render : ->
    <div className='-screen timeline'>
      {_.map @state.projects, (project, id) =>
        <ProjectItem key={id} project={project}/>}
    </div>
