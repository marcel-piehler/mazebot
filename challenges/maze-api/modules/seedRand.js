module.exports = (seed) => {
  this.next = (min, max) => {
    if (seed != undefined) {
      return Math.floor( Math.abs( Math.sin(seed++) * (max - min + 1) ) ) + min;
    } else {
      return Math.floor(  Math.random() * (max - min + 1) ) + min;
    }
  }
  return this;
}