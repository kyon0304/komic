import React from 'react'
import { Link } from 'react-router'

import app from 'app'
import routes from 'routes'
import Panel from './panel'

export default class extends React.Component {
  render() {
    var book = app.getModel('book')
      , thumbInfo = book.getThumbViewInfo(1000, 5)
      , thumbView = []

    function fillItem(thumbItem) {
      var page = thumbItem.page
        , info = thumbItem.info

      return (
        <li className="item">
          <Link to="page" className="thumb" style= { info } params={{ page: page}} >
          </Link>
        </li>
      )
    }

    thumbView.push(
      thumbInfo.map(function(thumbList) {
        return (
          <ul className="list">
            { thumbList.map(fillItem) }
          </ul>
        )
      })
    )

    return (
      <div>
        <Panel />
        <div className="backdrop">
          { thumbView }
        </div>
      </div>
    )
  }
}
