export default {
  download(data, filename) {
    // XXX this is browser only, maybe extract?
    let link = document.createElement('a')
    link.download = filename
    link.href = `data:,${encodeURIComponent(data)}`
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  add(src, dst) {
    for (let key in src) {
      dst[key] || (dst[key] = 0)
      dst[key] += src[key]
    }
  },
  pad(len, c, s) {
    s = '' + s
    let prefix = c.repeat(len - s.length)
    return prefix + s
  },
  seq(index, end) {
    let arr = []
    while (index >= end)
      arr.push(index--)
    return arr
  },
  flat(arr) {
    return [].concat.apply([], arr)
  },
  group(arr, attr) {
    let groups = {}
    for (let item of arr) {
      let key = item[attr]
      groups[key] || (groups[key] = [])
      groups[key].push(item)
    }
    return groups
  },
  sort(arr, ...attrs) {
    arr.sort((a,b) => {
      for (let attr of attrs) {
        if (typeof attr === 'function') {
          let order = attr(a, b)
          if (order !== 0)
            return order
        } else {
          if (a[attr] > b[attr])
            return 1
          if (a[attr] < b[attr])
            return -1
        }
      }
      return 0
    })
  },
  values(obj) {
    let vals = []
    for (let key in obj)
      vals.push(obj[key])
    return vals
  },
  uid() {
    return Math.random().toString(36).slice(2)
  }
}
