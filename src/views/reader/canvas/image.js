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
