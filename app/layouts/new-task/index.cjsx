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
    state = @state
    delete state.projects
    TasksActions.add state

  projectSelect : (val) ->
    @setState 'project' : val

  onChange : (key ,e) ->
    obj      = {}
    obj[key] = e.target.value
    @setState obj

  currencySelect : (val) ->
    @setState 'currency' : val

  dateSelect : (val) ->
    @setState 'deadline' : val

  render : ->
    return (
      <div className='new-task'>
        <input
          value       = {@state.title}
          onChange    = {@onChange.bind(@,'title')}
          placeholder = 'title'
        /><br/>
        <Autocomplete
          list        = {@state.projects}
          valueKey    = 'id'
          titleKey    = 'title'
          onSelect    = {@projectSelect}
          placeholder = 'project'
        />
        <input
          value       = {@state.rate}
          onChange    = {@onChange.bind(@,'rate')}
          placeholder = 'rate'
        /><br/>
        <Autocomplete
          list        = {Currencies()}
          valueKey    = 'currency'
          titleKey    = 'name'
          onSelect    = {@currencySelect}
          placeholder = 'currency'
        />
        <input placeholder = 'estimate' readOnly/><br/>
        <input
          placeholder = 'deadline'
          value={@state.deadline}
          readOnly/><br/>
        <Datepicker onSelect={@dateSelect}/>

        <input
          value={@state.complexity}
          onChange={@onChange.bind(@,'complexity')}
          placeholder='complexity'
        /><br/>
        <button onClick={@addTask}>add task</button>
      </div>
    )
