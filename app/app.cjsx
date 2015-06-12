Link = ReactRouter.Link

module.exports = React.createClass
  render: ->
    return (
      <div className='-app'>
        <div className='dev-menu'>
          <Link to='timeline' params={date : moment().format('YYYY-MM-DD')}>timeline</Link> |
          <Link to='projects'>projects</Link> |
          <Link to='new-task'>new task</Link> |
          <Link to='new-project'>new project</Link> |
        </div>
        <ReactRouter.RouteHandler/>
      </div>
    )
