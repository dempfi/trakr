Link = ReactRouter.Link

module.exports = React.createClass

  generateArray : ->
    array = []
    array.push(moment().subtract(i, 'd')) for i in [0..30]
    array

  date : (date, i) ->
    <Link
      key={i}
      to='timeline'
      params={date : date}
    >{moment(date).format('D ddd')}</Link>

  render : ->
    dates = @props.dates.sort().reverse()
    return <ul>{_.map dates, (d, i) => @date(d, i)} </ul>
