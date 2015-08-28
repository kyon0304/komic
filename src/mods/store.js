//import app from 'app'

const DB_NAME = 'komic'
const DB_TABLE_NAME = 'book' //app.getModel('book').getBookTitle()
const DB_VERSION = 1

class Store {
  constructor() {
    this.db = undefined
  }

  openDB() {
    if (this.db) { return Promise.resolve() }

    let req = indexedDB.open(DB_NAME, DB_VERSION)
    return new Promise((resolve, reject) => {
      req.onsuccess = (evt) => {
        this.db = evt.target.result
        resolve(this.db)
      }.bind(this)
      req.onerror = (evt) => {
        reject(evt.target.errorCode)
      }
      req.onupgradeneeded = (evt) => {
       let store = evt.currentTarget.result.createObjectStore(
            DB_TABLE_NAME, {keyPath: 'id', autoIncrement: true})
         store.createIndex('page', 'page', {unique: true})
      }
    })
  }

  getObjectStore(store_name, mode) {
    if (!this.db) {
      alert('open indexedDB failed!')
    } else {
      let tx = this.db.transaction(store_name, mode)
      return tx.objectStore(store_name)
    }
  }

  clearObjectStore(store_name) {
    let store = this.getObjectStore(DB_TABLE_NAME, 'readwrite')
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

  getImageBlob(key) {
    let store = this.getObjectStore(DB_TABLE_NAME, 'readonly')
      , req = store.get(key)
    return new Promise((resolve, reject) => {
      req.onsuccess = (evt) => {
        if (evt.target.result) {
          resolve(evt.target.result.imageBlob)
        } else {
          reject('not found')
        }
      }
      req.onerror = (evt) => {
        reject(evt.target.errorCode)
      }
    })
  }

  addImageData(imageData) {
    let store = this.getObjectStore(DB_TABLE_NAME, 'readwrite')
      , req
    try {
      req = store.add(imageData)
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

  getStoredPages(pages) {
    let index = this.getObjectStore(DB_TABLE_NAME, 'readonly').index('page')
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
}

let store = new Store()
store.DB_NAME = DB_NAME
store.DB_TABLE_NAME = DB_TABLE_NAME
store.DB_VERSION = DB_VERSION
export default store
