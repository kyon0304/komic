import React from 'react'
import app from 'app'

import _ from 'mod/utils'
import VerticalAlignMiddle from 'widgets/vertical_align_middle'
import ReactTransitionEvents from 'react/lib/ReactTransitionEvents'

class FadeInOut extends React.Component {
  componentDidMount() {
    var node = React.findDOMNode(this)
    ReactTransitionEvents
      .addEndEventListener(node, this.props.onAnimationEnd)
  }

  componentWillUnmount() {
    var node = React.findDOMNode(this)
    ReactTransitionEvents
      .removeEndEventListener(node, this.props.onAnimationEnd)
  }

  render() {
    var childrenToRender = []
      , fadeInOut = {
          animation: `fadeInOut ${this.props.duration}ms`
        , opacity: 0
        }

    return (
      <div key={ _.uniqueId() } style={ fadeInOut }>
        { this.props.children }
      </div>
    )
  }
}

export default class extends React.Component {

  constructor(options) {
    super(options)
    this.state = {
      display: false
    , text: ''
    , duration: 2000
    }
  }

  componentWillMount() {
    app
      .on('open:tip', this.openTip, this)
      .on('close:tip', this.closeTip, this)
  }

  componentWillUnmount() {
    app
      .off('open:tip', this.openTip, this)
      .off('close:tip', this.closeTip, this)
  }

  openTip({ text }) {
    this.setState({ display: true, text: text })
  }

  renderNoop() {
    return (<div style={{ display: 'none' }}></div>)
  }

  closeTip() {
    this.setState({ display: false })
  }

  renderTip() {

    return (
      <VerticalAlignMiddle style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none'}}>
        <FadeInOut
          key={ Math.random() }
          duration={ this.state.duration }
          onAnimationEnd={ ::this.closeTip }>
          <div className="tip">
            { this.state.text }
          </div>
        </FadeInOut>
      </VerticalAlignMiddle>
    )
  }

  render() {
    if (this.state.display && this.state.text) { return this.renderTip() }
    return this.renderNoop()
  }
}
