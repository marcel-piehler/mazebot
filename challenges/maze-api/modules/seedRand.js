module.exports = (seed = 0) => {
  this.next = (min, max) => {
    seed = parseInt(Math.abs(Math.sin(seed)).toString().slice(-10));

    if (min != undefined && max == undefined) {
      let rand = (seed % min);
      return rand;
    } else if (min != undefined && max != undefined) {
      let range = max - min;
      let rand = (seed % range) + parseInt(min);
      return rand;
    } else {
      return Math.abs(Math.sin(seed));
    }
  }

  return this;
}