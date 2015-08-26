function request(opts) {
  let xhr = opts.xhr || new XMLHttpRequest()
    , url = opts.url

  return new Promise((resolve, reject) => {
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject(xhr.status)
      }
    })
    xhr.addEventListener('error', reject)
    xhr.addEventListener('abort', reject)

    xhr.send()
  })
}

export default request
