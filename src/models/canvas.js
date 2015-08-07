import { Model } from 'backbone'
import $ from 'jQeury'

export default class extends Model {

  constructor(options) {
    super(options)
    if (options.totalPage && options.totalPage > 0) {
      this.set('currentPage', 1)
    }
    this.on('turn:nextPage', this.turnNextPage)
    this.on('preload', this.preload)
  }

  defaults() {
    return {
      totalPage: 0
    , currentPage: 0
    }
  }

  setCurrentPage(currentPage) {
    currentPage = +currentPage
    var totalPage = this.get('totalPage')
    if (currentPage > totalPage) {
      currentPage = totalPage
    }

    if (currentPage < 1) {
      currentPage = 1
    }

    this.set('currentPage', currentPage)
    return this
  }

  turnNextPage() {
    var currentPage = this.get('currentPage')
    this.setCurrentPage(currentPage + 1)
  }

  preload(imgSrc, src) {
    console.log('preload')
    var xhr = new XMLHttpRequest()
    xhr.open('GET', imgSrc, true)
    xhr.responseType = 'blob'
    xhr.onload = function(e) {
      if (this.status === 200) {
        src = window.URL.createObjectURL(this.response)
      }
    }
    xhr.onerror = function(e) {
      console.log(`Error ${e.target.status} occured while receiving.`)
    }
    xhr.send()
  }

}
