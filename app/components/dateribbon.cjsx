module.exports = React.createClass

  generateArray : ->
    array = []
    array.push(moment().subtract(i, 'd')) for i in [0..30]
    array

  date : (m) ->
    onSelect = @props.onSelect
    return (
      <li
        onClick={onSelect.bind(@,m)}
      >{m.format('D ddd')}</li>
    )


  render : ->
    return (
      <div>
        {@generateArray().map (m) => @date(m)}
      </div>
    )
