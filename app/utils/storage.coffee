module.exports =
  uuid: ->
    uuid = ''
    i = 0
    while i < 32
      random = Math.random() * 16 | 0
      uuid += '-' if i == 8 or i == 12 or i == 16 or i == 20
      uuid += (if i == 12 then 4 else if i == 16 then random & 3 | 8 else random).toString(16)
      i++
    uuid

  store: (NS, data) ->
    if data
      return localStorage.setItem(NS, JSON.stringify(data))
    store = localStorage.getItem(NS)
    store and JSON.parse(store) or undefined
