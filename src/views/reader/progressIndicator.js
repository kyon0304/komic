import React from 'react'
import app from 'app'
export default class extends React.Component {

  constructor(options) {
    super(options)
    this.state = {
      viewed: this.props.viewed || 0
    , loaded: this.props.loaded || 0
    }
  }

  componentWillReceiveProps(nextProps) {
    let indicator = app.getModel('progressIndicator')
    this.state = {loaded: indicator.get('loadedPercent'), viewed: indicator.get('viewedPercent')}
  }

  render() {
    return (
      <div>
        <div className='progress-indicator' id='viewed' style={{ width: `${this.state.viewed}%` }}/>
        <div className='progress-indicator' id='loaded' style={{ width: `${this.state.loaded}%` }}/>
      </div>
    )
  }
}
