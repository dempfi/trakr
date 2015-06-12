Link = ReactRouter.Link

module.exports = React.createClass

  render : ->
    <Link to='project' params={id : @props.project.id}>
      {@props.project.title}
    </Link>

