import React from 'react'
import { Link } from 'react-router'
import $ from 'jquery'

import app from 'app'
import routes from 'routes'
import Panel from './panel'

export default class extends React.Component {

  closeThumbview() {
    app.trigger('toggle:thumbview', false)
  }

  scrollToCurrentThumb() {
    var current = $(React.findDOMNode(this.refs.current))
      , el = React.findDOMNode(this)
      , DISTANCE_TO_TOP = 60

    $(el).scrollTop(current.offset().top - DISTANCE_TO_TOP)
  }

  componentDidMount() {
    this.scrollToCurrentThumb()
  }

  renderItem(thumb, index) {
    var canvas = app.getModel('canvas')
      , currentPage = canvas.get('currentPage')
      , page = thumb.page
      , size = thumb.size
      , useTag = `<use xlink:href=${thumb.src}>`
      , isCurrent = +page === +currentPage
      , klass = isCurrent ? "item current" : "item"

    return (
      <li className={ klass } key={ index }>
        <Link to="page" params={{ page: page }}
          onClick={ this.closeThumbview }
          ref={ isCurrent ? 'current' : null }
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

    return (
      <div className="thumbview">
        <ul className="list">
          { thumbnails.map(this.renderItem.bind(this)) }
        </ul>
      </div>
    )
  }
}
