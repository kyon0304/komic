const DB_NAME = 'komic'
const DB_TABLE_NAME = app.getModel('book').getBookTitle()
const DB_VERSION = 1
let db

function openDB() {
  let req = indexedDB.open(DB_NAME, DB_VERSION)
  return new Promise((resolve, reject) => {
    req.onsuccess = (evt) => {
      db = evt.target.result
      resolve(db)
    }
    req.onerror = (evt) => {
      reject(evt.target.errorCode)
    }
    req.onupgradeneeded = function (evt) {
     let store = evt.currentTarget.result.createObjectStore(
          DB_STORE_NAME, {keyPath: 'id', autoIncrement: true})
       store.createIndex('page', 'page', {unique: true})
    }
  })
}

function getObjectStore(store_name, mode) {
  if (!db) {
    openDB().then((res) => {
      db = res
      let tx = db.transaction(store_name, mode)
      return tx.objectStore(store_name)
    }, (err) => {
      alert('cannot get object store') 
    })
  } else {
    let tx = db.transaction(store_name, mode)
    return tx.objectStore(store_name)
  }
}

function clearObjectStore(store_name) {
  let store = getObjectStore(store_name, 'readwrite')
    , req = store.clear()
  return new Promise((resolve, reject) => {
    req.onsuccess = (evt) => {
      resolve()
    }
    req.onerror = (evt) => {
      reject(evt.target.errorCode)
    }
  })
}

function getImageBlob(key) {
  let store = getObjectStore(DB_STORE_NAME, 'readonly')
    , req = store.get(key)
  return new Promise((resolve, reject) => {
    req.onsuccess = (evt) => {
      resolve(evt.target.result)
    }
    req.onerror = (evt) => {
      reject(evt.target.errorCode)
    }
  })
}

function addImageData(imageData) {
  let store = getObjectStore(DB_STORE_NAME, 'readwrite')
    , req
  try {
    req = streo.add(imageData)
  } catch (e) {
    throw e
  }
  return new Promise((resolve, reject) => {
    req.onsuccess = (evt) => {
      resolve()
    }
    req.onerror = (evt) => {
      reject()
    }
  })
}

function getStoredPages(pages) {
  let index = getObjectStore(DB_STORE_NAME, 'readonly').index('page')
  return new Promise((resolve, reject) => {
    index.openCursor().onsuccess = (evt) => {
      let cursor = evt.target.current
      if (cursor) {
        pages.push(cursor.key)
        cursor.continue()
      } else {
        resolve()
      }
    }
  })
}

function has(key) {
  let keys = []
    , index = getObjectStore(DB_STORE_NAME, 'readonly').index('page')
    , done = false
    , noop = function() {}

  index.openCursor().onsuccess = (evt) => {
    let cursor = evt.target.current
    if (cursor) {
      keys.push(cursor.key)
      cursor.continue()
    } else {
      done = true
    }
  }

  while(!done) { noop() }

  return (key in keys())

}

store.DB_NAME = DB_NAME
store.DB_TABLE_NAME = DB_TABLE_NAME
store.VERSION = VERSION
export default store
