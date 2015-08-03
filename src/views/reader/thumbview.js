import React from 'react'
import { Link } from 'react-router'

import app from 'app'
import routes from 'routes'
import Panel from './panel'

export default class extends React.Component {
  render() {
    var book = app.getModel('book')
      , thumbInfo// = book.getthumbInfo()
      , thumbView = []

    thumbInfo = [
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

    function fillItem(thumbItem) {
      var page = thumbItem.page
        , info = thumbItem.info

      return (
        <li className="item">
          <Link to="page" className="thumb" style= { info } params={{ page: page}} >
          </Link>
        </li>
      )
    }

    thumbView.push(
      thumbInfo.map(function(thumbList) {
        return (
          <ul className="list">
            { thumbList.map(fillItem) }
          </ul>
        )
      })
    )

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
