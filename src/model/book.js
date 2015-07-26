import { Model } from 'backbone'

export default Model.extend({

  getBookCoverSize() {
    var cover = this.get('images')[0]
    return {
      width: Math.ceil(cover.width / cover.height * 220)
    , height: 220
    }
  }

, getBookCoverImg() {
    var cover = this.get('images')[0]
    return Object.assign({
      src: cover.src
    }, this.getBookCoverSize())
  }
})
