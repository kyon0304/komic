import React from 'react'
import { Route, DefaultRoute } from 'react-router'

import AppView from './views/app'
import BookIntroView from './views/book_intro'
import ReaderView from './views/reader'

export default (
   <Route path="/" handler={ AppView }>
     <DefaultRoute name="home" handler={ BookIntroView }/>
     <Route name="reader" path="/reader/:page" handler={ ReaderView } />
   </Route>
)
