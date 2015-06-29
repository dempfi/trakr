TasksStore     = require 'store/tasks'
TimeslotsStore = require 'store/timeslots'
ProjectsStore  = require 'store/projects'
TasksActions   = require 'actions/tasks'
hhmm           = require 'utils/formatSeconds'
Link           = ReactRouter.Link

module.exports = React.createClass
  mixins: [
    Reflux.ListenerMethods
    Reflux.connectFilter(TasksStore, 'task',
      (i) -> i[@props.params.id])
    Reflux.connectFilter(TimeslotsStore, 'timeslots',
      (i) -> i[@props.params.id])
  ]

  setProject : (projects) ->
    @setState project : projects[@state.task.project]

  componentWillMount : ->
    @setProject ProjectsStore.projects
    @listenTo ProjectsStore, @setProject

  toggle : ->
    unless @isActive() then @start() else @stop()

  start : ->
    TasksActions.addTimeslot @props.params.id

  stop : ->
    TasksActions.stopTimeslot @props.params.id

  worked : ->
    hhmm _.reduce @state.timeslots, ((c, i) -> i.duration + c), 0

  isActive : ->
    TasksStore.isActive @state.task.id

  render : ->
    worked = @worked()
    <div>
      <header className='task'>
        <a className='action'></a>
      </header>
      <main className='task'>
        <div className='title'>{@state.task.title}</div>
        <div className='project'>
          <Link to='project' params={id : @state.task.project}>
            {@state.project.title}
          </Link>
        </div>
        {@state.task.rate}{@state.task.currency}<br/>

        <div className={if @isActive() then 'worked-earned active' else 'worked-earned'}>
          <button onClick={@toggle}/>
          <div className='worked'>
            <span className='h'>
              {worked[0]}
              <span className='label'>h</span>
            </span>
            <span className='m'>
              {worked[1]}
              <span className='label'>m</span>
            </span>
            <span className='s'>
              {worked[2]}
              <span className='label'>s</span>
            </span>
          </div>
        </div>

        earned : {worked[3] / 3600 * @state.task.rate}{@state.task.currency}<br/>
      </main>
    </div>
