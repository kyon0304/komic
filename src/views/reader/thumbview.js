import React from 'react'
import { Link } from 'react-router'

import app from 'app'
import routes from 'routes'
import Panel from './panel'

export default class extends React.Component {

  render() {
    var book = app.getModel('book')
      , thumbnails = book.getThumbnails()
      , thumbview = []
      , currentPage = this.props.params.page

    function fillItem(thumb) {
      var page = thumb.page
        , size = thumb.size
        , useTag = `<use xlink:href=${thumb.src}>`
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
      <ul className="list">
        { thumbnails.map(fillItem) }
      </ul>
    )

    return (
      <div className="backdrop">
        { thumbview }
      </div>
    )
  }
}
