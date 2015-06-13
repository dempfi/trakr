TasksStore        = require 'store/tasks'
TasksActions      = require 'actions/tasks'
ProjectsActions   = require 'actions/projects'
ProjectsStore     = require 'store/projects'
Autocomplete      = require 'components/autocomplete'
Currencies        = require 'utils/currencies'
Datepicker        = require 'components/datepicker'

module.exports = React.createClass
  mixins: [Reflux.connect(ProjectsStore, 'projects')]

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
    <div className='-screen new-task'>
      <header>
        <p>New task</p>
      </header>

      <div className='main-padding'>

        <label className='row'>
          <input
            value    = {@state.title}
            onChange = {@onChange.bind(@,'title')}
            tabIndex = '1'
            required
          />
          <span className='placeholder'>Task</span>
        </label>

        <label className='row'>
          <Autocomplete
            list        = {@state.projects}
            valueKey    = 'id'
            titleKey    = 'title'
            onSelect    = {@set.bind(@, 'project')}
            required
          />
          <span className='placeholder'>Project</span>
        </label>

        <div className='two-inputs'>

          <label className='row'>
            <input
              value       = {@state.rate}
              onChange    = {@onChange.bind(@, 'rate')}
              tabIndex    = '1'
              required
            />
            <span className='placeholder'>Hourly rate</span>
          </label>

          <label className='row'>
            <Autocomplete
              list        = {Currencies()}
              valueKey    = 'currency'
              titleKey    = 'name'
              onSelect    = {@set.bind(@, 'currency')}
            />
            <span className='placeholder'>Currency</span>
          </label>

        </div>

        <div className='two-inputs'>

          <label className='row'>
            <input required readOnly />
            <span className='placeholder'>Estimate</span>
          </label>

          <label className='row'>
            <Datepicker
              onSelect = {@set.bind(@, 'deadline')}
              selected = {@state.deadline}
            />
            <span className='placeholder'>Deadline</span>
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
        <span className='placeholder'>Complexity</span>
      </label>

      </div>

      <button className='main-button' onClick={@addTask}>add task</button>

    </div>

