TasksStore      = require 'store/tasks'
TasksActions    = require 'actions/tasks'
ProjectsActions = require 'actions/projects'
ProjectsStore   = require 'store/projects'
Autocomplete    = require 'components/autocomplete'
Currencies      = require 'utils/currencies'
Datepicker      = require 'components/datepicker'

module.exports = React.createClass
  mixins: [
    Reflux.connect(ProjectsStore, 'projects')
    ReactRouter.Navigation
  ]

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

  setProject : (value, item) ->
    return @setState project : value if value
    ProjectsActions.add(item.title).then =>
      @setState project : ProjectsStore.find(item.title)['id']

  onChange : (key, e) ->
    @set key, e.target.value

  expand : (val) ->
    @refs.inputs.getDOMNode().style.top = "#{@state.top - val}px"

  collapse : ->
    @refs.inputs.getDOMNode().style.top = "#{@state.top}px"

  componentDidMount : ->
    el = @refs.inputs.getDOMNode()
    {top} = el.getBoundingClientRect()
    @setState top : top

  addProject : (value) ->
    text =
    if value
      <div>
        Hit return to add <strong>"{value}"</strong> into the list of projects
      </div>
    else
      <div>
        No projects listed. To add one start typing and hit return
      </div>
    <div className='project-not-found'>{text}</div>

  renderCurrencyItem : (item) ->
    <div className='project-item'>
      {item.currency}
      <span className='name'>, {item.name}</span>
      <span className='symbol'>{item.symbol}</span>
    </div>

  render : ->
    <div>
      <header className='new-task'>
        <div className='title-row'>
          <div className='title'>New task</div>
        </div>
        <div className='actions-row'>
          <a className='back' onClick={@goBack}></a>
        </div>
      </header>

      <main className='new-task' ref='inputs'>
        <label>
          <input
            value    = {@state.title}
            onChange = {@onChange.bind(@,'title')}
            tabIndex = '1'
            required
          />
          <span className='label'>Task</span>
          <span className='line'></span>
        </label>

        <Autocomplete
          list       = {@state.projects}
          valueKey   = 'id'
          titleKey   = 'title'
          onSelect   = {@setProject}
          label      = 'Project'
          onOpen     = {@expand.bind @, 65}
          onClose    = {@collapse}
          onNotFound = {@addProject}
        />

        <div className='two-inputs'>

          <label className='left'>
            <input
              value    = {@state.rate}
              onChange = {@onChange.bind(@, 'rate')}
              tabIndex = '1'
              required
            />
            <span className='label'>Hourly rate</span>
            <span className='line'></span>
          </label>

          <Autocomplete
            list       = {Currencies()}
            valueKey   = 'currency'
            titleKey   = 'name'
            label      = 'Currency'
            onClose    = {@collapse}
            onSelect   = {@set.bind(@, 'currency')}
            onOpen     = {@expand.bind @, 130}
            renderItem = {@renderCurrencyItem}
          />

        </div>

        <div className='two-inputs'>

          <label className='left'>
            <input required readOnly />
            <span className='label'>Estimate</span>
            <span className='line'></span>
          </label>

          <Datepicker
            onSelect = {@set.bind(@, 'deadline')}
            selected = {@state.deadline}
            label    = 'Deadline'
            onOpen   = {@expand.bind @, 195}
            onClose  = {@collapse}
          />

        </div>

        <label className='range'>
          <input
            type     = 'range'
            value    = {@state.complexity}
            onChange = {@onChange.bind(@, 'complexity')}
            min      = {0}
            step     = {1}
            max      = {10}
            tabIndex = '1'
          />
          <span className='label'>Complexity</span>
        </label>

        <button className='add-task' onClick={@addTask}>add task</button>

      </main>
    </div>

