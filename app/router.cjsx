App        = require 'app'
Timeline   = require 'layouts/timeline'
NewTask    = require 'layouts/new-task'
NewProject = require 'layouts/new-project'
Task       = require 'layouts/task'
Projects   = require 'layouts/projects'
Project    = require 'layouts/project'
Playground = require 'layouts/playground'
Route      = ReactRouter.Route
Redirect   = ReactRouter.Redirect

routes = (
  <Route handler={App}>
    <Route name='new-task' handler={NewTask} />
    <Route name='new-project' handler={NewProject} />
    <Route name='timeline' path='/timeline/:date' handler={Timeline} />
    <Route name='projects' handler={Projects} />
    <Route name='project' path='/project/:id' handler={Project} />
    <Route name='task' path='/task/:id' handler={Task} />
    <Route name='playground' path='/p' handler={Playground} />
    <Redirect from='/' to='timeline' params={date : moment().format 'YYYY-MM-DD'}/>
  </Route>
);

render = ->
  ReactRouter.run routes, (Trakr) ->
    React.render <Trakr/>, document.body

window.addEventListener 'DOMContentLoaded', render

# <Redirect from='/' to='new-task'/>
