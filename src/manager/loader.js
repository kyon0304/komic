import co from 'co'

import app from 'app'
import store from 'mods/store'

var Model = Backbone.Model.extend({
  getImage: (page) => {
    return app.getModel('book').getCurrentImage(page)
  }

, getCurrentPage: () => {
    return app.getModel('canvas').get('currentPage')
  }

, getTotalPage: () => {
    return app.getModel('canvas').get('totalPage')
  }

, getImageUri: (page) => {
    return app.getModel('book').getCurrentImageUri(page)
  }
})

function request(opts) {
  let xhr = opts.xhr || new XMLHttpRequest()
    , url = opts.url

  return new Promise((resolve, reject) => {
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject(xhr.status)
      }
    })
    xhr.addEventListener('error', reject)
    xhr.addEventListener('abort', reject)

    xhr.send()
  })
}

function spawn(fn) {
  return co.wrap(fn)()
}


/**
 * TODO
 * 1. manage data in map, eg. override old data
 * 2. use indexDB or loacalStorage to save memory using
 */
class Loader {
  constructor (options) {
    this.model = new Model()
    this.THRESHOLD = 5
    this.xhr = undefined
    store.openDB().then((db) => {
      console.log('open indexedDB successfully')
    })
    this.storedPages = []
  }

  preloadImages() {
    this.stopLoading()
    spawn(function*() {
      let model = this.model
        , currentPage = model.getCurrentPage()
        , page = currentPage + 1
        , total = model.getTotalPage()
        , src
        , imageBlob
        , imageData = {'page': page, 'image': imageBlob}

      while (true) {
        if (page in storedPages) {
          page += 1
          continue
        }

        if (page > total || page < 1) break
        if (page >= currentPage + this.THRESHOLD)  break

        src = model.getImageUri(page)
        try {
          imageBlob = yield this.request({url: src})

          imageData.page = page
          imageData.image = imageBlob
          store.addImageData(imageData).then(() => {
             this.storedPages.push(page)
          })

        } catch(e) {
          page -= 1
        }

        page += 1
      }
    }.bind(this))
  }

  request(options, ...args) {
    this.xhr = new XMLHttpRequest()
    return request(Object.assign({ xhr: this.xhr }, options), ...args)
  }

  loadCurrentImage() {
    this.stopLoading()
    let model = this.model
      , page = model.getCurrentPage()
      , src = model.getImageUri(page)
      , noop = function() {}

    if (this.hasLoaded(page)) {
      return Promise.resolve()
    } else if (sotre.has(key)) {
      return store.getImageBlob(key).then(() => {
         this.storedPages.push(key)
      })
    } else {
      return (this.request({ url: src })
        .then((imageBlob) => {
          this.storeCurrentImage(imageBlob)
        }, noop))
    }
  }

  store(key, val) {
    if(key in this.storedPages) return
    if (!store.has(key)) {
      store.addImageData().then(() => {
         this.storePages.push(key)
      })
    } else {
      this.storedPages.push(key)
    }
  }

  storeCurrentImage(val) {
    let page = this.model.getCurrentPage()
    this.store(page, val)
  }

  stopLoading() {
    if (!this.xhr) { return }
    this.xhr.abort()
  }

  pickCachedImage(page) {
    let img = this.model.getImage(page)
      , picked = false
      , noop = function() {}

    store.getImageBlob(page).then((cached) => {
      img.src = window.URL.createObjectURL(cached)
      picked = true
    }).catch ((e) => {
      picked = true
    })

    while(!picked) { noop() }
    return img
  }

  hasLoaded(key) {
    let page = key||this.model.getCurrentPage()
    return !!(page in this.storedPages)
  }
}

export default new Loader
