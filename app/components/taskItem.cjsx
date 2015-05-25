Link = ReactRouter.Link

module.exports = React.createClass

  render : ->
    return (
      <div>
        <Link to='task' params={id : @props.task.id}>
          {@props.task.title} {@props.task.project}
        </Link>
      </div>
    )
