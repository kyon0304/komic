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
    return app.getModel('book').get('name')
  }
})

function spawn(fn) {
  return co.wrap(fn)()
}

class Loader {
  constructor (options) {
    this.model = new Model()
    this.THRESHOLD = 5
    this.xhr = undefined
    this.cachedPages = new Map()
    this.cachedPages = []
    app.on('fetched:book', () => {
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
    let self = this
    return this.store.iterate((val, key, iterationNumber) => {
      self.cachedPages.push(key)
      //self.cachedPages.set(key, val)
    })
  }

  preloadImages() {
    this.stopLoading()
    let model = this.model
      , total = model.getTotalPage()
      , currentPage = model.getCurrentPage()
      , start = currentPage + 1
      , end = start + this.THRESHOLD > total ? total : start + this.THRESOLD
      , src = model.getImageUri(page)
      , pages = _.range(start, end + 1)
      , urls = pages.map((val) => { return model.getImageUri(val) })
      , cached

    this.iterate((val, key) => {
      cachedUrls.push(key)
      console.log('cached urls', cachedUrls)
    }).then(() => {
      return _.intersection(cachedUrls, urls)
    }).then((preloadUrls) => {
      console.log('preload urls', preloadUrls)
      spawn(function*(preloadUrls) {
        let imageBlob

        while(preloadUrls.length) {
          try {
            imageBlob = yield self.fetch({url: src})
            self.storeImage(src, imageBlob)
            preloadUrls.splice(_.indexof(preloadUrls, src))
          } catch(e) {
            break
          }
        }
      })
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
      return new Promise.resolve()
    }, () => {
      return new Promise((resolve, reject) => {
        self.store.getItem(src).then((imageBlob) => {
          //self.cachedPages.set(src, imageBlob)
          self.cachedPages.push(src)
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
      , self = this

    return self.store.setItem(imageData).then(() => {
      //self.cachedPages.set(key, val)
      self.cachedPages.push(key)
    }, () => {
      self.cachedPages.push(key)
      //self.cachedPages.set(key, val)
    })
  }

  storeCurrentImage(val) {
    let key = this.model.getCurrentImageUri()

    if( key in this.cachedPages) { return }
    //if(this.cachedPages.has(key)) { return }

    return this.storeImage(key, val)
  }

  stopLoading() {
    if (!this.xhr) { return }
    if (this.xhr.readyState === request.States.DONE) { return }
    this.xhr.abort()
  }

  pickCachedImage(page) {
    let url = this.model.getImageUri(page)

    console.log('pick enter', page, url)

    return (
      this.store.getItem(url).then((cached) => {
        console.log('got item', cached)
        return window.URL.createObjectURL(cached)
      })
    )
  }

  hasLoaded(key) {
    let url = key||this.model.getCurrentImageUri()
    return new Promise((resolve, reject) => {
      this.store.getItem(key).then(reject, resolve)
    })
  }
}

export default new Loader
