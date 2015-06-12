Link          = ReactRouter.Link
ProjectsStore = require 'store/projects'

module.exports = React.createClass
  mixins: [
    Reflux.connectFilter(ProjectsStore, 'project', (i) -> i[@props.task.project])
  ]

  render : ->
    <Link to='task' params={id : @props.task.id}>
      {@props.task.title} {@state.project.title}
    </Link>
