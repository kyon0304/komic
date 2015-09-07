import co from 'co'

import app from 'app'
import Store from 'manager/store'
import request from 'mods/request'
import _ from 'mods/utils'

export default class Loader {
  constructor (options) {
    this.THRESHOLD = 5
    this.xhr = undefined
    app.on('fetched:book', () => {
      let book = app.getModel('book')
        , uuid = book.getUUID()
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
      , 'storeName': book.getTitle()+uuid
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
    let book = app.getModel('book')
      , indicator = app.getModel('progressIndicator')
      , total = book.getBookTotalPage()
      , currentPage = book.get('currentPage')
      , start = currentPage + 1
      , end = start + this.THRESHOLD > total ? total + 1 : start + this.THRESHOLD
      , pages = _.range(start, end)
      , urls = _.uniq(
        pages.map((page) => { return book.getImageUri({ page: page }) }))
      , cachedUrls = []
      , self = this

    this.getAllCachedImageUrls(cachedUrls).then(() => {
      return _.difference(urls, cachedUrls)
    }).then((preloadUrls) => {
      co.wrap(function* gen(preloadURLs) {
        let imageBlob

        while(preloadURLs.length) {
          let src = preloadURLs[0]
          try {
            imageBlob = yield self.fetch({url: src})
            self.storeImage(src, imageBlob)
            let cachedPage = currentPage + self.THRESHOLD - preloadURLs.length
            indicator.setPercent(cachedPage, total, 'loaded')
            indicator.trigger('change:loadedPercent')
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
    let book = app.getModel('book')
      , page = book.get('currentPage')
      , src = book.getImageUri({ page: page })
      , noop = function() {}
      , self = this

    return this.hasLoaded(src).then(() => {
      return this.pickCachedImage(page)
    }, () => {
      return new Promise((resolve, reject) => {
        self.store.getItem(src).then((imageBlob) => {
          resolve(imageBlob)
        }, () => {
          self.fetch({ url: src, events: requestEvents })
            .then((imageBlob) => {
               self.storeCurrentImage(imageBlob).then(() => {
                 resolve(imageBlob)
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
    let key = app.getModel('book').getCurrentImageUri()
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
    let book = app.getModel('book')
      , url = book.getImageUri({ page: page })

    return this.store.getItem(url)
  }

  getAllCachedImageUrls(cachedUrls) {
    return this.store.iterate((val, key) => {
      cachedUrls.push(key)
    })
  }

  hasLoaded(key) {
    let book = app.getModel('book')
      , url = key || book.getCurrentImageUri()
    return this.store.getItem(url)
  }
}
