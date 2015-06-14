module.exports = React.createClass

  propTypes :
    onFilter    : React.PropTypes.func
    onSelect    : React.PropTypes.func
    renderItem  : React.PropTypes.func
    list        : React.PropTypes.oneOfType [
                    React.PropTypes.array
                    React.PropTypes.object
                  ]
    titleKey    : React.PropTypes.string
    valueKey    : React.PropTypes.string
    placeholder : React.PropTypes.string


  getInitialState : ->
    value      : ''
    isOpen     : false
    activeItem : {}

  onChange : (e) ->
    value         = e.target.value
    reg           = new RegExp("^#{value}", 'i')
    filteredList  = _.filter @props.list, (i) =>
      return @props.onFilter(value, i) if @props.onFilter
      reg.test(i[@props.titleKey]) or
      reg.test(i[@props.valueKey])

    @setState
      value : value
      list  : filteredList

  hide : -> @setState 'isOpen' : false

  show : -> @setState 'isOpen' : true

  handleBlur : ->
    @selectItem @state.activeItem
    @hide()

  handleFocus : (e) ->
    console.log 'focus'
    @show()
    @onChange e

  selectItem : (item) ->
    @setState
      value      : item[@props.titleKey]
      activeItem : {}
    @props.onSelect(item[@props.valueKey], item)
    @hide()

  handleKeyDown : (e) ->
    switch e.key
      when 'ArrowDown' then @updateIndex('down')
      when 'ArrowUp'   then @updateIndex('up')
      when 'Enter'     then @selectItem(@state.activeItem)
      when 'Escape'    then console.log('ESC')

  updateIndex : (direction) ->
    current     = @state.activeItem
    currentId   = @state.list.indexOf current
    lastId      = @state.list.length - 1
    nextId      =
      if direction is 'down' then @indexDown(currentId, lastId)
      else @indexUp(currentId, lastId)
    @setState activeItem : @state.list[nextId]

  indexDown : (cur, last) ->
    return 0        if cur < 0 or cur is last
    return cur + 1  if cur < last
    return last

  indexUp : (cur, last) ->
    return last     if cur <= 0
    return cur - 1  if cur <= last
    return last

  foucusItem : (i) ->
    @setState activeItem : i

  renderItem : (item) ->
    styles = isActive : @state.activeItem[@props.valueKey] is item[@props.valueKey]
    <li
      className    = {classNames(styles)}
      key          = {item[@props.valueKey]}
      onMouseEnter = {@foucusItem.bind(@, item)}
      onMouseLeave = {@foucusItem.bind(@, {})}
      children     = {item[@props.titleKey]}
    />


  render : ->
    listClasses =
      list    : true
      isOpen  : @state.isOpen

    <div className='autocomplete'>
      <input
        value       = {@state.value}
        onChange    = {@onChange}
        onKeyDown   = {@handleKeyDown}
        onFocus     = {@handleFocus}
        onBlur      = {@handleBlur}
        onClick     = {@show}
        placeholder = {@props.placeholder}
        tabIndex    = '1'
      />
      <ul
        className = {classNames(listClasses)}
        onClick   = {@selectItem.bind(@, @state.activeItem)}
      >
        {@state.list?.map (item) => @renderItem(item)}
      </ul>
    </div>
