module.exports = {
  generate: (size) => {
    currentPosition = { x:0, y:0 }
    map = createArray(size, size);
    cols = size;
    rows = size;

    let stack = [];

    while (true) {
      var neighbours = getNeighbours(currentPosition.x, currentPosition.y, 1), l;
      if( neighbours.length < 1 ) {
        if( stack.length < 1 ) {
          currentPosition.x = currentPosition.y = -1;
          return map;
        }
        currentPosition = stack.pop();
      } else {
        var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
        l = neighbours[i]; 
        map[l.x][l.y] = 0;
        l = neighbours[i + 1]; 
        map[l.x][l.y] = 0;
        currentPosition = l
        stack.push(currentPosition)
      }
    }
  }
}

let currentPosition;
let map;
let cols;
let rows;

function createArray(cols, rows) {
  let map = new Array(cols);
  for(var i = 0; i < cols; i++) {
    map[i] = new Array(rows);
      for(var j = 0; j < rows; j++) {
        map[i][j] = 1;
      }
  }
  return map;
}

getNeighbours = ( sx, sy, a ) => {
  var n = [];
  if( sx - 1 > 0 && map[sx - 1][sy] == a && sx - 2 > 0 && map[sx - 2][sy] == a ) {
      n.push( { x:sx - 1, y:sy } ); n.push( { x:sx - 2, y:sy } );
  }
  if( sx + 1 < cols - 1 && map[sx + 1][sy] == a && sx + 2 < cols - 1 && map[sx + 2][sy] == a ) {
      n.push( { x:sx + 1, y:sy } ); n.push( { x:sx + 2, y:sy } );
  }
  if( sy - 1 > 0 && map[sx][sy - 1] == a && sy - 2 > 0 && map[sx][sy - 2] == a ) {
      n.push( { x:sx, y:sy - 1 } ); n.push( { x:sx, y:sy - 2 } );
  }
  if( sy + 1 < rows - 1 && map[sx][sy + 1] == a && sy + 2 < rows - 1 && map[sx][sy + 2] == a ) {
      n.push( { x:sx, y:sy + 1 } ); n.push( { x:sx, y:sy + 2 } );
  }
  return n;
}

