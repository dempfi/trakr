ToTuple = require 'utils/momentToTuple'
Month   = require 'components/datepicker/month'

module.exports = React.createClass

  getInitialState : ->
    currentMonth : ToTuple moment()

  incrementMonth : (inc) ->
    [y, m, d] = @state.currentMonth
    if      m + inc > 11 then m = 0;  y += 1
    else if m + inc < 0  then m = 11; y -= 1
    else    m += inc
    @setState currentMonth : [y, m, d]

  onSelect : (d) ->
    [curY, curM] = @state.currentMonth
    return if d[0] isnt curY or d[1] isnt curM
    @props.onSelect moment(d).format('YYYY-MM-DD'), moment(d)

  render : ->
    title = moment(@state.currentMonth).format('MMMM YYYY')

    return (
      <div>
        <div>
          <span onClick={@incrementMonth.bind(@, -1)}>prev</span>
          <span>{title}</span>
          <span onClick={@incrementMonth.bind(@, 1)}>next</span>
        </div>
        <Month
          month = {@state.currentMonth}
          onSelect = {@onSelect}
        />
      </div>
    )
