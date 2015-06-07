TasksStore        = require 'store/tasks'
TasksActions      = require 'actions/tasks'
ProjectsActions   = require 'actions/projects'
ProjectsStore     = require 'store/projects'
Autocomplete      = require 'components/autocomplete'

module.exports = React.createClass
  mixins: [Reflux.connect(ProjectsStore, 'projects')]

  getInitialState : ->
    return {
      title      : ''
      project    : ''
      rate       : 0
      currency   : '$'
      estimate   : ''
      deadline   : ''
      complexity : 0
    }

  addTask : ->
    state = @state
    delete state.projects
    TasksActions.add state

  projectSelect : (i) ->
    @setState 'project' : i.id

  onChange : (key ,e) ->
    obj      = {}
    obj[key] = e.target.value
    @setState obj

  render : ->
    return (
      <div className='new-task'>
        <input
          value       = {@state.title}
          onChange    = {@onChange.bind(@,'title')}
          placeholder = 'title'
        /><br/>
        <Autocomplete
          list     = {@state.projects}
          valueKey = 'id'
          titleKey = 'title'
          onSelect = {@projectSelect}
        />
        <input
          value       = {@state.rate}
          onChange    = {@onChange.bind(@,'rate')}
          placeholder = 'rate'
        /><br/>
        <input value = {@state.currency} placeholder ='currency' readOnly/><br/>
        <input placeholder = 'estimate' readOnly/><br/>
        <input placeholder = 'deadline' readOnly/><br/>
        <input
          value={@state.complexity}
          onChange={@onChange.bind(@,'complexity')}
          placeholder='complexity'
        /><br/>
        <button onClick={@addTask}>add task</button>
      </div>
    )
