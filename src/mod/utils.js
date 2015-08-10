import _ from 'underscore'

_.mixin({
/**
 * Returns a number whose value is limited to the given range
 *   See more: http://jsperf.com/math-clamp
 *
 * Example: `var x = _.clamp([0, 22])`
 */

  clamp: (value, range) => {
    var [min, max] = range.sort()
    return Math.min(max, Math.max(min, value))
  }
})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

;['debounce'].forEach(function(methodName) {
  var willBeMixin = {}

  willBeMixin[capitalizeFirstLetter(methodName)] = function(...args) {
    return function decorator(target, key, descriptor) {
      descriptor.value = _[methodName](descriptor.value, ...args)
      return descriptor
    }
  }

 _.mixin(willBeMixin)
})

export default _
