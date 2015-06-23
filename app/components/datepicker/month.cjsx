ToTuple = require 'utils/momentToTuple'

module.exports = React.createClass

  getMonth : ->
    {month} = @props
    fst = moment(month).startOf('month').startOf('week')
    lst = moment(month).endOf('month').endOf('week')
    until fst.add(1, 'd').isSame lst, 'd' then ToTuple fst

  renderDate : (day) ->
    className = 'other-month' if day[1] isnt @props.month[1]
    className = 'active' if moment(day).format('YYYY-MM-DD') is @props.selected
    <li
      key       = {day.join('-')}
      className = {className}
      onClick   = {@props.onSelect.bind(null, day)}
    >{day[2]}</li>

  render : ->
    <ul>{_.map @getMonth(), (date) => @renderDate(date)}</ul>
