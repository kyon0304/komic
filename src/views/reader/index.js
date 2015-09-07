import React from 'react'
import { Link } from 'react-router'
import _ from 'mods/utils'

import Panel from './panel'
import Canvas from './canvas/index'
import Thumbview from './thumbview'
import ModalView from './modals/index'
import TipView from './tip'
import app from 'app'
import ProgressIndicator from './progressIndicator'

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.state = { thumbview: false }
  }

  componentWillReceiveProps(nextProps) {
    this.setCurrentPage(nextProps)
  }

  setCurrentPage(props) {
    var book = app.getModel('book')
      , indicator = app.getModel('progressIndicator')
      , loader = app.getModel('loader')
      , page = props.params && +props.params.page
      , splitedIndex = +props.query.splitedIndex || 0
      , total = book.getBookTotalPage()
      , cachedUrls = []
    book.setCurrentPage({ page: page, splitedIndex: splitedIndex })
    indicator.setPercent(page, total)
    loader.getAllCachedImageUrls(cachedUrls).then(() => {
      //XXX(kyon) unsorted order bug
      indicator.setPercent(cachedUrls.length, total, 'loaded')
      this.refs.progressIndicator.setState({ loaded: indicator.get('loadedPercent')})
    })
  }

  componentWillMount() {
    let indicator = app.getModel('progressIndicator')
    this.setCurrentPage(this.props)
    app.on('toggle:thumbview', this.toggleThumbview, this)
    indicator.on('change:loadedPercent', this.updateLoadedProgress, this)
  }

  updateLoadedProgress() {
    let indicator = app.getModel('progressIndicator')
    this.refs.progressIndicator.setState({loaded: indicator.get('loadedPercent')})
  }

  componentWillUnmount() {
    let indicator = app.getModel('progressIndicator')
    app.off('toggle:thumbview', this.toggleThumbview, this)
    indicator.off('change:loadedPercent', this.updateLoadedProgress, this)
  }

  toggleThumbview(showOrHide) {
    showOrHide = _.isUndefined(showOrHide)
      ? !this.state.thumbview
      : showOrHide
    this.setState({ thumbview: showOrHide })
  }

  render() {

    let indicator = app.getModel('progressIndicator')
    return (
      <div>
        <ProgressIndicator ref='progressIndicator'
          viewed = { indicator.get('viewedPercent') }
          loaded = { indicator.get('loadedPercent') }
        />
        <Panel ref="panel"/>
          <Canvas ref="canvas" />
          { this.state.thumbview && <Thumbview ref="thumbview" /> }
        <ModalView />
        <TipView />
      </div>
    )
  }
}
