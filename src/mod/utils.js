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

, rectangleDiagonal: (rectangleWidth, rectangleHeight) => {
    return Math.sqrt(Math.pow(rectangleWidth, 2)
      + Math.pow(rectangleHeight, 2))
  }
})

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

;['debounce', 'memoize'].forEach(function(methodName) {
  _.mixin({
    [capitalizeFirstLetter(methodName)]: (...args) => {
      return function decorator(target, key, descriptor) {
        return {
          ...descriptor
        , value: _[methodName](descriptor.value, ...args)
        }
      }
    }
  })
})

export default _
