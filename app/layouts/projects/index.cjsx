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
        <div className='title-row'>
          <div className='title'>Projects</div>
          <Link to='new-task' className='action'></Link>
        </div>
        <div className='actions-row'>
          <Link to='timeline' className='timeline'></Link>
          <Link to='projects' className='projects'></Link>
          <Link to='projects' className='archive'></Link>
        </div>
      </header>
      <main className='projects'>
        {_.map @state.projects, (project, id) =>
          <ProjectItem key={id} {...project}/>}
      </main>
    </div>
