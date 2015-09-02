import React from 'react'
import app from 'app'
import $ from 'jquery'
import Backbone from 'backbone'

import _ from 'mods/utils'
import loader from 'manager/loader'

const win = $(window)
    , MOUSE_RIGHT_BUTTON = 2
    , SCROLL_DURATION = 230

var GetImageScaleFunctions = {
  @_.Memoize()
  AUTO() {
    var book = app.getModel('book')
      , imageDiagonal = book.getNaturalAverageDiagonal()
      , canvasDiagonal = _.rectangleDiagonal(win.width(), win.height())

    if (canvasDiagonal > imageDiagonal) { return 1 }

    return canvasDiagonal / imageDiagonal
  }

, HORIZONTAL_SCALING({ naturalWidth, naturalHeight }) {
    return win.width() / naturalWidth
  }

, SCALE_TO_WINDOW({ naturalWidth, naturalHeight }) {
    var xScale = Math.min(win.width() / naturalWidth, 1)
      , yScale = Math.min(win.height() / naturalHeight, 1)

    return Math.min(xScale, yScale)
  }
}

class Model extends Backbone.Model {
  defaults() {
    return { manager: undefined }
  }

  getImageScale() {
    var canvas = app.getModel('canvas')
      , manager = this.get('manager')
      , func = this::GetImageScaleFunctions[canvas.get('scalingMethod')]

    return (func ? func(manager.getImageSize()).toFixed(2) : 1)
  }
}

var MouseLeftClickHandlers = {
  CLICK_IAMGE_REGION(e) {
    var point = { pointX: e.pageX, pointY: e.pageY }
    if (this.manager.isPointInLeftImage(point)) {
      this.turnPrevPage()
    } else if (this.manager.isPointInRightImage(point)) {
      this.turnNextPage()
    }
  }
, CLICK() {
    this.turnNextPage()
  }
, CLICK_TO_SCROLL() {
    if (this.manager.isInBottom()) {
      this.turnNextPage()
    } else {
      this.manager.moveToBottom({ duration: SCROLL_DURATION })
    }
  }
}

var MouseRightClickHandlers = {
  CLICK_IAMGE_REGION() {}
, CLICK() {
    this.turnPrevPage()
  }
, CLICK_TO_SCROLL() {
    if (this.manager.isInTop()) {
      this.turnPrevPage()
    } else {
      this.manager.moveToTop({ duration: SCROLL_DURATION })
    }
  }
}

var ContextMenuHandlers = {
  CLICK_IAMGE_REGION() {}
, CLICK(e) { e.preventDefault() }
, CLICK_TO_SCROLL(e) { e.preventDefault() }
}

export default class extends React.Component {
  constructor(options) {
    super(options)
    this.guid = _.uniqueId()
    this.manager = this.props.manager
    this.model = new Model({ manager: this.manager })
    this.state = { display: true }
  }

  componentWillMount() {
    var canvas = app.getModel('canvas')
    canvas.on('change:scalingMethod', this.scalingMethodChanged, this)
    win.on(`resize.${this.guid}`
      , ::this.manager.onResize)
  }

  componentWillUnmount() {
    var canvas = app.getModel('canvas')
    canvas.off('change:scalingMethod', this.scalingMethodChanged, this)
    win.off(`.${this.guid}`)
  }

  rendered() {
    this.manager
      .setImage(React.findDOMNode(this))
      .setScale(this.model.getImageScale())
      .moveToCanvasTopCenter()
  }

  componentDidMount() {
    this.rendered()
  }

  componentDidUpdate() {
    this.rendered()
  }

  scalingMethodChanged() {
    var manager = this.manager
    manager.scaleTo(this.model.getImageScale())
  }

  handleClick(e) {
    if (this.dragIsTriggered) { return }
    var canvas = app.getModel('canvas')
    this::MouseLeftClickHandlers[canvas.get('turnpageMethod')](e)
  }

  turnPage(direction) {
    var book = app.getModel('book')

    book.trigger('turn:page', { direction })
  }

  turnPrevPage() {
    this.turnPage('prevPage')
  }

  turnNextPage() {
    this.turnPage('nextPage')
  }

  handleMouseDown(e) {
    this.dragIsTriggered = !!this.mouseDown
    this.mouseDown = true
    this.prevPageX = this.originPageX = e.pageX
    this.prevPageY = this.originPageY = e.pageY
  }

  handleMouseUp(e) {
    var mouseDown = this.mouseDown
      , canvas = app.getModel('canvas')

    this.mouseDown = false

    if (e.button === MOUSE_RIGHT_BUTTON && mouseDown) {
      this::MouseRightClickHandlers[canvas.get('turnpageMethod')](e)
    }
  }

  handleMouseMove(e) {
    if (!this.mouseDown) { return }

    if (!this.dragIsTriggered) {
      var distance = Math.sqrt(Math.pow(this.originPageX - e.pageX, 2)
            + Math.pow(this.originPageY - e.pageY, 2))
        , CLICK_REGION_RADIUS = 15

      if (distance < CLICK_REGION_RADIUS) { return }
      this.dragIsTriggered = true
    }

    var deltaX = e.pageX - this.prevPageX
      , deltaY = e.pageY - this.prevPageY

    this.manager.move(deltaX, deltaY)
    this.prevPageX = e.pageX
    this.prevPageY = e.pageY
  }

  handleContextMenu(e) {
    if (e.altKey) { return }
    var canvas = app.getModel('canvas')
    this::ContextMenuHandlers[canvas.get('turnpageMethod')](e)
  }

  render() {
    var book = app.getModel('book')
      , canvas = app.getModel('canvas')
      , currentPage = app.getModel('canvas').get('currentPage')
      , { width, height } = book.getCurrentImage()

    return (
      <img
        src={ this.props.src }
        width={ width }
        height={ height }
        key={ _.uniqueId() }
        style={{ display: this.state.display ? 'block' : 'none' }}
        ref="image"
        draggable="false"
        onClick={ ::this.handleClick }
        onMouseDown={ ::this.handleMouseDown }
        onMouseUp={ ::this.handleMouseUp }
        onMouseMove={ ::this.handleMouseMove}
        onLoad={ ::loader.preloadImages}
        onContextMenu={ this.handleContextMenu }
        />
    )
  }
}
