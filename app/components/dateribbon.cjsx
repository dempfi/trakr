Link = ReactRouter.Link

module.exports = React.createClass

  constructDates : (end) ->
    fst = moment().add 1, 'd'
    lst = moment(end).subtract 1, 'd'
    until fst.subtract(1, 'd').isSame lst, 'd' then moment fst

  date : (date, i) ->
    <Link
      key={i}
      to='timeline'
      params={date : date.format('YYYY-MM-DD')}
    >{date.format('D ddd')}</Link>

  render : ->
    dates = @props.dates.sort().reverse()
    dates = @constructDates dates[dates.length - 1]
    <ul>{_.map dates, (d, i) => @date(d, i)}</ul>
