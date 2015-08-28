import React from 'react'

export default class extends React.Component {

  constructor(options) {
    super(options)
    this.state = {
      viewed: 0
    , loaded: 0
    }
  }

  setViewedProgress(percent) {
    this.state.viewed = percent
  }

  setLoadedProgress(percent) {
    this.state.loaded = percent
  }

  render() {
    <div className='progressIndicator'>
      <div className='viewed' style={{ width: ${this.state.viewed} }}>
      <div className='loaded' style={{ width: ${this.state.loaded} }}>
    </div>
  }
}
