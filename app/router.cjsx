App       = require 'app'
Timeline  = require 'layouts/timeline'
NewTask   = require 'layouts/new-task'
Route     = ReactRouter.Route

routes = (
  <Route handler={App}>
    <Route name='new' handler={NewTask} />
    <Route name='timeline' handler={Timeline} />
  </Route>
);

ReactRouter.run routes, (Trakr) ->
  React.render(<Trakr/>, document.body)
