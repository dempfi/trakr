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
    rate       : 0
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

      <label className='row'>
        <input
          value    = {@state.title}
          onChange = {@onChange.bind(@,'title')}
          tabIndex = '1'
          required
        />
        <span>Task</span>
      </label>

      <br/>
      <br/>
      <br/>
      <Autocomplete
        list        = {@state.projects}
        valueKey    = 'id'
        titleKey    = 'title'
        onSelect    = {@set.bind(@, 'project')}
        placeholder = 'project'
      />
      <input
        value       = {@state.rate}
        onChange    = {@onChange.bind(@, 'rate')}
        placeholder = 'rate'
        tabIndex    = '1'
      /><br/>
      <Autocomplete
        list        = {Currencies()}
        valueKey    = 'currency'
        titleKey    = 'name'
        onSelect    = {@set.bind(@, 'currency')}
        placeholder = 'currency'
      />
      <input placeholder = 'estimate' readOnly/><br/>
      <Datepicker
        onSelect = {@set.bind(@, 'deadline')}
        selected = {@state.deadline}
      />
      <input
        type     = 'range'
        value    = {@state.complexity}
        onChange = {@onChange.bind(@, 'complexity')}
        min      = {0}
        step     = {1}
        max      = {10}
        tabIndex = '1'
      /><br/>
      <button onClick={@addTask}>add task</button>
    </div>

