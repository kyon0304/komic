import React from 'react'
import { Navigation } from 'react-router'
import $ from 'jquery'
import Backbone from 'backbone'

import app from 'app'
import routes from 'routes'

import VerticalAlignMiddle from 'widgets/vertical_align_middle'
import ImageManager from './image_manager'
import CanvasImage from './image'
import Preloader from 'manager/preloader'

/*
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
        image.onerror = reject
      })
    }
  }
})()
*/

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
})

export default class extends React.Component {

  constructor(options) {
    super(options)
    this.imageManger = new ImageManager()
    this.state = { loading: true }
    this.model = new Model()
    this.preloader = new Preloader()
  }

  componentWillReceiveProps() {
    this.state = {
      //loading: !ImageLoader.hasLoaded(this.model.getCurrentImageUri())
      loading: this.preloader.hasLoaded(this.model.getCurrentPage())
    }
  }

  componentWillMount() {
    var canvas = app.getModel('canvas')
    canvas.on('turn:nextPage', ::this.transitionToPage)
  }

  componentWillUnmount() {
    var canvas = app.getModel('canvas')
    canvas.off('turn:nextPage', ::this.transitionToPage)
  }

  /*
  loadImage() {
    let gen = this.preloader.preload()
      , { loading } = this.state
      , loaded: () => {
         this.state = { loading: false }
      }

    function next(resp) {
      let result = gen.next(resp)

      if (result.done) return result.value

      result.value.then((data) => {

        if (loading) {
          this.loaded()
        }

        console.log('state in preloader: ', state)
        next(data)
      })
    }

    next()
  }
  */

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
    let gen = this.preloader.preload()
      , result

    if (!loading) {
      return this.renderWithImage()
    } else {
      result = gen.next()
      result.value.then((data) => {
        this.setState({ loading: false}) 
        gen.next(data)
      })
      //this.loadImage()
      //this.preloader.loadImage(this.state)
      console.log('state', this.state)
      /*
      ImageLoader.load(this.model.getCurrentImageUri())
        .then(() => {
          this.setState({ loading: false })
        })
      */
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
