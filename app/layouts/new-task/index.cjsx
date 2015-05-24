TasksStore      = require 'store/tasks'
TasksActions    = require 'actions/tasks'
Autocomplete    = require 'components/autocomplete'

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
    TasksActions.addTask(@state)


  onChange : (key ,e) ->
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
          value={@state.project}
          onChange={@onChange.bind(@,'project')}
          placeholder='project'
        /><br/>
        <Autocomplete
          list={[
            {
              id : '1'
              title : 'project'
            }
            {
              id : '2'
              title : 'other project'
            }
            {
              id : '3'
              title : 'some other project'
            }
            {
              id : '4'
              title : 'yet some other project'
            }
          ]}
          valueKey='id'
          titleKey='title'
          onSelect={->}
        />
        <input
          value={@state.rate}
          onChange={@onChange.bind(@,'rate')}
          placeholder='rate'
        /><br/>
        <input value={@state.currency} placeholder='currency' readOnly/><br/>
        <input placeholder='estimate' readOnly/><br/>
        <input placeholder='deadline' readOnly/><br/>
        <input
          value={@state.complexity}
          onChange={@onChange.bind(@,'complexity')}
          placeholder='complexity'
        /><br/>
        <button onClick={@addTask}>add task</button>
      </div>
    )
