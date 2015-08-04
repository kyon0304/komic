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

, getCurrentImage(page) {
    return this.get('images')[page - 1]
  }

, getThumbViewInfo(viewWidth, margin) {
    var currentWidth = 0
      , thumbWidth
      , idx = 0
      , list = []
      , thumbHeight = this.get('thumbnails').height
      , originSrc = this.get('thumbnails').path
      , thumbnail
      , thumbnails = []

    for (let img of this.get('images')) {
      thumbWidth = Math.ceil(img.width / img.height * thumbHeight)
      thumbnail = {
        src: originSrc + "#" + idx
      , page: idx + 1
      , size: {
          width: thumbWidth
          , height: thumbHeight
        }
      }

      if (currentWidth + margin + thumbWidth > viewWidth) {
        thumbnails.push(list)
        list = []
        currentWidth = 0
      }
      list.push(thumbnail)
      currentWidth += (thumbWidth + margin)

      idx += 1
    }

    thumbnails.push(list)
    return thumbnails
  }
})
