import React from 'react'
import { Navigation } from 'react-router'
import $ from 'jquery'
import Backbone from 'backbone'

import app from 'app'
import routes from 'routes'

import _ from 'mod/utils'
import ImageManager from './image_manager'
import VerticalAlignMiddle from 'widgets/vertical_align_middle'

const win = $(window)

class CanvasImage extends React.Component {
  constructor(options) {
    super(options)
    this.guid = _.uniqueId()
    this.imageManger = this.props.manager
  }

  componentWillMount() {
    win.on(`resize.${this.guid}`
      , ::this.imageManger.onResize)
  }

  componentWillUnmount() {
    win.off(`.${this.guid}`)
  }

  rendered() {
    this.imageManger
      .setImage(React.findDOMNode(this))
      .setMaxWidth(win.width() - 20)
      .moveToCanvasTopCenter()
  }

  componentDidMount() {
    this.rendered()
  }

  componentDidUpdate() {
    this.rendered()
  }

  handleClick() {
    var canvas = app.getModel('canvas')
    canvas.trigger('turn:nextPage')
  }

  render() {
    var book = app.getModel('book')
      , currentPage = app.getModel('canvas').get('currentPage')

    return (
      <img { ...book.getCurrentImage(currentPage) } ref="image"
        onClick={ ::this.handleClick }
        />
    )
  }
}

var ImageLoader = (() => {
  return new class {
    constructor() {
      this.cache = {}
    }

    hasLoaded(key) {
      return !!(key in this.cache)
    }

    load(src) {
      return new Promise((resolve, reject) => {
        var image = new Image()
        image.src = src
        image.onload = resolve
        image.error = reject
      })
    }
  }
})()

var Model = Backbone.Model.extend({
  getCurrentImageUri: () => {
    var book = app.getModel('book')
      , currentPage = app.getModel('canvas').get('currentPage')

    return book.getCurrentImageUri(currentPage)
  }
})

export default class extends React.Component {

  constructor(options) {
    super(options)
    this.imageManger = new ImageManager()
    this.guid = _.uniqueId()
    this.state = { loading: true }
    this.model = new Model()
  }

  componentWillReceiveProps() {
    this.state = {
      loading: !ImageLoader.hasLoaded(this.model.getCurrentImageUri())
    }
  }

  componentWillMount() {
    var canvas = app.getModel('canvas')
    canvas.on('turn:nextPage', ::this.transitionToPage)
    win.on(`resize.${this.guid}`
      , ::this.imageManger.onResize)
  }

  componentWillUnmount() {
    var canvas = app.getModel('canvas')
    canvas.off('turn:nextPage', ::this.transitionToPage)
    win.off(`.${this.guid}`)
  }

  transitionToPage() {
    var router = app.get('router')
      , canvas = app.getModel('canvas')
    router.transitionTo('page', { page: canvas.get('currentPage') })
  }

  scrollHandler(e) {
    this.imageManger[e.altKey ? 'onScaleScroll' : 'onMoveScroll'](e)
  }

  render() {

    var { loading } = this.state

    if (!loading) {
      return this.renderWithImage()
    } else {
      ImageLoader.load(this.model.getCurrentImageUri())
        .then(() => {
          this.setState({ loading: false })
        })
      return this.renderWithLoading()
    }

    return view
  }

  renderWithImage() {
    return (
      <div className="canvas" onWheel={ ::this.scrollHandler }>
        <CanvasImage manager={ this.imageManger } />
      </div>
    )
  }

  renderWithLoading() {
    return (
      <div className="canvas">
        <VerticalAlignMiddle style={
          { width: '100%', height: '100%', textAlign: 'center' }
          }>
          载入中
        </VerticalAlignMiddle>
      </div>
    )
  }

}
