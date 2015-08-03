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
          "page": 1
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "0 0"
          , "width": 240
          , "height": 240
          }
        }
      , {
          "page": 2
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "-240px  0"
          , "width": 240
          , "height": 240
          }
        }
      , {
          "page": 3
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "-480px 0"
          , "width": 240
          , "height": 240
          }
        }
      , {
          "page": 4
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "-720px 0"
          , "width": 240
          , "height": 240
          }
        }
      ]
    , [
        {
          "page": 5
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "0 -240px"
          , "width": 240
          , "height": 240
          }
        }
      , {
          "page": 6
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "-240px -240px"
          , "width": 240
          , "height": 240
          }
        }
      , {
          "page": 7
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "-480px -240px"
          , "width": 240
          , "height": 240
          }
        }
      , {
          "page": 8
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "-720px -240px"
          , "width": 240
          , "height": 240
          }
        }
      ]
    , [
        {
          "page": 9
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "0 -480px"
          , "width": 240
          , "height": 240
          }
        }
      , {
          "page": 10
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "-240px -480px"
          , "width": 240
          , "height": 240
          }
        }
      , {
          "page": 11 
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "-480px -480px"
          , "width": 240
          , "height": 240
          }
        }
      , {
          "page": 12 
        , "info": {
            "backgroundImage": 'url("http://placeimg.com/960/720/any")'
          , "backgroundPosition": "-720px -480px"
          , "width": 240
          , "height": 240
          }
        }
      ]
    ]

    function fillItem(contentItem) {
      var page = contentItem.page
        , info = contentItem.info

      return (
        <li className="item">
          <Link to="page" className="content" style= { info } params={{ page: page}} >
          </Link>
        </li>
      )
    }

    contentView.push(
      contentInfo.map(function(contentRow) {
        return (
          <ul className="row">
            { contentRow.map(fillItem) }
          </ul>
        )
      })
    )

    return (
      <div>
        <Panel />
        <div className="backdrop">
          { contentView }
        </div>
      </div>
    )
  }
}
