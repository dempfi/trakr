App       = require 'app'
Timeline  = require 'layouts/timeline'
NewTask   = require 'layouts/new-task'

routes = (
  <ReactRouter.Route handler={App}>
    <ReactRouter.Route name='new' handler={NewTask} />
    <ReactRouter.Route name='timeline' handler={Timeline} />
  </ReactRouter.Route>
);

ReactRouter.run routes, (Trakr) ->
  React.render(<Trakr/>, document.body)