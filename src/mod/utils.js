export default {
  isUndefined: (obj) => {
    return obj === void 0
  }

/**
 * Returns a number whose value is limited to the given range
 *   See more: http://jsperf.com/math-clamp
 *
 * Example: `var x = _.clamp([0, 22])`
 */

, clamp: (value, range) => {
    var [min, max] = range.sort()
    return Math.min(max, Math.max(min, value))
  }
}
