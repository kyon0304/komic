import React from 'react'
import app from 'app'
import $ from 'jquery'

import _ from 'mod/utils'

const win = $(window)

export default class extends React.Component {
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
    if (this.dragIsTriggered) { return }
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
    this.mouseDown = false
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
        />
    )
  }
}
