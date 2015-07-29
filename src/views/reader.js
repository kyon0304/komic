import React from 'react'
import { Link } from 'react-router'

export default class extends React.Component {
  render() {
    return (
      <div>
        <Link to="home">返回</Link>
        <br/>
        <h1> #TODO 这是漫画阅读器 </h1>
      </div>
    )
  }
}
