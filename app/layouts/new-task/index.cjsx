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
        <input placeholder='title'/>
        <input placeholder='project'/>
        <input placeholder='rate'/>
        <input placeholder='currency'/>
        <input placeholder='estimate'/>
        <input placeholder='deadline'/>
        <input placeholder='complexity'/>
        <div onClick={@addTask}>add task</div>
      </div>
    )