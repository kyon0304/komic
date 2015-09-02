import React from 'react'
import { Link } from 'react-router'
import _ from 'mods/utils'

import Panel from './panel'
import Canvas from './canvas/index'
import Thumbview from './thumbview'
import ModalView from './modals/index'
import TipView from './tip'
import app from 'app'

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
      , page = props.params && +props.params.page
      , splitedIndex = +props.query.splitedIndex || 0
    book.setCurrentPage({ page: page, splitedIndex: splitedIndex })
  }

  componentWillMount() {
    this.setCurrentPage(this.props)
    app.on('toggle:thumbview', this.toggleThumbview, this)
  }

  componentWillUnmount() {
    app.off('toggle:thumbview', this.toggleThumbview, this)
  }

  toggleThumbview(showOrHide) {
    showOrHide = _.isUndefined(showOrHide)
      ? !this.state.thumbview
      : showOrHide
    this.setState({ thumbview: showOrHide })
  }

  render() {

    return (
      <div>
        <Panel ref="panel"/>
          <Canvas ref="canvas" />
          { this.state.thumbview && <Thumbview ref="thumbview" /> }
        <ModalView />
        <TipView />
      </div>
    )
  }
}
