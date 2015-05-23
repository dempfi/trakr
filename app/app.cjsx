Link = ReactRouter.Link

module.exports = React.createClass
  render: ->
    return (
      <div className='APP'>
        <Link to='timeline'>timeline</Link>
        <Link to='new'>new task</Link>
        <ReactRouter.RouteHandler/>
      </div>
    )
