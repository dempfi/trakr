TasksStore      = require 'store/tasks'
TasksActions    = require 'actions/tasks'

module.exports = React.createClass
  mixins: [Reflux.connect(TasksStore, 'tasks')]


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

  render : ->
    return (
      <div className='new-task'>
        <input placeholder='title'/><br/>
        <input placeholder='project'/><br/>
        <input placeholder='rate'/><br/>
        <input placeholder='currency'/><br/>
        <input placeholder='estimate'/><br/>
        <input placeholder='deadline'/><br/>
        <input placeholder='complexity'/><br/>
        <button onClick={@addTask}>add task</button>
      </div>
    )
