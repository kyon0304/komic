import { Model } from 'backbone'

export default Model.extend({

  getBookCoverSize() {
    var cover = this.get('images')[0]
    return {
      width: Math.ceil(cover.width / cover.height * 220)
    , height: 220
    }
  }

, getCanvasModelInfo() {
    return {
      totalPage: this.get('images').length
    }
  }

, getBookCoverImg() {
    var cover = this.get('images')[0]
    return Object.assign({
      src: cover.src
    }, this.getBookCoverSize())
  }

, getCurrentImageUri(page) {
    var { src } = this.getCurrentImage(page)
    return src
  }

, getCurrentImage(page) {
    return this.get('images')[page - 1]
  }

, getThumbnails() {
    var imgs = this.get('images')
      , rootSrc = this.get('thumbnails').path
      , thumbHeight = this.get('thumbnails').height
    return (
      this.get('images').map(function (img, idx) {
        return {
          src: `${rootSrc}#${idx}`
        , page: `${idx+1}`
        , size: {
            width: Math.ceil(img.width * thumbHeight / img.height)
          , height: thumbHeight
          }
        }
      })
    )
  }
})
