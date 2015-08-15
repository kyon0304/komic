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

export default class {
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

    xhr.responseType = 'blob'
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

      src = this.model.getImageUri(page)
      xhr.open('GET', src, true)

      try {
        let data = yield fetch()
        this.map.set(page, data.target.response)
        console.log('generator data', this.map)
      } catch (e) {
        // preload failed, retry
        console.log('catch error', e)
        page -= 1
      }
      console.log('page', page)
      page += 1
      console.log('page', page)
    }

    return page
  }

  loadOnRequest() {
    return new Promise((resolve, reject) => {
      let xhr = this.xhr
        , map = this.map
        , page = this.model.getCurrentPage()

      xhr.open("GET", this.model.getCurrentImageUri(), true)
      xhr.responseType = 'blob'
      xhr.onreadystatechange = handler
      xhr.send()

      function handler() {
        if (this.readyState === 4/* Done */) {
          console.log('resolve:', this.response)
          map.set(page, this.response)
          resolve()
        } else if(this.status !== 200) {
          reject(new Error(this.statusText))
        }
      }

    })
  }

  loadInAdvance() {
    let gen = this.preload()

    function next(resp) {
      let result = gen.next(resp)

      if (result.done) return result.value

      result.value.then((data) => {
        next(data)
      })
    }

    next()
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
    console.log('pick image', page)
    console.log('pick image', this.map)
    let img = this.model.getImage(page)
      , cached = this.map.get(page)

    if (cached) {
      img.src = window.URL.createObjectURL(cached)
    }
    return img
  }

  hasLoaded() {
    let page = this.model.getCurrentPage()
    return !!(page in this.map)
  }
}
