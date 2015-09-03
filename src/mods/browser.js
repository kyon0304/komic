var browser = {
  // Copy form http://bit.ly/1hml8L9
  getVendorPropertyName: (prop) => {
    var el = document.createElement('div')
    if (prop in el.style) {
      return prop
    }

    var prefixes = ['Moz', 'Webkit', 'O', 'ms']
    var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1)

    for (var i = 0; i < prefixes.length; ++i) {
      var vendorProp = prefixes[i] + prop_
      if (vendorProp in el.style) {
        return vendorProp
      }
    }
  }
}

;(function asyncTestWebp() {
  // 1 pixel webp.
  var uri = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
    , image = new Image()

  image.onload = image.onerror = (e) => {
    var result = e && e.type === 'load' ? image.width === 1 : false
    browser.webp = result
  }

  image.src = uri
}())

export default browser
