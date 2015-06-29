ProjectsStore = require 'store/projects'
ProjectItem   = require 'components/projectItem'
Link          = ReactRouter.Link

module.exports = React.createClass
  mixins: [Reflux.connect(ProjectsStore, 'projects')]

  tasksByDay : ->
    _.map @state.activity[@props.params.date], (taskId) =>
      <TaskItem key={taskId} task={@state.tasks[taskId]}/>

  render : ->
    <div>
      <header className='projects'>
        <Link to='timeline' params={date : moment().format('YYYY-MM-DD')}>Timeline</Link>
      </header>
      <main className='projects'>
        {_.map @state.projects, (project, id) =>
          <ProjectItem key={id} project={project}/>}
      </main>
    </div>
