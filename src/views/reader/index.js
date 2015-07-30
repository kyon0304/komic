import React from 'react'
import { Link } from 'react-router'

import Panel from './panel'
import Canvas from './canvas'
import app from 'app'

export default class extends React.Component {

  componentWillMount() {
    var canvas = app.getModel('canvas')
    canvas.setCurrentPage(+this.props.params.page)
  }

  render() {
    var num = 0
      , next = num + 1
      , model = this.props.model
      , pages = model.getBookPages()
      , viewer

    if (this.props.params.page != undefined) {
      num = this.props.params.page
      next = Number.parseInt(num) + 1
    }

    if(next < pages) {
      viewer = (
          <Link to="reader" params={{page: next.toString()}}>
            <img src= { model.getBookImg(num) } />
          </Link>
      )
    } else
      viewer = (<span>看完了</span>)

    return (
      <div>
        <Panel />
        <Canvas />
      </div>
    )
  }
}
