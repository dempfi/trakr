module.exports = (total) ->
  hours   = Math.floor total / 3600
  minutes = Math.floor (total - hours * 3600) / 60
  seconds = total - hours * 3600 - minutes * 60
  [hours, minutes, seconds, total]