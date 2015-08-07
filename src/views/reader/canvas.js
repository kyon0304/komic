import React from 'react'
import { Navigation } from 'react-router'
import _ from 'mod/utils'

import app from 'app'
import routes from 'routes'

export default class extends React.Component {

  componentWillMount() {
    var canvas = app.getModel('canvas')
    canvas.on('turn:nextPage', this.transitionToPage)
    localStorage.clear()
  }

  componentWillUnmount() {
    var canvas = app.getModel('canvas')
    canvas.off('turn:nextPage', this.transitionToPage)
    localStorage.clear()
  }

  handleClick() {
    var canvas = app.getModel('canvas')
    canvas.trigger('turn:nextPage')
  }

  transitionToPage() {
    var router = app.get('router')
      , canvas = app.getModel('canvas')
    router.transitionTo('page', { page: canvas.get('currentPage') })
  }

  getNextPage() {
    var canvas = app.getModel('canvas')
      , nextPage = canvas.get('currentPage') + 1
      , totalPage = canvas.get('totalPage')
    return nextPage > totalPage ? -1 : nextPage
  }

  preload() {
    var nextPage = getNextPage()
    if(nextPage === -1)
      return

    var book = app.getModel('book')
      , xhr = new XMLHttpRequest()
      , imgSrc

    imgSrc = book.getCurrentImage(nextPage).src
    xhr.open('GET', imgSrc, true)
    xhr.responseType = 'blob'
    xhr.onload = function(e) {
      if (this.status === 200) {
        localStorage.setItem('preload', window.URL.createObjectURL(this.response))
      }
    }
    xhr.onerror = function(e) {
      console.log(`Error ${e.target.status} occured while receiving.`)
    }
    xhr.send()
  }

  render() {
    var book = app.getModel('book')
      , currentPage = app.getModel('canvas').get('currentPage')
      , img = book.getCurrentImage(currentPage)

    if(localStorage.getItem('preload')) {
      img.src = localStorage.getItem('preload')
      localStorage.clear()
    }

    return (
      <div className="canvas">
        <img { ...img }
          onLoad={ this.preload }
          onClick={ this.handleClick } />
      </div>
    )
  }
}
