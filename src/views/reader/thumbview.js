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

  arrangeThumbnails(viewWidth, minMargin) {
    var thumbnails = generateThumbs()
      , currentWidth = 0
      , width
    return (
      thumbnails.map(function (thumb){
        width = thumb.size.width + minMargin
        if (currentWidth + width > viewWidth) {
          currentWidth = 0
          return []
        }
        currentWidth += width
        return thumb
      })
    )
  }

  fillThumbview(thumb) {
    if(thumb === []) {
      return (
        </ul>
        <ul className="list">
      )
    }
    var page = thumb.page
      , size = thumb.size
      , useTag = "<use xlink:href=" + thumb.src +">"
      , currentPage = this.props.params.page
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

  render() {
    var thumbInfo = this.arrangeThumbnails(960, 5)
      , thumbView = []

    thumbview.push(<ul className="list">)
    thumbview.push(thumbInfo.map(fillThumbview))
    thumbview.push(</ul>)

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
