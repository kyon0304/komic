import BookModel from './model/book'
import AppView from './views/app'
import React from 'react'
import $ from 'jquery'
import 'normalize.css'
import './styles/index.styl'

var bookModel = new BookModel()
  , appViewWrapper = $('<div>', {'class': 'react-app-wrapper'})

$('body').prepend(appViewWrapper)

bookModel.fetch({ url: '/content.json' })
  .done(() => {
    React.render(<AppView model={bookModel} />, appViewWrapper[0])
  })
