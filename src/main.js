import 'normalize.css'
import './styles/index.styl'

import $ from 'jquery'
import React from 'react'
import Router from 'react-router'
import app from 'app'

import BookModel from 'models/book'
import routes from 'routes'

$(document).on('click', 'a[href="#"]', (e) => {
  e.preventDefault()
})

var bookModel = new BookModel()
  , appViewWrapper = $('<div>', {'class': 'react-app-wrapper'})

app.setModel('book', bookModel)

$('body').prepend(appViewWrapper)

bookModel.fetch({ url: '/content.json' })
  .done(() => {
    app.createModel('canvas')
    Router.run(routes, Router.HashLocation, (Root) => {
      React.render(<Root model={ bookModel } />, appViewWrapper[0])
    })
  })
