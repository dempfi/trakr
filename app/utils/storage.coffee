module.exports = (namespace, data) ->
  if data
    return localStorage.setItem(namespace, JSON.stringify(data))
  store = localStorage.getItem(namespace)
  store and JSON.parse(store) or undefined
