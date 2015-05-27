Link = ReactRouter.Link

module.exports = React.createClass
  render: ->
    return (
      <div className='APP'>
        <Link to='timeline' params={date : moment().format('YYYY-MM-DD')}>timeline</Link> |
        <Link to='new-task'>new task</Link> |
        <Link to='new-project'>new project</Link>
        <hr/>
        <ReactRouter.RouteHandler/>
      </div>
    )
