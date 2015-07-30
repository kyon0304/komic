import { Model } from 'backbone'
import CanvasModel from 'models/canvas'

class AppModel extends Model {
  get modelAndCreateFuncMap() {
    return {
      canvas: 'createCanvasModel'
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
      throw Error(`Model ${name} hasn been defined`)
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
    var bookModel = this.getModel('book')
      , canvasModel = new CanvasModel(bookModel.getCanvasModelInfo())
    this.setModel('canvas', canvasModel)
    return canvasModel
  }
}

export default new AppModel
