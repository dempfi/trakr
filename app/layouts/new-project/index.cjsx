ProjectsActions = require 'actions/projects'
Autocomplete    = require 'components/autocomplete'
Currencies      = require 'utils/currencies'

module.exports = React.createClass

  getInitialState : ->
    return {
      title    : ''
      rate     : ''
      currency : ''
    }

  addProject : ->
    ProjectsActions.add(@state)

  set : (key, value) ->
    obj = {}
    obj[key] = value
    @setState obj

  onChange : (key, e) ->
    @set key, e.target.value

  render : ->
    <div className = 'new-task'>
      <input
        value       = {@state.title}
        onChange    = {@onChange.bind(@,'title')}
        placeholder = 'title'
        tabIndex = 1
      /><br/>
      <input
        value       = {@state.rate}
        onChange    = {@onChange.bind(@,'rate')}
        placeholder = 'default rate'
        tabIndex = 1
      /><br/>
      <label className='row'>
        <Autocomplete
          list     = {Currencies()}
          valueKey = 'currency'
          titleKey = 'name'
          onSelect = {@set.bind(@, 'currency')}
        />
        <span className='placeholder'>Currency</span>
      </label>
      <button
        onClick = {@addProject}
        tabIndex = 1
      >add project</button>
    </div>
