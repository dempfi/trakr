App         = require 'app'
Timeline    = require 'layouts/timeline'
NewTask     = require 'layouts/new-task'
NewProject  = require 'layouts/new-project'
Task        = require 'layouts/task'
Route       = ReactRouter.Route

routes = (
  <Route handler={App}>
    <Route name='new-task' handler={NewTask} />
    <Route name='new-project' handler={NewProject} />
    <Route name='timeline' handler={Timeline} />
    <Route name='task' path='/task/:id' handler={Task} />
  </Route>
);

ReactRouter.run routes, (Trakr) ->
  React.render(<Trakr/>, document.body)
