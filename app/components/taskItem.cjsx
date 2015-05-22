module.exports = React.createClass

  render : ->
    title = @props.task.get('title')

    return (
      <div>
        {@props.task.get('title')} {@props.task.get('project')}
      </div>
    )