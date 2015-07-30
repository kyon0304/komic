import React from 'react'
import { Link } from 'react-router'

export default class extends React.Component {
  render() {
    return (
      <div className="aside">
        <ul className="panel">
          <li>
            <a href="#" title="页码" className="btn"></a>
          </li>
          <li>
            <Link to="home" href="#" title="返回" className="btn">返</Link>
          </li>
        </ul>
      </div>
    )
  }
}
