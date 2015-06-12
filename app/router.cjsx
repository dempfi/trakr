App        = require 'app'
Timeline   = require 'layouts/timeline'
NewTask    = require 'layouts/new-task'
NewProject = require 'layouts/new-project'
Task       = require 'layouts/task'
Projects   = require 'layouts/projects'
Project    = require 'layouts/project'
Route      = ReactRouter.Route

routes = (
  <Route handler={App}>
    <Route name='new-task' handler={NewTask} />
    <Route name='new-project' handler={NewProject} />
    <Route name='timeline' path='/timeline/:date' handler={Timeline} />
    <Route name='projects' handler={Projects} />
    <Route name='project' path='/project/:id' handler={Project} />
    <Route name='task' path='/task/:id' handler={Task} />
  </Route>
);

ReactRouter.run routes, (Trakr) ->
  React.render(<Trakr/>, document.body)
