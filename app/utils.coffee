module.exports =
  uuid: ->

    ###jshint bitwise:false ###

    i = undefined
    random = undefined
    uuid = ''
    i = 0
    while i < 32
      random = Math.random() * 16 | 0
      if i == 8 or i == 12 or i == 16 or i == 20
        uuid += '-'
      uuid += (if i == 12 then 4 else if i == 16 then random & 3 | 8 else random).toString(16)
      i++
    uuid
  pluralize: (count, word) ->
    if count == 1 then word else word + 's'
  store: (namespace, data) ->
    if data
      return localStorage.setItem(namespace, JSON.stringify(data))
    store = localStorage.getItem(namespace)
    store and JSON.parse(store) or []
  extend: ->
    newObj = {}
    i = 0
    while i < arguments.length
      obj = arguments[i]
      for key of obj
        if obj.hasOwnProperty(key)
          newObj[key] = obj[key]
      i++
    newObj
  dayTitle: (day) ->
    date = new Date(parseInt(day))
    months = 'Jan,Feb,Mar,Apr,May,June,July,Aug,Sep,Oct,Nov,Dec'.split(',')
    date.getDate() + ' ' + months[date.getMonth()]
  today: ->
    date = new Date
    date.setUTCHours 0
    date.setUTCMinutes 0
    date.setUTCMilliseconds 0
    date.setUTCSeconds 0
    date.getTime()