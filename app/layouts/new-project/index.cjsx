ProjectsActions    = require 'actions/projects'

module.exports = React.createClass

  getInitialState : ->
    return {
      title       : ''
      rate        : ''
      currency    : '$'
    }

  addProject : ->
    ProjectsActions.add(@state)

  onChange : (key, e) ->
    obj = {}
    obj[key] = e.target.value
    @setState obj

  render : ->
    return (
      <div className='new-task'>
        <input
          value={@state.title}
          onChange={@onChange.bind(@,'title')}
          placeholder='title'
        /><br/>
        <input
          value={@state.rate}
          onChange={@onChange.bind(@,'rate')}
          placeholder='default rate'
        /><br/>
        <input
          value={@state.project}
          onChange={@onChange.bind(@,'currency')}
          placeholder='currency'
        /><br/>
        <button onClick={@addProject}>add project</button>
      </div>
    )
