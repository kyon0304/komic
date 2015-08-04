import React from 'react'
import { Link } from 'react-router'

import app from 'app'
import routes from 'routes'
import Panel from './panel'

export default class extends React.Component {

  generateThumbs() {
    var book = app.getModel('book')
      , info = book.getTumbviewInfo()
      , totalPage = info.totalPage
      , totalSrc = info.src
      , thumbnails = []

    for (idx = 0; idx < totalPage; idx++) {
      thumbnails.push({
        src: totalSrc + "#" + idx
      , page: idx + 1
      , size: book.getThumbnailSize(this.page)
      })
    }

    return thumbnails
  }

  arrangeThumbs(viewWidth, minMargin) {
    var thumbnails = generateThumbs()
    thumbnails.map(function(){

    })
  }

  render() {
    var book = app.getModel('book')
      , thumbInfo = book.getThumbViewInfo(960, 5)
      , thumbView = []
      , currentPage = this.props.params.page

    function fillItem(thumbItem) {
      var page = thumbItem.page
        , size = thumbItem.size
        , useTag = "<use xlink:href=" + thumbItem.src + ">"
        , klass = (+page === +currentPage) ? "item current" : "item"

      return (
        <li className={ klass }>
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
