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

  hide : -> @setState 'isOpen' : false

  show : -> @setState 'isOpen' : true

  handleBlur : -> @hide() if @state.isHideable

  mouseDown : ->
    @setState 'isHideable' : false
    React.findDOMNode(@refs.input).focus()

  mouseUp : ->
    @setState 'isHideable' : true
    React.findDOMNode(@refs.input).focus()

  render : ->
    title    = moment @state.currentMonth
    isActive = active : @state.isOpen

    <div>
      <span
        ref       = 'input'
        className = {classNames 'input', isActive}
        onFocus   = {@show}
        onClick   = {@show}
        onBlur    = {@handleBlur}
        children  = {@props.selected}
        tabIndex  = '1'
      />

      <div
        className   = {classNames '-datepicker', isActive}
        onMouseDown = {@mouseDown}
        onMouseUp   = {@mouseUp}
      >
        <div className = 'header'>
          <span onClick = {@setMonth.bind @, -1}>prev</span>
          <span>{title.format('MMMM YYYY')}</span>
          <span onClick = {@setMonth.bind @, 1}>next</span>
        </div>

        <Month
          month    = {@state.currentMonth}
          onSelect = {@onSelect}
          selected = {@props.selected}
        />
      </div>
    </div>

