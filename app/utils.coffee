module.exports =

  uuid: ->
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
