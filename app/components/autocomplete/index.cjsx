module.exports = React.createClass

  getInitialState : ->
    value       : ''
    activeItem  : {}

  onChange : (e) ->
    value         = e.target.value
    reg           = new RegExp("^#{value}", 'i')
    filteredList  = _.filter @props.list, (i) => reg.test i[@props.titleKey]
    @setState
      list    : filteredList
      value   : value

  handleFocus : -> @setState isOpen : true

  handleBlur  : ->
    setTimeout =>
      @setState isOpen : false
    , 10
  handleEnter : ->
    @selectItem @state.activeItem
    @setState isOpen : false


  selectItem : (item) ->
    @setState value : item[@props.titleKey]
    @props.onSelect(item)


  handleKeyDown : (e) ->
    switch e.key
      when 'ArrowDown'  then @updateIndex('down')
      when 'ArrowUp'    then @updateIndex('up')
      when 'Enter'      then @handleEnter()
      when 'Escape'     then console.log('ESC')


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


  renderItem : (item) ->
    styles = isActive : @state.activeItem[@props.valueKey] is item[@props.valueKey]
    return (
      <li
        className = {classNames(styles)}
        key       = {item[@props.valueKey]}
        onClick   = {@selectItem.bind(@, item)}
      >
        {item[@props.titleKey]}
      </li>
    )


  render : ->
    listClasses =
      list    : true
      isOpen  : @state.isOpen

    return (
      <div className='autocomplete'>
        <input
          value     = {@state.value}
          onChange  = {@onChange}
          onKeyDown = {@handleKeyDown}
          onFocus   = {@handleFocus}
          onBlur    = {@handleBlur}
        />
        <ul className = {classNames(listClasses)}>
          {@state.list?.map (item) => @renderItem(item)}
        </ul>
      </div>
    )
