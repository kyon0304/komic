import React from 'react'
import { Link } from 'react-router'

import app from 'app'
import routes from 'routes'
import Panel from './panel'

export default class extends React.Component {
  render() {
    var book = app.getModel('book')
      , contentInfo// = book.getContentInfo()
      , contentView = []

    contentInfo = [
      [
        {
          page: "1"
        , info: {
            background: "url(http://placeimg.com/960/720/any) 0 0"
          , width: "240px"
          , height: "240px"
          }
        }
      , {
          page: "2"
          , info: {
            background: "url(http://placeimg.com/960/720/any) -240px 0"
          , width: "240px"
          , height: "240px"
           }
        }
      , {
          page: "3"
          , info: {
            background: "url(http://placeimg.com/960/720/any) -480px 0"
          , width: "240px"
          , height: "240px"
           }
        }
      , {
          page: "4"
          , info: {
            background: "url(http://placeimg.com/960/720/any) -720px 0"
          , width: "240px"
          , height: "240px"
           }
        }
      ]
    , [
        {
          page: "5"
          , info: {
            background: "url(http://placeimg.com/960/720/any) 0 -240px"
          , width: "360px"
          , height: "240px"
           }
        }
      , {
          page: "6"
          , info: {
            background: "url(http://placeimg.com/960/720/any) -360px -240px"
          , width: "120px"
          , height: "240px"
           }
        }
      , {
          page: "7"
          , info: {
            background: "url(http://placeimg.com/960/720/any) -480px -240px"
          , width: "240px"
          , height: "240px"
           }
        }
      , {
          page: "8"
          , info: {
            background: "url(http://placeimg.com/960/720/any) -720px -240px"
          , width: "240px"
          , height: "240px"
           }
        }
      ]
    , [
        {
          page: "9"
          , info: {
            background: "url(http://placeimg.com/960/720/any) 0 -480px"
          , width: "240px"
          , height: "240px"
           }
        }
      , {
          page: "10"
          , info: {
            background: "url(http://placeimg.com/960/720/any) -240px -480px"
          , width: "240px"
          , height: "240px"
           }
        }
      , {
          page: "11"
          , info: {
            background: "url(http://placeimg.com/960/720/any) -480px -480px"
          , width: "240px"
          , height: "240px"
           }
        }
      , {
          page: "12"
          , info: {
            background: "url(http://placeimg.com/960/720/any) -720px -480px"
          , width: "240px"
          , height: "240px"
           }
        }
      ]
    ]

    contentView.push(<div className="backdrop">)
    for (let contentRow of contentInfo) {
      contentView.push( <ul className="row"> )
      for (let contentItem of contentRow) {
        contentView.push(
          <li className="item">
            <Link to="page" params={{page: contentItem.page}}>
              <div className="content" { ...contentItem.info }/>
            </Link>
          </li>
        )
      }
      contentView.push(</ul>)
    }
    contentView.push(</div>)

    return (
      <div>
        <Panel />
        { contentView }
      </div>
    )
  }
}
