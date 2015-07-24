ToTuple = require 'utils/momentToTuple'
Month   = require 'components/datepicker/month'

module.exports = React.createClass

  getInitialState : ->
    currentMonth : ToTuple moment()
    isOpen       : false
    isHideable   : true

  setMonth : (inc) ->
    [y, m, d] = @state.currentMonth
    if      m + inc > 11 then m = 0;  y += 1
    else if m + inc < 0  then m = 11; y -= 1
    else    m += inc
    @setState currentMonth : [y, m, d]

  onSelect : (date) ->
    [curYear, curMonth] = @state.currentMonth
    return if date[0] isnt curYear or date[1] isnt curMonth
    @props.onSelect moment(date).format 'YYYY-MM-DD'
    @hide()

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

  handleKeyDown : (e) ->
    @hide() if e.key is 'Escape'

  render : ->
    title    = moment @state.currentMonth
    isActive = isOpen : @state.isOpen
    date     = if @props.selected then moment(@props.selected).format('MMMM DD') else ''

    <label className={classNames 'datepicker', isActive}>
      <input
        ref       = 'input'
        className = {classNames 'input', isActive}
        onFocus   = {@show}
        onBlur    = {@handleBlur}
        value     = {date}
        onKeyDown = {@handleKeyDown}
        tabIndex  = '1'
        onChange  = {->}
        required
      />
      <span className='label'>{@props.label}</span>
      <span className='line'></span>
      <div
        className   = 'calendar'
        onMouseDown = {@mouseDown}
        onMouseUp   = {@mouseUp}
      >
        <div className = 'title'>
          <div
            onClick   = {@setMonth.bind @, -1}
            className ='prev'
          />
          <span className='month-title'>{title.format('MMMM YYYY')}</span>
          <div
            onClick   = {@setMonth.bind @, 1}
            className ='next'
          />
        </div>

        <div className='weekdays'>
          {_.map moment.weekdaysMin(), (i) -> <span>{i}</span>}
        </div>

        <Month
          month    = {@state.currentMonth}
          onSelect = {@onSelect}
          selected = {@props.selected}
        />
      </div>
    </label>

