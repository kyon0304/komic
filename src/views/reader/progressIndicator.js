import React from 'react'
import app from 'app'
export default class extends React.Component {

  constructor(options) {
    super(options)
    this.state = {
      viewed: this.props.viewed || 0
    }
  }

  componentWillReceiveProps(nextProps) {
    let book = app.getModel('book')
    this.state = { viewed: book.get('progress') }
  }

  render() {
    return (
      <div>
        <div className='progress-indicator viewed' style={{ width: `${this.state.viewed}%` }}/>
      </div>
    )
  }
}
