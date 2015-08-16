import React from 'react'
import app from 'app'
import $ from 'jquery'
import Backbone from 'backbone'

import _ from 'mod/utils'

const win = $(window)

class Model extends Backbone.Model {
  @_.Memoize()
  getImageScale() {
    var book = app.getModel('book')
      , imageDiagonal = book.getNaturalAverageDiagonal()
      , canvasDiagonal = _.rectangleDiagonal(win.width(), win.height())

    if (canvasDiagonal > imageDiagonal) { return 1 }

    return (canvasDiagonal / imageDiagonal).toFixed(2)
  }
}

export default class extends React.Component {
  constructor(options) {
    super(options)
    this.guid = _.uniqueId()
    this.model = new Model()
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
      .setScale(this.model.getImageScale())
      .moveToCanvasTopCenter()
  }

  componentDidMount() {
    this.rendered()
  }

  componentDidUpdate() {
    this.rendered()
  }

  handleClick(e) {
    if (this.dragIsTriggered) { return }
    var canvas = app.getModel('canvas')

    if (canvas.turnpageMethodIs('CLICK_IAMGE_REGION')) {
      var point = { pointX: e.pageX, pointY: e.pageY }
      if (this.imageManger.isPointInLeftImage(point)) {
        this.turnPrevPage()
      } else if (this.imageManger.isPointInRightImage(point)) {
        this.turnNextPage()
      }
    }

    if (canvas.turnpageMethodIs('CLICK')) {
      this.turnNextPage()
    }

    if (canvas.turnpageMethodIs('CLICK_WITH_SCROLL')) {
      if (this.imageManger.isInBottom()) {
        this.turnNextPage()
      } else {
        this.imageManger.moveToBottom()
      }
    }
  }

  turnPrevPage() {
    var canvas = app.getModel('canvas')
    canvas.trigger('turn:prevPage')
  }

  turnNextPage() {
    var canvas = app.getModel('canvas')
    canvas.trigger('turn:nextPage')
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
    if (canvas.turnpageMethodIs('CLICK')
      && e.button === 2 && mouseDown) {
      this.turnPrevPage()
    }
    if (e.button === 2 && mouseDown && canvas.turnpageMethodIs('CLICK_WITH_SCROLL')) {
      if (this.imageManger.isInTop()) {
        this.turnPrevPage()
      } else {
        this.imageManger.moveToTop()
      }
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

    this.imageManger.move(deltaX, deltaY)
    this.prevPageX = e.pageX
    this.prevPageY = e.pageY
  }

  render() {
    var book = app.getModel('book')
      , currentPage = app.getModel('canvas').get('currentPage')

    return (
      <img { ...book.getCurrentImage(currentPage) }
        ref="image"
        draggable="false"
        onClick={ ::this.handleClick }
        onMouseDown={ ::this.handleMouseDown }
        onMouseUp={ ::this.handleMouseUp }
        onMouseMove={ ::this.handleMouseMove}
        onContextMenu={ (e) => { e.preventDefault() } }
        />
    )
  }
}
