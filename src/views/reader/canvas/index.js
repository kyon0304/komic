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

    this.state = { loadingState: READY }
    loader.hasLoaded().then(() => {
      self.state = { loadingState: LOADED}
    }, () =>{
      self.state = { loadingState: READY }
    })
  }

  componentWillMount() {
    var canvas = app.getModel('canvas')
    canvas
      .on('turn:page', ::this.showTurnPageTip)
      .on('turn:page', ::this.transitionToPage)
  }

  componentWillUnmount() {
    var canvas = app.getModel('canvas')
    canvas
      .off('turn:page', ::this.showTurnPageTip)
      .off('turn:page', ::this.transitionToPage)
  }

  showTurnPageTip({ direction }) {
    var canvas = app.getModel('canvas')

    app.trigger('close:tip')

    if (canvas.currentIsFirstPage() && direction === 'prevPage') {
      app.trigger('open:tip', { text: '目前已经是第一页' })
    } else if (canvas.currentIsLastPage() && direction === 'nextPage') {
      app.trigger('open:tip', { text: '目前已经是最后一页' })
    }
  }

  transitionToPage({ direction }) {
    var router = app.get('router')
      , canvas = app.getModel('canvas')

    canvas.turnPage({ direction })
    router.transitionTo('page', { page: canvas.get('currentPage') })
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
        <CanvasImage manager={ this.imageManger } />
      </div>
    )
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
      .then(() => {
        this.setState({ loadingState: LoadingStates.LOADED })
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
