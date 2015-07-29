import React from 'react'
import { Route, DefaultRoute } from 'react-router'

import AppView from './views/app'
import BookIntroView from './views/book_intro'

export default (
   <Route path="/" handler={ AppView }>
     <DefaultRoute handler={ BookIntroView }/>
   </Route>
)
