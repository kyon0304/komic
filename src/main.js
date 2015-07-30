import 'normalize.css'
import './styles/index.styl'

import $ from 'jquery'
import React from 'react'
import Router from 'react-router'

import BookModel from 'model/book'
import routes from 'routes'

var bookModel = new BookModel()
  , appViewWrapper = $('<div>', {'class': 'react-app-wrapper'})

$('body').prepend(appViewWrapper)

bookModel.fetch({ url: '/content.json' })
  .done(() => {
    Router.run(routes, Router.HashLocation, (Root) => {
      React.render(<Root model={bookModel} />, appViewWrapper[0])
    })
  })
