import co from 'co'

import app from 'app'
import Store from './store'
import request from 'mods/request'
import _ from 'mods/utils'

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

, getBookTitle: () => {
    return app.getModel('book').get('name')
  }
})

function spawn(fn) {
  return co.wrap(fn)()
}

/**
 * TODO(kyon)
 * use url instead page as key
 */
class Loader {
  constructor (options) {
    this.model = new Model()
    this.THRESHOLD = 5
    this.xhr = undefined
    this.presentPages = new Map()
    app.on('create:book', () => {
      let config = {
        'name': 'komic'
      , 'version': 1
      , 'storeName': this.model.getBookTitle()
      }
      this.store = new Store(config)
      this.initPresentPages()
    }, this)
  }

  initPresentPages() {
    return this.store.iterate((val, key, iterationNumber) => {
      this.presentPages.set(key, val)
    })
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
          imageBlob = yield this.fetch({url: src})
          this.storeImage(page, imageBlob)
        } catch(e) {
          page -= 1
          break
        }

        page += 1
      }
    }.bind(this))
  }

  fetch(options, ...args) {
    this.xhr = new XMLHttpRequest()
    return request(Object.assign({ xhr: this.xhr }, options), ...args)
  }

  loadCurrentImage({ requestEvents }) {
    this.stopLoading()
    let model = this.model
      , page = model.getCurrentPage()
      , src = model.getImageUri(page)
      , noop = function() {}
      , self = this

    if (this.hasLoaded(page)) {
      return Promise.resolve()
    } else {
      return new Promise((resolve, reject) => {
        self.store.getItem(page).then((imageBlob) => {
          self.presentPages.set(page, imageBlob)
          resolve()
        }, () => {
          self.fetch({ url: src, events: requestEvents })
            .then((imageBlob) => {
               self.storeCurrentImage(imageBlob).then(() => {
                 resolve()
               }, noop)
            })
        })
      })
    }
  }

  storeImage(key, val) {
    let imageData = {'page': key, 'imageBlob':val}
      , self = this

    return self.store.setItem(imageData).then(() => {
      self.presentPages.set(key, val)
    }, () => {
      self.presentPages.set(key, val)
    })
  }

  storeCurrentImage(val) {
    let key = this.model.getCurrentPage()

    if(this.presentPages.has(key)) { return }

    return this.storeImage(key, val)
  }

  stopLoading() {
    if (!this.xhr) { return }
    if (this.xhr.readyState === request.States.DONE) { return }
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
