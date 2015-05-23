module.exports = React.createClass

  render : ->
    return (
      <div>
        {@props.task.title} {@props.task.project}
      </div>
    )
