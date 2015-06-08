ToTuple = require 'utils/momentToTuple'

module.exports = React.createClass

  getMonth : ->
    {month} = @props
    start   = moment(month).startOf('month').startOf('week')
    end     = moment(month).endOf('month').endOf('week')
    ret     = []
    moment.range(start, end).by 'day', (date) =>
      ret.push ToTuple date
    ret

  renderDate : (day) ->
    return (
      <li
        key     = {day.join('-')}
        onClick = {@props.onSelect.bind(null, day)}
      >{day[2]}</li>
    )

  render : ->
    return <ul>{_.map @getMonth(), (date) => @renderDate(date)}</ul>
