import app from 'app'

export default class {
  constructor (options) {
    super(options)
    this.xhr = new XMLHTTPRequest()
    this.book = app.getModel('book')
    this.canvas = app.getModel('canvas')
    this.map = new Map()
  }

  *preload() {
    const MAX_COUNT = 5
    let page = canvas.get('currentPage') + 1
      , total = canvas.get('totalPage')
      , xhr = this.xhr

    xhr.responseType = 'blob'
    let fetch = () => {
      return new Promise ((resole, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 200) {
            resolve(xhr.response)
          } else {
            reject()
          }
        }
        xhr.send()
      })
    }

    while (true) {
      if (page > total || map.size > MAX_COUNT) break

      let src = this.book.getCurrentImage(page).src
      xhr.open('GET', src, false)

      let resp = yield fetch()
      try {
        this.map.set(page, resp)
      } catch (e) {
        // preload failed, retry
        page -= 1
      }
      page += 1
    }
  }

  loadImage() {
    let gen = preload()
      , resp

    function next(data) {
      result = gen.next(data)
      if (resule.done) return result.value
      result.value.then((data) => {
         next(data)
      })
    }

    next()
  }

  stopLoading() {
    this.xhr.abort()
    let gen = preload()
    gen.throw(new Error('stop loading.'))
  }

  pickImage(page) {
    let img = this.map.get(page)
      , src
    if (img) {
      this.map.delete(page)
      src = window.URL.createObjectURL(img)
    } else {
      src = this.book.getCurrentImage(page).src
    }

    return src
  }
}
