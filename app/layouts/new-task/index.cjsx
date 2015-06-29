TasksStore      = require 'store/tasks'
TasksActions    = require 'actions/tasks'
ProjectsActions = require 'actions/projects'
ProjectsStore   = require 'store/projects'
Autocomplete    = require 'components/autocomplete'
Currencies      = require 'utils/currencies'
Datepicker      = require 'components/datepicker'

module.exports = React.createClass
  mixins: [
    Reflux.connect(ProjectsStore, 'projects')
    ReactRouter.Navigation
  ]

  getInitialState : ->
    title      : ''
    project    : ''
    rate       : ''
    currency   : ''
    estimate   : ''
    deadline   : ''
    complexity : 0

  addTask : ->
    TasksActions.add @state

  set : (key, value) ->
    obj = {}
    obj[key] = value
    @setState obj

  onChange : (key, e) ->
    @set key, e.target.value

  render : ->
    <div>
      <header className='new-task'>
        <div className='title'>New task</div>
        <a className='action' onClick={=> @goBack()}></a>
      </header>

      <main className='new-task'>
        <label className='row'>
          <input
            value    = {@state.title}
            onChange = {@onChange.bind(@,'title')}
            tabIndex = '1'
            required
          />
          <span className='label'>Task</span>
        </label>

        <Autocomplete
          list     = {@state.projects}
          valueKey = 'id'
          titleKey = 'title'
          onSelect = {@set.bind(@, 'project')}
          label    = 'Project'
        />

        <div className='two-inputs'>

          <label className='row'>
            <input
              value       = {@state.rate}
              onChange    = {@onChange.bind(@, 'rate')}
              tabIndex    = '1'
              required
            />
            <span className='label'>Hourly rate</span>
          </label>

          <Autocomplete
            list     = {Currencies()}
            valueKey = 'currency'
            titleKey = 'name'
            onSelect = {@set.bind(@, 'currency')}
            label    = 'Currency'
          />

        </div>

        <div className='two-inputs'>

          <label className='row'>
            <input required readOnly />
            <span className='label'>Estimate</span>
          </label>

          <label className='row'>
            <Datepicker
              onSelect = {@set.bind(@, 'deadline')}
              selected = {@state.deadline}
            />
            <span className='label'>Deadline</span>
          </label>

        </div>

        <label className='row'>
          <input
            type     = 'range'
            value    = {@state.complexity}
            onChange = {@onChange.bind(@, 'complexity')}
            min      = {0}
            step     = {1}
            max      = {10}
            tabIndex = '1'
          />
          <span className='label'>Complexity</span>
        </label>

        <button className='add-task' onClick={@addTask}>add task</button>

      </main>
    </div>

