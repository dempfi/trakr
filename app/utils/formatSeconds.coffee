module.exports = (total) ->
  hours   = "0#{Math.floor total / 3600}".slice(-2)
  minutes = "0#{Math.floor (total - hours * 3600) / 60}".slice(-2)
  seconds = "0#{total - hours * 3600 - minutes * 60}".slice(-2)
  [hours, minutes, seconds, total]
