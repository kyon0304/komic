import React from 'react'
import { Navigation } from 'react-router'
import _ from 'mod/utils'

import app from 'app'
import routes from 'routes'

export default class extends React.Component {
  constructor(options) {
    super(options)
    this.xhr = new XMLHttpRequest()
    this.canvas = app.getModel('canvas')
    this.book = app.getModel('book')
  }

  componentWillMount() {
    this.canvas.on('turn:nextPage', this.transitionToPage.bind(this))
    localStorage.clear()
  }

  componentWillUnmount() {
    this.canvas.off('turn:nextPage', this.transitionToPage.bind(this))
    localStorage.clear()
  }

  handleClick() {
    this.canvas.trigger('turn:nextPage')
    if(this.xhr.readyState !== 4){
      this.xhr.abort()
    }
  }

  transitionToPage() {
    var router = app.get('router')
    router.transitionTo('page', { page: this.canvas.get('currentPage') })
  }

  preload() {
    var nextPage = this.canvas.getNextPage()
    if(nextPage === -1)
      return

    var imgSrc = this.book.getCurrentImage(nextPage).src

    this.xhr.open('GET', imgSrc, true)
    this.xhr.responseType = 'blob'
    this.xhr.onload = function(e) {
      if (this.status === 200) {
        localStorage.setItem('preload', window.URL.createObjectURL(this.response))
      }
    }
    this.xhr.onerror = function(e) {
      console.log(`Error ${e.target.status} occured while receiving.`)
    }
    this.xhr.send()
  }

  render() {
    var currentPage = this.canvas.get('currentPage')
      , img = this.book.getCurrentImage(currentPage)

    if(localStorage.getItem('preload')) {
      img.src = localStorage.getItem('preload')
      localStorage.clear()
    }

    return (
      <div className="canvas">
        <img { ...img }
          onLoad={ this.preload.bind(this) }
          onClick={ this.handleClick.bind(this) } />
      </div>
    )
  }
}
