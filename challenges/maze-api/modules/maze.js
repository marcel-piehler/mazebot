// credits to https://rosettacode.org/wiki/Maze_solving#JavaScript for the basic idea

module.exports = {
  set rnd(_rnd) {
    rnd = _rnd;
  },

  generate: (size) => {
    currentPosition = {x:0, y:0}
    map = createArray(size, size);
    cols = size;
    rows = size;

    let startingPosition;
    let endingPosition;

    let stack = [];
    let path = [];

    while (true) {
      let neighbours = getNeighbours(currentPosition.x, currentPosition.y, 'X');
      let l;
      if( neighbours.length < 1 ) {
        if( stack.length < 1 ) {
          stack = [];

          let rndStart = path[rnd.next(path.length)];
          let rndEnd = path[rnd.next(path.length)];

          while (rndStart.x == rndEnd.x || rndStart.y == rndEnd.y) {
            rndStart = path[rnd.next(path.length)];
            rndEnd = path[rnd.next(path.length)];
          }
          
          startingPosition = rndStart;
          endingPosition = rndEnd;
          
          map[startingPosition.x][startingPosition.y] = 'A';
          map[endingPosition.x][endingPosition.y] = 'B';

          return { map, startingPosition, endingPosition };
        }
        currentPosition = stack.pop();
      } else {
        var i = 2 * rnd.next(0, neighbours.length / 2);
        l = neighbours[i];
        path.push(l);
        map[l.x][l.y] = ' ';
        l = neighbours[i + 1];
        path.push(l);
        map[l.x][l.y] = ' ';
        currentPosition = l
        stack.push(currentPosition)
      }
    }
  }
}

let rnd;
let currentPosition;
let map;
let cols;
let rows;

function createArray(cols, rows) {
  let map = new Array(cols);
  for(var i = 0; i < cols; i++) {
    map[i] = new Array(rows);
      for(var j = 0; j < rows; j++) {
        map[i][j] = 'X';
      }
  }
  return map;
}

getNeighbours = ( sx, sy, a ) => {
  var neighbours = [];
  if( sx - 1 > 0 && map[sx - 1][sy] == a && map[sx - 2][sy] == a ) {
      neighbours.push( { x:sx - 1, y:sy } );
      neighbours.push( { x:sx - 2, y:sy } );
  }
  if( sx + 1 < cols - 1 && map[sx + 1][sy] == a && map[sx + 2][sy] == a ) {
      neighbours.push( { x:sx + 1, y:sy } );
      neighbours.push( { x:sx + 2, y:sy } );
  }
  if( sy - 1 > 0 && map[sx][sy - 1] == a && map[sx][sy - 2] == a ) {
      neighbours.push( { x:sx, y:sy - 1 } );
      neighbours.push( { x:sx, y:sy - 2 } );
  }
  if( sy + 1 < rows - 1 && map[sx][sy + 1] == a && map[sx][sy + 2] == a ) {
      neighbours.push( { x:sx, y:sy + 1 } );
      neighbours.push( { x:sx, y:sy + 2 } );
  }
  return neighbours;
}

