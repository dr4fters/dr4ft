module.exports = {
  ascii(s) {
    return s.replace(/[Æâàáéíöúû’]/g, c => {
      switch (c) {
      case 'Æ': return 'AE'
      case 'â': case 'à': case 'á': return 'a'
      case 'é': return 'e'
      case 'í': return 'i'
      case 'ö': return 'o'
      case 'ú': case 'û': return 'u'
      case '’': return "'"
      }
    })
  },
  at(arr, index) {
    var {length} = arr
    index = (index % length + length) % length//please kill me it hurts to live
    return arr[index]
  },
  count(arr, attr) {
    var count = {}
    for (var item of arr) {
      var key = item[attr]
      count[key] || (count[key] = 0)
      count[key]++
    }
    return count
  },
  choose(n, arr) {
    // arr.slice(0) copies the entire array
    if (n === 0)
      return []

    // http://en.wikipedia.org/wiki/Fisher–Yates_shuffle
    var i = arr.length
    var end = i - n
    while (i > end) {
      var j = this.rand(i--)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(-n)
  },
  shuffle(arr) {
    return this.choose(arr.length, arr)
  },
  id() {
    return Math.random().toString(36).slice(2)
  },
  rand(n) {
    return Math.floor(Math.random() * n)
  }
}
