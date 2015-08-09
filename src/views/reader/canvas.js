import React from 'react'
import { Navigation } from 'react-router'
import $ from 'jquery'

import app from 'app'
import routes from 'routes'
import ImageManager  from './image_manager'

export default class extends React.Component {

  constructor(options) {
    super(options)
    this.imageManger = new ImageManager()
  }

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

  componentDidMount() {
    this.imageManger
      .setImage(React.findDOMNode(this.refs.image))
      .moveToCanvasCenter()
  }

  scrollHandler(e) {
    this.imageManger[e.altKey ? 'onScaleScroll' : 'onMoveScroll'](e)
  }

  render() {

    var book = app.getModel('book')
      , currentPage = app.getModel('canvas').get('currentPage')

    return (
      <div className="canvas" onWheel={ this.scrollHandler.bind(this) }>
        <img { ...book.getCurrentImage(currentPage) } ref="image"
          onClick={this.handleClick}
          />
      </div>
    )
  }
}
