import React from 'react'
import Router from 'react-router'

var { RouteHandler } = Router

export default class extends React.Component {
  render() {
    return (
      <div className="main">
        <RouteHandler model={this.props.model}/>
      </div>
    )
  }
}
