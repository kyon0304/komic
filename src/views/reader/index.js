import React from 'react'
import { Link } from 'react-router'

export default class extends React.Component {
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
        <Link to="home">返回</Link>
        <br/>
        <h1> #TODO 这是漫画阅读器 </h1>
        <div>
          { viewer }
        </div>
      </div>
    )
  }
}
