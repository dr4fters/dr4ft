module.exports = {
  ascii(s) {
    return s.replace(/[Æâàáéíöúû’]/g, c => {
      switch (c) {
      case "â": case "à": case "á": return "a";
      case "é": return "e";
      case "í": return "i";
      case "ö": return "o";
      case "ú": case "û": return "u";
      case "’": return "'";
      }
    });
  },
  at(arr, index) {
    var {length} = arr;
    index = (index % length + length) % length;//please kill me it hurts to live
    return arr[index];
  },
  count(arr, attr) {
    var count = {};
    for (var item of arr) {
      var key = item[attr];
      count[key] || (count[key] = 0);
      count[key]++;
    }
    return count;
  },
  choose(n, arr) {
    switch(true) {
    // if we want no elements, we return an empty array
    case n === 0: return [];
    // if we want more elements than the array length
    // we return a copy plus random elements from the array
    case n > arr.length: {
      const copy = arr.slice(0);
      for(n; n > arr.length; n--) {
        copy.push(arr[this.rand(arr.length)]);
      }
      return copy;
    }
    default: {
      // http://en.wikipedia.org/wiki/Fisher–Yates_shuffle
      var i = arr.length;
      var end = i - n;
      while (i > end) {
        var j = this.rand(i--)
      ;[arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(-n);
    }
    }
  },
  shuffle(arr) {
    return this.choose(arr.length, arr);
  },
  id() {
    return Math.random().toString(36).slice(2);
  },
  rand(n) {
    return Math.floor(Math.random() * n);
  }
};
