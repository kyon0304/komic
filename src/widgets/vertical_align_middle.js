import React from 'react'

var wrapperStyle = { display: 'table' }
  , cellStyle = { display: 'table-cell', 'vertical-align': 'middle' }

export default class extends React.Component {
  render() {
    return (
      <div style={ wrapperStyle }>
        <div style={ cellStyle }>
          { this.props.children }
        </div>
      </div>
    )
  }
}
