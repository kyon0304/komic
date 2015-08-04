import React from 'react'
import { Link } from 'react-router'

import app from 'app'
import routes from 'routes'
import Panel from './panel'

export default class extends React.Component {
  render() {
    var book = app.getModel('book')
      , thumbInfo = book.getThumbViewInfo(960, 5)
      , thumbView = []
      , currentPage = this.props.params.cp

    function fillItem(thumbItem) {
      var page = thumbItem.page
        , size = thumbItem.size
        , useTag = "<use xlink:href=" + thumbItem.src + ">"
        , cn = (+page == +currentPage) ? "item current" : "item"

      return (
        <li className={ cn }>
          <Link to="page" className="thumb" style= { size } params={{ page: page}} >
            <svg className="thumb" style={ size }
              dangerouslySetInnerHTML={{__html: useTag}}>
            </svg>
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
