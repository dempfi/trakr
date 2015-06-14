Currencies        = require 'utils/currencies'
Autocomplete      = require 'components/autocomplete'

module.exports = React.createClass

  render : ->
    <Autocomplete
      list        = {Currencies()}
      valueKey    = 'currency'
      titleKey    = 'name'
      onSelect    = {->}
    />