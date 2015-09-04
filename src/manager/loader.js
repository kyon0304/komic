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

, getCurrentImageUri() {
    let page = this.getCurrentPage()
    return this.getImageUri(page)
  }

, getBookTitle: () => {
    return app.getModel('book').getTitle()
  }

, getUUID: () => {
    return app.getModel('book').getUUID()
  }
})

class Loader {
  constructor (options) {
    this.model = new Model()
    this.THRESHOLD = 5
    this.xhr = undefined
    app.on('fetched:book', () => {
      let uuid = this.model.getUUID()
        , version
        , versionTable = new Map(this.getFromLocalStorage())

      if (!versionTable) {
        version = 1
        versionTable = new Map()
        versionTable.set(uuid, version)
        this.saveToLocalStorage(versionTable)
      } else if (versionTable.has(uuid)) {
        version = versionTable.get(uuid)
      } else {
        version = versionTable.size + 1
        versionTable.set(uuid, version)
        this.saveToLocalStorage(versionTable)
      }

      let config = {
        'name': 'komic'
      , 'version': version
      , 'storeName': this.model.getBookTitle()+uuid
      }
      this.store = new Store(config)
    }, this)
  }

  saveToLocalStorage(versionTable) {
    localStorage.setItem('manager/loader'
      , JSON.stringify(versionTable.toJSON()))
  }

  getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('manager/loader'))
  }

  preloadImages() {
    this.stopLoading()
    let model = this.model
      , total = model.getTotalPage()
      , currentPage = model.getCurrentPage()
      , start = currentPage + 1
      , end = start + this.THRESHOLD > total ? total + 1 : start + this.THRESHOLD
      , pages = _.range(start, end)
      , urls = pages.map((val) => { return model.getImageUri(val) })
      , cachedUrls = []
      , self = this

    this.store.iterate((val, key) => {
      cachedUrls.push(key)
    }).then(() => {
      return _.difference(urls, cachedUrls)
    }).then((preloadUrls) => {
      co.wrap(function* gen(preloadURLs) {
        let imageBlob

        while(preloadURLs.length) {
          let src = preloadURLs[0]
          try {
            imageBlob = yield self.fetch({url: src})
            self.storeImage(src, imageBlob)
            preloadURLs.splice(0, 1)
          } catch(e) {
            break
          }
        }
      })(preloadUrls)
    })
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

    return this.hasLoaded(src).then(() => {
      return Promise.resolve()
    }, () => {
      return new Promise((resolve, reject) => {
        self.store.getItem(src).then((imageBlob) => {
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
    })
  }

  storeImage(key, val) {
    let imageData = {'url': key, 'imageBlob':val}

    return this.store.setItem(imageData)
  }

  storeCurrentImage(val) {
    let key = this.model.getCurrentImageUri()
      , self = this

    return this.hasLoaded(key).catch(() => {
      return self.storeImage(key, val)
    })
  }

  stopLoading() {
    if (!this.xhr) { return }
    if (this.xhr.readyState === request.States.DONE) { return }
    this.xhr.abort()
  }

  pickCachedImage(page) {
    let url = this.model.getImageUri(page)

    return (
      this.store.getItem(url).then((cached) => {
        return window.URL.createObjectURL(cached)
      })
    )
  }

  hasLoaded(key) {
    let url = key||this.model.getCurrentImageUri()
    return this.store.getItem(url)
  }
}

export default new Loader
