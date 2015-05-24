module.exports = React.createClass

  getInitialState : ->
    {
      value : ''
    }

  onChange : (e) ->
    value         = e.target.value
    reg           = new RegExp("^#{value}", 'i')
    filteredList  = _.filter @props.list, (i) => reg.test i[@props.titleKey]
    @setState
      list  : filteredList
      value : value


  selectItem : (item) ->
    @setState
      value : item[@props.titleKey]

  renderItem : (item) ->
    return (
      <li
        key={item[@props.valueKey]}
        onClick={@selectItem.bind(@, item)}
      >{item[@props.titleKey]}</li>
    )

  render : ->
    return (
      <div>
        <input
          value={@state.value}
          onChange={@onChange}
        />
        <ul>
          {@state.list?.map (item) => @renderItem(item)}
        </ul>
      </div>
    )
