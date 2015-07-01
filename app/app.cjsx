Link = ReactRouter.Link

module.exports = React.createClass
  render: ->
    <div>
      <ReactRouter.RouteHandler/>
      <div className='dev-menu'><Link to='new-task'>new task</Link> | <Link to='new-project'>new project</Link> | <Link to='projects'>projects</Link> | <Link to='timeline' params={date : moment().format('YYYY-MM-DD')}>Timeline</Link>
      </div>
    </div>
