import React from 'react'
import { Link } from 'react-router'

import app from 'app'

export default class extends React.Component {
  render() {
    var canvasModel = app.getModel('canvas')
      , currentPage = canvasModel.get('currentPage')
    return (
      <div className="aside">
        <ul className="panel">
          <li>
            <a href="#" title="页码" className="btn">{ currentPage }</a>
          </li>
          <li>
            <Link to="thumbview" title="目录" className="btn" params={{ page: currentPage }}>总</Link>
          </li>
          <li>
            <Link to="home" href="#" title="返回" className="btn">返</Link>
          </li>
        </ul>
      </div>
    )
  }
}
