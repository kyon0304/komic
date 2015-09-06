import { Model } from 'backbone'


export default class extends Model {

  constructor(options) {
    super(options)
    this.on('change', this.saveToLocalStorage)
  }

  saveToLocalStorage() {
    localStorage.setItem('model/canvas'
      , JSON.stringify(this.toJSON()))
  }

  getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('model/canvas'))
  }

  defaults() {
    return (
      this.getFromLocalStorage() || {
        turnpageMethod: 'CLICK'
      , scalingMethod: 'AUTO'
      , mousePositionDragImage: false
      , autoSplit: false
      })
  }

}
