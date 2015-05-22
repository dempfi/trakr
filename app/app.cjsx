Timeline  = require 'layouts/timeline'
NewTask   = require 'layouts/new-task'

Trakr = React.createClass
  render: -> <NewTask/>


render = () ->
  React.render(<Trakr/>, document.body)

render()