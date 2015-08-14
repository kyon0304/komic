export default {
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
