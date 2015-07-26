ToTuple = require 'utils/momentToTuple'

module.exports = React.createClass

  getMonth : ->
    {month} = @props
    fst = moment(month).startOf('month').startOf('week').subtract 1, 'd'
    lst = moment(month).endOf('month').endOf('week').add 1, 'd'
    until fst.add(1, 'd').isSame lst, 'd' then ToTuple fst

  renderDate : (day, i) ->
    className = 'other-month' if day[1] isnt @props.month[1]
    className = 'active' if moment(day).format('YYYY-MM-DD') is @props.selected
    <li
      key       = {day[2]}
      className = {className}
      onClick   = {@props.onSelect.bind(null, day)}
    >{day[2]}</li>

  renderWeek : (week, i) ->
    <ul key={i} className='week'>{_.map week, (d, i) => @renderDate(d, i)}</ul>

  render : ->
    monthByWeeks = _.groupBy @getMonth(), (_, i) -> Math.floor(i/7)
    <div className='month'>{_.map monthByWeeks, (w, i) => @renderWeek(w, i)}</div>
