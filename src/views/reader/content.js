import React from 'react'
import { Link } from 'react-router'

import app from 'app'
import routes from 'routes'
import Pannel from './pannel'

export default class extends React.Component {
  render() {
    var book = app.getModel('book')
      , contentInfo = book.getContentInfo()
      , contentView

    contentView = (
      for (let contentRow of contentInfo) {
        <ul class="content row">
        for (let contentItem of contentRow) {
          <li class="content item">
            <Link to="page" params={{page: contentItem.page}}>
              <img { ...contentItem.info }/>
            </Link>
          </li>
        }
        </ul>
      }
    )

    return (
      <Pannel />
      <div class="backdrop">
        { contentView }
      </div>
    )
  }
}
