import app from 'app'

var Model = Backbone.Model.extend({
  getCurrentImageUri: () => {
    var book = app.getModel('book')
      , currentPage = app.getModel('canvas').get('currentPage')

    return book.getCurrentImageUri(currentPage)
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
      , page = this.model.getCurrentPage()
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
      //TODO override old data in cache
      if (page > total || this.map.size > this.MAX_COUNT) break

      src = this.model.getImageUri(page)
      xhr.open('GET', src, true)

      try {
        let data = yield fetch()
        this.map.set(page, data.target.response)
        console.log('cached data', this.map)
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

  loadImage(state) {
    let gen = this.preload()
    var { loading } = state

    function next(resp) {
      let result = gen.next(resp)

      if (result.done) return result.value

      result.value.then((data) => {

        if (loading) {
          state = { loading: false }
        }

        console.log('state in preloader: ', state)
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
    console.log('cached data', this.map)
    return this.map.get(page)
  }

  hasLoaded(page) {
    return !!(page in this.map)
  }
}
