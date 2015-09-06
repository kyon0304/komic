import React from 'react'
import { Link } from 'react-router'
import $ from 'jquery'

import app from 'app'
import _ from 'mods/utils'
import routes from 'routes'
import Panel from './panel'

class ThumbViewLink extends React.Component {
  pageItemClicked(e) {
    e.preventDefault()
    app.trigger('toggle:thumbview', false)
    var router = app.get('router')
    router.transitionTo(this.props.to, this.props.params, this.props.query)
  }

  render() {
    return (
      <Link {...this.props}
        onClick={ ::this.pageItemClicked }
        >
        { this.props.children }
      </Link>
    )
  }
}

export default class extends React.Component {

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
      , book = app.getModel('book')
      , currentPage = book.get('currentPage')
      , page = thumb.page
      , viewBoxSize = thumb.viewBoxSize
      , isCurrent = +page === +currentPage
      , klass = isCurrent ? "item current" : "item"
      , useTag = () => {
          var {width, height} = thumb.useElementSize
          return (
              `<use xlink:href=${thumb.src} width=${width}`
            + ` height=${height} x=${-thumb.positionX} />`
          )
        }

    return (
      <li className={ klass } key={ index }>
        <ThumbViewLink to="page" params={{ page: page }}
          query={ canvas.get('autoSplit') ? _.pick(thumb, 'splitedIndex') : null }
          ref={ isCurrent ? 'current' : null }
          className="thumb" { ...viewBoxSize }>
          <svg className="thumb" { ...viewBoxSize }
            dangerouslySetInnerHTML={{__html: useTag()}}>
          </svg>
        </ThumbViewLink>
      </li>
    )
  }

  render() {
    var book = app.getModel('book')
      , thumbnails = book.getThumbnails()

    return (
      <div className="thumbview">
        <ul className="list">
          { thumbnails.map(::this.renderItem) }
        </ul>
      </div>
    )
  }
}
