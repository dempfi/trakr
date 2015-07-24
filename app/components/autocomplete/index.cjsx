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

  getDefaultProps :  ->
    renderItem : (i, key) => i[key]
    onNotFound : -> 'not found'

  getInitialState : ->
    value      : ''
    isOpen     : false
    isHideable : true
    activeItem : {}

  onChange : (e) ->
    @show()
    @filter e.target.value
    @setState value : e.target.value

  filter : (value) ->
    reg = new RegExp("^#{value}", 'i')
    @setState list : _.filter @props.list, (i) =>
      return @props.onFilter(value, i) if @props.onFilter
      reg.test(i[@props.titleKey]) or
      reg.test(i[@props.valueKey])

  hide : ->
    @props.onClose() if @props.onClose
    @setState 'isOpen' : false

  show : ->
    @setState {'isOpen' : true}, =>
      @props.onOpen() if @props.onOpen

  handleBlur : -> @hide() if @state.isHideable

  mouseDown : ->
    @setState 'isHideable' : false
    React.findDOMNode(@refs.input).focus()

  mouseUp : ->
    @setState 'isHideable' : true
    React.findDOMNode(@refs.input).focus()

  handleFocus : ->
    @show(); @filter('')

  selectItem : (item) ->
    @setState value : item[@props.titleKey]
    @props.onSelect(item[@props.valueKey], item)
    @hide()

  onReturn : ->
    item = @state.activeItem
    if @state.list?.length is 0
      item = {}
      item[@props.titleKey] = @state.value
    @selectItem(item)

  handleKeyDown : (e) ->
    switch e.key
      when 'ArrowDown' then @updateIndex('down')
      when 'ArrowUp'   then @updateIndex('up')
      when 'Enter'     then @onReturn()
      when 'Escape'    then @hide()

  updateIndex : (direction) ->
    current   = @state.activeItem
    currentId = @state.list.indexOf current
    lastId    = @state.list.length - 1
    nextId    =
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
    {valueKey, titleKey, renderItem} = @props
    styles = isActive : @state.activeItem[valueKey] is item[valueKey]
    <li
      className    = {classNames styles}
      key          = {item[@props.valueKey]}
      onMouseEnter = {@foucusItem.bind(@, item)}
      onMouseLeave = {@foucusItem.bind(@, {})}
      onClick      = {@selectItem.bind(@, item)}
      children     = {renderItem(item, titleKey)}
    />

  render : ->
    styles =
      autocomplete : true
      isOpen       : @state.isOpen

    <label className={classNames styles}>
      <input
        ref         = 'input'
        value       = {@state.value}
        onChange    = {@onChange}
        onKeyDown   = {@handleKeyDown}
        onFocus     = {@handleFocus}
        onBlur      = {@handleBlur}
        placeholder = {@props.placeholder}
        tabIndex    = '1'
        required
      />
      <span className='label'>{@props.label}</span>
      <span className='line'></span>
      <ul
        className   = 'options'
        onMouseDown = {@mouseDown}
        onMouseUp   = {@mouseUp}
      >
        {@state.list?.map (item) => @renderItem(item)}
        {@props.onNotFound(@state.value) if @state.list?.length is 0}
      </ul>
    </label>
