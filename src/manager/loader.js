import co from 'co'

import app from 'app'

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
    this.map = new Map()
    this.model = new Model()
    this.MAX_COUNT = 5
    this.xhr = undefined
    this.preloadASC = true
  }

  setPreloadASC(ascend) {
    this.preloadASC = !!ascend
  }

  getPreloadPage(page) {
    if (this.preloadASC)
      return page += 1
    else
      return page -= 1
  }

  preloadImages() {
    spawn(function*() {
      let model = this.model
        , page = this.getPreloadPage(model.getCurrentPage())
        , total = model.getTotalPage()
        , src
        , imageBlob

      while (true) {
        if (page > total || page < 1) break
        if (this.map.has(page)) {
          page = this.getPreloadPage(page)
          continue
        }

        src = model.getImageUri(page)
        try {
          imageBlob = yield this.request({url: src})
          this.map.set(page, imageBlob)
        } catch(e) {
          page -= 1
        }

        page = this.getPreloadPage(page)
      }
    }.bind(this))
  }

  request(options, ...args) {
    this.xhr = new XMLHttpRequest()
    return request(Object.assign({ xhr: this.xhr }, options), ...args)
  }

  loadCurrentImage() {
    let map = this.map
      , model = this.model
      , page = model.getCurrentPage()
      , src = model.getImageUri(page)
      , noop = function() {}

    if (this.hasLoaded(page)) {
      return Promise.resolve()
    } else {
      this.xhr = new XMLHttpRequest()
      return (this.request({ url: src })
        .then((imageBlob) => {
          this.storeCurrentImage(imageBlob)
        }, noop))
    }
  }

  store(key, val) {
    if (!this.map.has(key)) {
      this.map.set(key, val)
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
      , cached = this.map.get(page)

    img.src = window.URL.createObjectURL(cached)
    return img
  }

  hasLoaded(key) {
    let page = key||this.model.getCurrentPage()
    return !!(this.map.has(page))
  }
}

export default new Loader
