import app from 'app'
import co from 'co'

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

class Loader {
  constructor (options) {
    this.xhr = new XMLHttpRequest()
    this.map = new Map()
    this.model = new Model()
    this.MAX_COUNT = 5
  }

  *preload() {
    let xhr = this.xhr
      , page = this.model.getCurrentPage() + 1
      , total = this.model.getTotalPage()
      , src

    let fetch = () => {
      return new Promise ((resolve, reject) => {
        xhr.onload = resolve
        xhr.onerror = reject
        xhr.send()
      })
    }

    while (true) {
      /*
       * TODO
       * 1. manage data in map, eg. override old data
       * 2. use indexDB or loacalStorage to save memory using
       */
      if (page > total || this.map.size > this.MAX_COUNT) break
      if (this.map.has(page)) {
        page += 1
        continue
      }

      src = this.model.getImageUri(page)
      xhr.open('GET', src, true)
      xhr.responseType = 'blob'

      try {
        let data = yield fetch()
        this.map.set(page, data.target.response)
      } catch (e) {
        // preload failed, retry
        page -= 1
      }
      page += 1
    }

    return page
  }

  loadOnRequest() {
    let map = this.map
      , page = this.model.getCurrentPage()

    if (this.hasLoaded(page)) {
      return Promise.resolve()
    } else {
      return new Promise((resolve, reject) => {
        let xhr = this.xhr
          , page = this.model.getCurrentPage()

        xhr.open("GET", this.model.getCurrentImageUri(), true)
        xhr.responseType = 'blob'
        xhr.onreadystatechange = handler
        xhr.send()

        function handler() {
          if (this.readyState === 4/* Done */) {
            map.set(page, this.response)
            resolve()
          } else if(this.status !== 200) {
            reject(new Error(this.statusText))
          }
        }

      })
    }
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

  stopLoading() {
    this.xhr.abort()
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
