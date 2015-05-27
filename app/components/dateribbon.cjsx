Link = ReactRouter.Link

module.exports = React.createClass

  generateArray : ->
    array = []
    array.push(moment().subtract(i, 'd')) for i in [0..30]
    array

  date : (m) ->
    <Link
      to='timeline'
      params={date : m.format('YYYY-MM-DD')}
    >{m.format('D ddd')}</Link>

  render : ->
    return <ul>{@generateArray().map (m) => @date(m)} </ul>
