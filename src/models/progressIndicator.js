import { Model } from 'backbone'

export default class extends Model {
  defaults() {
    return {
      viewedPercent: 0
    , loadedPercent: 0
    }
  }

  setPercent(page, total, type = 'viewed') {
    if (page < 0) page = 0
    if (page > total) page = total
    let percent = page * 100 / total
    this.set( type + 'Percent', percent)
  }
}
