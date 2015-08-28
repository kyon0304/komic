import co from 'co'

import app from 'app'
import store from 'mods/store'
import request from 'mods/request'

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
    this.presentPages = new Map()
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

      while (true) {
        if (this.presentPages.has(page)) {
          page += 1
          continue
        }

        if (page > total || page < 1) break
        if (page >= currentPage + this.THRESHOLD)  break

        src = model.getImageUri(page)
        try {
          imageBlob = yield this.request({url: src})
          this.storeImage(page, imageBlob)
        } catch(e) {
          page -= 1
          break
        }

        page += 1
      }
    }.bind(this))
  }

  request(options, ...args) {
    this.xhr = new XMLHttpRequest()
    return request(Object.assign({ xhr: this.xhr }, options), ...args)
  }

  loadCurrentImage({ requestEvents }) {
    this.stopLoading()
    let model = this.model
      , page = model.getCurrentPage()
      , src = model.getImageUri(page)
      , noop = function() {}

    if (this.hasLoaded(page)) {
      return Promise.resolve()
    } else {
      return new Promise((resolve, reject) => {
        store.openDB().catch(() => {
          alert('load current open db failed')
        }).then(() => {
          store.getImageBlob(page).then((imageBlob)=>{
            this.presentPages.set(page, imageBlob)
            resolve()
          }, () => {
            this.request({ url: src })
              .then((imageBlob) => {
                this.storeCurrentImage(imageBlob).then(() => {
                  resolve()
                })
              }, noop)
          })
        }.bind(this), () => {
            alert('get stored data failed')
        })

      })
    }
  }

  storeImage(key, val) {
    let imageData = {'page': key, 'imageBlob':val}

    return store.addImageData(imageData).then(() => {
      this.presentPages.set(key, val)
    }.bind(this), () => {
      this.presentPages.set(key, val)
    }.bind(this))
  }

  storeCurrentImage(val) {
    let key = this.model.getCurrentPage()

    if(this.presentPages.has(key)) { return }

    return this.storeImage(key, val)
  }

  stopLoading() {
    if (!this.xhr) { return }
    if ( this.xhr.readyState === 4/*DONE*/) { return }
    this.xhr.abort()
  }

  pickCachedImage(page) {
    let img = this.model.getImage(page)
      , cached = this.presentPages.get(page)

    img.src = window.URL.createObjectURL(cached)

    return img
  }

  hasLoaded(key) {
    let page = key||this.model.getCurrentPage()
    return !!(this.presentPages.has(page))
  }
}

export default new Loader
