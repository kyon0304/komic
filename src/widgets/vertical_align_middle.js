import React from 'react'

// TODO(yangqing): use `flex-box` instead of `table`

var wrapperStyle = { display: 'table' }
  , cellStyle = { display: 'table-cell', verticalAlign: 'middle' }

export default class extends React.Component {
  render() {
    return (
      <div style={ Object.assign(wrapperStyle, this.props.style) }>
        <div style={ cellStyle }>
          { this.props.children }
        </div>
      </div>
    )
  }
}
