import React from 'react'
import { Link } from 'react-router'

import app from 'app'
import routes from 'routes'
import Panel from './panel'

export default class extends React.Component {

  generateThumbs() {
    var book = app.getModel('book')
      , info = book.getThumbviewInfo()
      , totalPage = info.totalPage
      , totalSrc = info.src
      , thumbnails = []
      , idx

    for (idx = 0; idx < totalPage; idx++) {
      thumbnails.push({
        src: totalSrc + "#" + idx
      , page: (idx + 1) + ''
      , size: book.getThumbnailSize(idx+1)
      })
    }

    return thumbnails
  }

  arrangeThumbnails(viewWidth, minMargin) {
    var thumbnails = this.generateThumbs()
      , currentWidth = 0
      , width
      , list = []
      , arrangedThumbs = []

    for (let thumb of thumbnails) {
      width = thumb.size.width + minMargin
      if (currentWidth + width > viewWidth) {
        arrangedThumbs.push(list)
        list = []
        currentWidth = 0
      }
      list.push(thumb)
      currentWidth += width
    }
    arrangedThumbs.push(list)

    return arrangedThumbs
  }

  render() {
    var thumbInfo = this.arrangeThumbnails(960, 5)
      , thumbview = []
      , currentPage = this.props.params.page

    function fillItem(thumb) {
      var page = thumb.page
        , size = thumb.size
        , useTag = "<use xlink:href=" + thumb.src +">"
        , klass = (+page === +currentPage) ? "item current" : "item"
      return (
        <li className={ klass }>
          <Link to="page" params={{ page: page}} className="thumb" { ...size }>
            <svg className="thumb" { ...size }
              dangerouslySetInnerHTML={{__html: useTag}}>
            </svg>
          </Link>
        </li>
      )
    }

    thumbview.push(
      thumbInfo.map(function (thumbList) {
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
          { thumbview }
        </div>
      </div>
    )
  }
}
