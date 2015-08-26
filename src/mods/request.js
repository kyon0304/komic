const Methods = {
  GET: 'GET'
, POST: 'POST'
, PUT: 'PUT'
, DELETE: 'DELETE'
, PATCH: 'PATCH'
, OPTIONS: 'OPTIONS'
}

const Events = {
  READY_STATE_CHANGE: 'readystatechange'
, LOAD_START: 'loadstart'
, PROGRESS: 'progress'
, ABORT: 'abort'
, ERROR: 'error'
, LOAD: 'load'
, TIMEOUT: 'timeout'
, LOAD_END: 'loadend'
}

const ResponseTypes = {
  DOM_STRING: ''
, ARRAY_BUFFER: 'arraybuffer'
, BLOB: 'blob'
, DOCUMENT: 'document'
, JSON: 'json'
, TEXT: 'text'
}

var request = ({
    xhr
  , url
  , method = Methods.GET
  , responseType = ResponseTypes.BLOB
  , events = {}
  }) => {

  xhr = xhr || new XMLHttpRequest()

  return new Promise((resolve, reject) => {
    xhr.open(method, url, true)
    xhr.responseType = responseType
    xhr.addEventListener(Events.LOAD, () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject(xhr.status)
      }
    })

    var eventAndFuncs = Array
      .from(
          [ Events.ERROR, Events.ABORT, Events.TIMEOUT ]
        , event => [ event, () => { reject(xhr.status) } ]
        )
      .concat(Object.entries(events))

    eventAndFuncs.forEach(([ eventName, func ]) => {
      xhr.addEventListener(eventName, func)
    })

    xhr.send()
  })
}

request.Events = Events
request.ResponseTypes = ResponseTypes
request.Methods = Methods

export default request
