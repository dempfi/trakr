module.exports = React.createClass
  render: ->
    return (
      <div className='APP'>
        <ReactRouter.Link to='timeline'>timeline</ReactRouter.Link>
        <ReactRouter.Link to='new'>new task</ReactRouter.Link>
        <ReactRouter.RouteHandler/>
      </div>
    )
