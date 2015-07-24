module.exports = React.createClass

  constructDates : (end) ->
    fst = moment().add 1, 'd'
    lst = moment(end).subtract 1, 'd'
    until fst.subtract(1, 'd').isSame lst, 'd' then moment fst

  date : (date, i) ->
    dateString = date.format('YYYY-MM-DD')
    onSelect = => @props.onSelect(dateString)
    <li
      onClick={onSelect}
      className={'active' if dateString is @props.active}
      key={i}
    >
      <span className='date'>{date.format('D')}</span>
      <span className='weekday'>{date.format('ddd')}</span>
    </li>

  render : ->
    dates = @props.dates.sort().reverse()
    dates = @constructDates dates[dates.length - 1]
    <ul className='dateribbon'>{_.map dates, (d, i) => @date(d, i)}</ul>
