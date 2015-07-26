import React from 'react'
import BookIntroView from './book_intro'

export default class extends React.Component {
  render() {
    return (
      <div className="main">
        <BookIntroView model={this.props.model}/>
      </div>
    )
  }
}
