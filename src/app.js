import { Model } from 'backbone'
import CanvasModel from 'models/canvas'
import BookModel from 'models/book'
import ProgressIndicator from 'models/progressIndicator'
import Loader from 'models/loader'

class AppModel extends Model {

  constructor(options) {
    super(options)
    this.modelAndCreateFuncMap = {
        book: 'createBookModel'
      , canvas: 'createCanvasModel'
      , progressIndicator: 'createProgressIndicatorModel'
      , loader: 'createLoaderModel'
    }
  }

  getModel(name) {
    if (!this.get(name)) {
      throw Error(`Model ${name} hasn't been defined`)
    }
    return this.get(name)
  }

  setModel(name, model) {
    if (this.get(name)) {
      throw Error(`Model ${name} has been defined`)
    }
    this.set(name, model)
    return this
  }

  createModel(name, ...other) {
    var func = this.modelAndCreateFuncMap[name]
    if (!func || !this[func]) { return }
    return this[func]()
  }

  createCanvasModel() {
    var canvasModel = new CanvasModel()
    this.setModel('canvas', canvasModel)
    return canvasModel
  }

  createBookModel() {
    this.setModel('book', new BookModel({
      canvas: this.getModel('canvas') }))
    return this.getModel('book')
  }

  createProgressIndicatorModel() {
    let progressIndicator = new ProgressIndicator()
    this.setModel('progressIndicator', progressIndicator)
    return progressIndicator
  }

  createLoaderModel() {
    let loaderModel = new Loader()
    this.setModel('loader', loaderModel)
    return loaderModel
  }
}

export default new AppModel
