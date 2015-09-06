import { Model } from 'backbone'
import _ from 'mods/utils'
import browser from 'mods/browser'

const FIRST_PAGE_INDEX = 0
class Content extends Model {

  @_.Memoize()
  getImageType() {
    var data = this.get('images')[FIRST_PAGE_INDEX]
      , src = data.web && data.web.src
      , type = src['default']

    if (browser.webp && src.webp) {
      type = 'webp'
    }

    return type
  }

  wrapImage(image, index) {
    var web = image.web
      , {width, height} = _.pick(web, 'width', 'height')

    return {
        index: index
      , src: web.src[this.getImageType()]
      , splited: false
      , width: width
      , height: height
      , naturalWidth: width
      , naturalHeight: height
    }
  }

  @_.Memoize()
  unsplitedImages() {
    var images = this.get('images')
    return images.map(::this.wrapImage)
  }

  @_.Memoize()
  splitedImages() {
    var images = this.get('images')

    if (_.findIndex(images, (image) => { return image.width > image.height }) === -1) {
      return this.unsplitedImages()
    }

    var maxWidthImage = _.max(images, (image) => { return image.width })
      , beSplitedBreakpoint = maxWidthImage.width * 0.75
      , splitedImages = []

    images.forEach((image, index) => {
      image = this.wrapImage(image, index)
      if (image.width > beSplitedBreakpoint) {
        var halfWidth = image.width / 2
          , halfWidthImage = {
              ...image
            , index: index
            , splited: true
            , width: halfWidth
            }

        return splitedImages.push(...[
          { ...halfWidthImage, positionX: 0, splitedIndex: 0 }
        , { ...halfWidthImage, positionX: halfWidth, splitedIndex: 1 }
        ])
      }

      splitedImages.push({ ...image, splited: false, index: index })
    })

    return splitedImages
  }
}

export default class extends Model {
  initialize({ canvas }) {
    this.canvas = canvas
    this.content = new Content()
  }

  fetchContent(...args) {
    return this.content.fetch(...args).done(this::() => {
      this.set({ totalPage: this.getBookTotalPage() })
    })
  }

  defaults() {
    return {
      totalPage: 0
    , currentPage: 0
    , splitedIndex: 0
    }
  }

  setCurrentPage({ page, splitedIndex }) {
    var currentPage = +page
      , totalPage = this.get('totalPage')

    if (currentPage > totalPage) {
      currentPage = totalPage
    }

    if (currentPage < 1) {
      currentPage = 1
    }

    this.set('currentPage', currentPage)
    this.set('splitedIndex', splitedIndex)
    return this
  }

  turnPage({ direction }) {
    var images = this.getImages()
      , currentImage = this.getCurrentImage()
      , currentIndex = _.findIndex(images, (image) => {
          return (image.index === currentImage.index
            && (!currentImage.splited
            || image.splitedIndex === currentImage.splitedIndex))
        })
      , silbingImageIndex = currentIndex + (direction === 'prevPage' ? -1 : 1)
      , silbingImage = images[_.clamp(silbingImageIndex, [0, images.length - 1])]

    this.setCurrentPage({
        page: silbingImage.index + 1
      , splitedIndex: silbingImage.splitedIndex
      })
  }

  currentIsLastPage() {
    var currentImage = this.getCurrentImage()
    return (this.get('currentPage') === this.get('totalPage')
      && (!currentImage.splited || currentImage.splitedIndex === 1))
  }

  currentIsFirstPage() {
    var currentImage = this.getCurrentImage()
    return (this.get('currentPage') === 1
      && (!currentImage.splited || currentImage.splitedIndex === 0))
  }

  getImage({ page, splitedIndex = 0 }) {
    var images = this.getImages()
      , index = page - 1

    return _.find(images, (image) => {
      return (image.index === index
        && ( !image.splited
        || image.splitedIndex === splitedIndex )
      )
    })
  }

  getImageUri(...args) {
    var image = this.getImage(...args)
    return image.src
  }

  getImages() {
    var content = this.content
    return (this.canvas.get('autoSplit')
      ? content.splitedImages()
      : content.unsplitedImages()
      )
  }

  getBookCoverSize() {
    var cover = this.getImage({ index: FIRST_PAGE_INDEX })
    return {
      width: Math.ceil(cover.width / cover.height * 220)
    , height: 220
    }
  }

  getBookTotalPage() {
    return _.last(this.getImages()).index + 1
  }

  getBookCoverImg() {
    return {
      ...this.getImage({ index: FIRST_PAGE_INDEX })
    , ...this.getBookCoverSize()
    }
  }

  getCurrentImageUri() {
    var image = this.getCurrentImage()
    return image && image.src
  }

  getNaturalAverageDiagonal() {
    var images = this.getImages()
      , number = images.length
      , sum = _.reduce(images, (memo, image) => {
          var diagonal = _.rectangleDiagonal(image.width, image.height)
          return memo + diagonal
        }, 0)

    return sum / number
  }

  getCurrentImage() {
    var current = this.get('currentPage')
      , splitedIndex = this.get('splitedIndex')
    return this.getImage({ page: current, splitedIndex: splitedIndex })
  }

  getThumbnails() {
    var rootSrc = this.content.get('thumbnails').path
      , thumbHeight = this.content.get('thumbnails').height

    return (
      this.getImages().map(function (image, index) {
        var ratio = thumbHeight / image.height
          , width = Math.ceil(image.naturalWidth * ratio)
          , height = thumbHeight
          , viewBoxWidth = Math.ceil(image.width * ratio)
          , viewBoxHeight = height
          , positionX = image.positionX ? Math.ceil(image.positionX * ratio) : 0

        return {
          src: `${rootSrc}#${image.index}`
        , page: `${image.index + 1}`
        , splitedIndex: image.splitedIndex
        , positionX: positionX
        , viewBoxSize: {
            width: viewBoxWidth
          , height: viewBoxHeight
          }
        , useElementSize: {
            width: width
          , height: height
          }
        }
      })
    )
  }

  getTitle() {
    return this.content.get('name')
  }

  getUUID() {
    return this.content.get('content_json_uuid')
  }
}
