module.exports = {
  at(arr, index) {
    let {length} = arr;
    index = (index % length + length) % length;
    return arr[index];
  },
};
