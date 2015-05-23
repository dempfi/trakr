TasksStore      = require 'store/tasks'
TasksActions    = require 'actions/tasks'

module.exports = React.createClass
  mixins: [Reflux.connect(TasksStore, 'tasks')]

  getInitialState : ->
    return {
      title       : ''
      project     : ''
      rate        : 0
      currency    : '$'
      estimate    : ''
      deadline    : ''
      complexity  : 0
    }

  addTask : ->
    TasksActions.addTask({
      title       : 'some cool title'
      rate        : 34
      currency    : '$'
      project     : 'project'
      estimate    : [7,9]
      deadline    : moment().toISOString()
      complexity  : 8
    })


  onChange : (key ,e) ->
    obj = {}
    obj[key] = e.target.value
    @setState obj

  render : ->
    console.log new Date().toUTCString()
    return (
      <div className='new-task'>
        <input
          value={@state.title}
          onChange={@onChange.bind(@,'title')}
          placeholder='title'
        /><br/>
        <input
          value={@state.title}
          onChange={@onChange.bind(@,'title')}
          placeholder='project'
        /><br/>
        <input placeholder='rate'/><br/>
        <input placeholder='currency'/><br/>
        <input placeholder='estimate'/><br/>
        <input placeholder='deadline'/><br/>
        <input placeholder='complexity'/><br/>
        <button onClick={@addTask}>add task</button>
      </div>
    )
