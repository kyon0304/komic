import React from 'react'
import { Navigation } from 'react-router'
import $ from 'jquery'
import Backbone from 'backbone'

import app from 'app'
import routes from 'routes'

import request from 'mods/request'
import VerticalAlignMiddle from 'widgets/vertical_align_middle'
import ImageManager from './image_manager'
import CanvasImage from './image'
import loader from 'manager/loader'

const LoadingStates = {
  LOADED: Symbol()
, READY: Symbol()
, LOADING: Symbol()
}

export default class extends React.Component {

  constructor(options) {
    super(options)
    this.imageManger = new ImageManager()
    this.state = { loadingState: LoadingStates.READY, percent: 0 }
    this.renderStrategy = {
        [ LoadingStates.LOADING ]: this.renderWithLoading
      , [ LoadingStates.LOADED ]: this.renderWithImage
      , [ LoadingStates.READY ]: this.renderAndLoadImage
    }
  }

  componentWillReceiveProps() {
    var { READY, LOADED } = LoadingStates
      , self = this

    this.state = { loadingState: READY, percent: 0 }
  }

  componentWillMount() {
    var book = app.getModel('book')
    book
      .on('turn:page', ::this.showTurnPageTip)
      .on('turn:page', ::this.transitionToPage)
  }

  componentWillUnmount() {
    var book = app.getModel('book')
    book
      .off('turn:page', ::this.showTurnPageTip)
      .off('turn:page', ::this.transitionToPage)
  }

  showTurnPageTip({ direction }) {
    var book = app.getModel('book')

    app.trigger('close:tip')

    if (book.currentIsFirstPage() && direction === 'prevPage') {
      app.trigger('open:tip', { text: '目前已经是第一页' })
    } else if (book.currentIsLastPage() && direction === 'nextPage') {
      app.trigger('open:tip', { text: '目前已经是最后一页' })
    }
  }

  transitionToPage({ direction }) {
    var router = app.get('router')
      , book = app.getModel('book')
      , canvas = app.getModel('canvas')

    book.turnPage({ direction })
    router.transitionTo(
      'page'
    , { page: book.get('currentPage') }
    , canvas.get('autoSplit') && { splitedIndex: book.get('splitedIndex') }
    )
  }

  scrollHandler(e) {
    this.imageManger[e.altKey ? 'onScaleScroll' : 'onMoveScroll'](e)
  }

  render() {

    var { loadingState } = this.state
      , renderMethod = this.renderStrategy[loadingState]

    return this::renderMethod()
  }

  mousePositionDragImage(e) {
    if (!this.prevClientX) {
      this.prevClientX = e.clientX
      this.prevClientY = e.clientY
      return
    }

    this.imageManger.moveOnMouseMove({
      prevClientX: this.prevClientX
    , prevClientY: this.prevClientY
    , currentClientX: e.clientX
    , currentClientY: e.clientY
    })

    this.prevClientX = e.clientX
    this.prevClientY = e.clientY
  }

  mouseMoveHandle(e) {
    var canvas = app.getModel('canvas')
    if (!canvas.get('mousePositionDragImage')) { return }
    this.mousePositionDragImage(e)
  }

  renderWithImage() {
    return (
      <div className="canvas"
        onWheel={ ::this.scrollHandler }
        onMouseMove= { ::this.mouseMoveHandle }
        >
        <CanvasImage manager={ this.imageManger }
          src={ this.state.imageSrc } />
      </div>
    )
  }

  cropImageWhenAutoSplit(imageBlob) {
    return new Promise((resolve, reject) => {
      var book = app.getModel('book')
        , canvas = app.getModel('canvas')
        , image = book.getCurrentImage()
        , { naturalWidth, naturalHeight} = image
        , { width, height, positionX } = image

      if (!canvas.get('autoSplit') || !image.splited) {
        return resolve(window.URL.createObjectURL(imageBlob))
      }

      var croppingCanvas = document.createElement("canvas")
      croppingCanvas.width = width
      croppingCanvas.height = height
      var image = new Image()
      image.src = window.URL.createObjectURL(imageBlob)
      image.onerror = reject
      image.onload = function() {
        croppingCanvas.getContext('2d')
          .drawImage(image, -positionX, 0, naturalWidth, naturalHeight)
        resolve(croppingCanvas.toDataURL())
      }
    })
  }

  renderAndLoadImage() {
    loader.loadCurrentImage({
      requestEvents: {
        [request.Events.PROGRESS]: (e)=> {
          this.setState({
            loadingState: LoadingStates.LOADING
          , percent: Math.round(e.loaded / e.total * 100)
          })
        }
      }})
      .then(this.cropImageWhenAutoSplit)
      .then((blobUriOrDataUri) => {
        this.setState({
          loadingState: LoadingStates.LOADED
        , imageSrc: blobUriOrDataUri
        })
      })
    return this.renderWithLoading()
  }

  renderWithLoading() {
    return (
      <div className="canvas">
        <VerticalAlignMiddle style={
          { width: '100%', height: '100%', textAlign: 'center' }
          }>
          载入中, { this.state.percent }%
        </VerticalAlignMiddle>
      </div>
    )
  }

}
