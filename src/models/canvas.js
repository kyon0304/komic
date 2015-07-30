import { Model } from 'backbone'

export default class extends Model {

  constructor(options) {
    super(options)
    if (options.pageTotal && options.pageTotal > 0) {
      this.set('currentPage', 1)
    }
  }

  defaults () {
    return {
      pageTotal: 0
    , currentPage: 0
    }
  }

}
