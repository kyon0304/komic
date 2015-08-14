import app from 'app'

export default class {
  constructor (options) {
    this.xhr = new XMLHttpRequest()
    this.book = app.getModel('book')
    this.canvas = app.getModel('canvas')
    this.map = new Map()
  }

  *preload() {
    const MAX_COUNT = 5
    let page = this.canvas.get('currentPage') + 1
      , total = this.canvas.get('totalPage')
      , xhr = this.xhr

    xhr.responseType = 'blob'
    let fetch = () => {
      return new Promise ((resolve, reject) => {
        xhr.onload = resolve
        xhr.onerror = reject
        xhr.send()
      })
    }

    while (true) {
      if (page > total || this.map.size > MAX_COUNT) break

      let src = this.book.getCurrentImage(page).src
      xhr.open('GET', src, true)

      let resp = yield fetch()
      try {
        this.map.set(page, resp.target.response)
      } catch (e) {
        // preload failed, retry
        page -= 1
      }
      page += 1
    }
  }

  loadImage() {
    let gen = this.preload()
      , resp

    function next(data) {
      let result = gen.next(data)
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
    return this.map.get(page)
  }
}
