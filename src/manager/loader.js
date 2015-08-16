import co from 'co'

import app from 'app'

var Model = Backbone.Model.extend({
  getCurrentImageUri: () => {
    var book = app.getModel('book')
      , currentPage = app.getModel('canvas').get('currentPage')

    return book.getCurrentImageUri(currentPage)
  }

, getImage: (page) => {
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

class Fetcher {
  constructor() {
    this.xhr = new XMLHttpRequest()
  }

  config(eventType, callback) {
    this.xhr.addEventListener(eventType, callback, false)
  }

  request(url) {
    this.xhr.open('GET', url, true)
    this.xhr.responseType = 'blob'
    return new Promise((resolve, reject) => {
      this.config('load', resolve, false)
      this.config('error', reject, false)
      this.xhr.send()
    })
  }

  abort() {
    this.xhr.abort()
  }
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
    this.onRequestFetcher = new Fetcher()
    this.inadvanceFetcher = new Fetcher()
  }

  *preload() {
    let fetcher = this.inadvanceFetcher
      , model = this.model
      , page = model.getCurrentPage() + 1
      , total = model.getTotalPage()

    while (true) {
      if (page > total || this.map.size > this.MAX_COUNT) break
      if (this.map.has(page)) {
        page += 1
        continue
      }

      try {
        let data = yield fetcher.request(model.getImageUri(page))
        this.map.set(page, data.target.response)
      } catch (e) {
        // preload failed, retry
        page -= 1
      }
      page += 1
    }
    return page
  }

  loadInAdvance() {
    let spawn = co.wrap(::this.preload)

    spawn().then(() => {
      // generator done, which means cache is full or reach the last page
      console.log('load in advacne finished.')
    }, () => {
      // generator incomplete and broke, which means xhr failed or sth.
      console.log('load in advacne failed.')
    })
  }

  loadOnRequest() {
    let map = this.map
      , model = this.model
      , page = model.getCurrentPage()
      , fetcher = this.onRequestFetcher

    if (this.hasLoaded(page)) {
      return Promise.resolve()
    } else {
      fetcher.config('load', (resp) => {
        console.log('load on request', resp.target.response)
        map.set(page, resp.target.response)
      })
      return fetcher.request(model.getImageUri(page))
    }
  }

  stopLoading() {
    this.onRequestFetcher.abort()
    this.inadvanceFetcher.abort()
    let gen = this.preload()
    try {
      gen.throw('stop loading.')
    } catch (e) {
      console.log('loading stopped.')
    }
  }

  pickImage(page) {
    let img = this.model.getImage(page)
      , cached = this.map.get(page)

    if (cached) {
      img.src = window.URL.createObjectURL(cached)
    }
    return img
  }

  hasLoaded(key) {
    let page = key||this.model.getCurrentPage()
    return !!(this.map.has(page))
  }
}

export default new Loader
