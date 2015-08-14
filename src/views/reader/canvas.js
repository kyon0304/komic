import React from 'react'
import { Navigation } from 'react-router'
import Preloader from 'manager/preloader'

import app from 'app'
import routes from 'routes'

export default class extends React.Component {
  constructor(options) {
    super(options)
    this.canvas = app.getModel('canvas')
    this.book = app.getModel('book')
    this.preloader = new Preloader()
  }

  componentWillMount() {
    this.canvas.on('turn:nextPage', this.transitionToPage.bind(this))
  }

  componentWillUnmount() {
    this.canvas.off('turn:nextPage', this.transitionToPage.bind(this))
  }

  handleClick() {
    this.canvas.trigger('turn:nextPage')
    this.preloader.stopLoading()
  }

  transitionToPage() {
    var router = app.get('router')
    router.transitionTo('page', { page: this.canvas.get('currentPage') })
  }

  render() {
    var currentPage = this.canvas.get('currentPage')
      , img = this.book.getCurrentImage(currentPage)
      , cached = this.preloader.pickImage(currentPage)

    if (cached) {
      img.src = window.URL.createObjectURL(cached)
    }

    return (
      <div className="canvas">
        <img { ...img }
          onLoad={ this.preloader.loadImage() }
          onClick={ this.handleClick.bind(this) } />
      </div>
    )
  }
}
