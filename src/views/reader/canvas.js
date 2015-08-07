import React from 'react'
import { Navigation } from 'react-router'
import _ from 'mod/utils'

import app from 'app'
import routes from 'routes'

export default class extends React.Component {

  componentWillMount() {
    var canvas = app.getModel('canvas')
    canvas.on('turn:nextPage', this.transitionToPage)
  }

  componentWillUnmount() {
    var canvas = app.getModel('canvas')
    canvas.off('turn:nextPage', this.transitionToPage)
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

  render() {
    var book = app.getModel('book')
      , canvas = app.getModel('canvas')
      , currentPage = app.getModel('canvas').get('currentPage')
      , img = book.getCurrentImage(currentPage)
      , imgSrc = book.getCurrentImage(currentPage+1).src

    if(!_.isUndefined(this.props.src)) {
      img.src = this.props.src
      this.props.src = void 0
    }

    return (
      <div className="canvas">
        <img { ...img }
          onload={ canvas.trigger('preload', imgSrc, this.props.src) }
          onClick={ this.handleClick } />
      </div>
    )
  }
}
