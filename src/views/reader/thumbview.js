import React from 'react'
import { Link } from 'react-router'

import app from 'app'
import routes from 'routes'
import Panel from './panel'

export default class extends React.Component {

  closeThumbview() {
    app.trigger('toggle:thumbview', false)
  }

  scrollDistance (el) {
    var rect = el.getBoundingClientRect()
      , rectCenter = (rect.top + rect.bottom) / 2
      , vertCenter = (window.innerHeight || document.documentElement.clientHeight) / 2

    return (rectCenter - vertCenter)
  }

  componentDidMount() {
    var current = document.getElementsByClassName('current')[0]
      , distance = this.scrollDistance(current)

    // delay to revert default update scroll
    setTimeout(function () {
       window.scrollBy(0, distance)
    }, 0)
  }

  renderItem(thumb) {
    var canvas = app.getModel('canvas')
      , currentPage = canvas.get('currentPage')
      , page = thumb.page
      , size = thumb.size
      , useTag = `<use xlink:href=${thumb.src}>`
      , klass = (+page === +currentPage) ? "item current" : "item"

    return (
      <li className={ klass }>
        <Link to="page" params={{ page: page }}
          onClick={ this.closeThumbview }
          className="thumb" { ...size }>
          <svg className="thumb" { ...size }
            dangerouslySetInnerHTML={{__html: useTag}}>
          </svg>
        </Link>
      </li>
    )
  }

  render() {
    var book = app.getModel('book')
      , thumbnails = book.getThumbnails()
      , thumbview = []

    thumbview.push(
      <ul className="list">
        { thumbnails.map(this.renderItem.bind(this)) }
      </ul>
    )

    return (
      <div className="thumbview">
        { thumbview }
      </div>
    )
  }
}
