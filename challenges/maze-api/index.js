const express = require('express');
const app = express();
const port = 3000;

const maze = require('./modules/maze');
const seedRand = require('./modules/seedRand');

app.set('json spaces', 0);

app.get('/', (req, res) => {
  res.json([]);
});

app.get('/random', (req, res) => {
  var minSize = (req.query.minSize % 2) ? req.query.minSize : req.query.minSize - 1 || 9;
  var maxSize = (req.query.maxSize % 2) ? req.query.maxSize : req.query.maxSize - 1 || 99;
  var seed = req.query.seed;

  if( minSize > maxSize ) {
    res.json({ success: 'false', error: 'maxSize must be bigger than minSize' });
  } else if ( minSize < 3 ) {
    res.json({ success: 'false', error: 'minSize must not be smaller than 3' });
  } else if ( maxSize > 99 ) {
    res.json({ success: 'false', error: 'minSize must not be bigger than 199' });
  }
  
  const random = seedRand(seed);

  console.log(random.next(minSize, maxSize));

  let size = 0;

  if(minSize == maxSize) {
    size = minSize;
  } else {
    size = random.next(minSize, maxSize);
  }

  let map = maze.generate(size);

  res.json({ success: 'true', maze: map });

  function getNeighbours( sx, sy, a ) {
    var n = [];
    if( sx - 1 > 0 && maze[sx - 1][sy] == a && sx - 2 > 0 && maze[sx - 2][sy] == a ) {
        n.push( { x:sx - 1, y:sy } ); n.push( { x:sx - 2, y:sy } );
    }
    if( sx + 1 < cols - 1 && maze[sx + 1][sy] == a && sx + 2 < cols - 1 && maze[sx + 2][sy] == a ) {
        n.push( { x:sx + 1, y:sy } ); n.push( { x:sx + 2, y:sy } );
    }
    if( sy - 1 > 0 && maze[sx][sy - 1] == a && sy - 2 > 0 && maze[sx][sy - 2] == a ) {
        n.push( { x:sx, y:sy - 1 } ); n.push( { x:sx, y:sy - 2 } );
    }
    if( sy + 1 < rows - 1 && maze[sx][sy + 1] == a && sy + 2 < rows - 1 && maze[sx][sy + 2] == a ) {
        n.push( { x:sx, y:sy + 1 } ); n.push( { x:sx, y:sy + 2 } );
    }
    return n;
  }
  function createArray( c, r ) {
      var m = new Array( c );
      for( var i = 0; i < c; i++ ) {
          m[i] = new Array( r );
          for( var j = 0; j < r; j++ ) {
              m[i][j] = 1;
          }
      }
      return m;
  }

  function createMaze() {
    var neighbours = getNeighbours( start.x, start.y, 1 ), l;
    if( neighbours.length < 1 ) {
      if( stack.length < 1 ) {
        drawMaze(); stack = [];
        start.x = start.y = -1;
        document.getElementById( "canvas" ).addEventListener( "mousedown", getCursorPos, false );
        return;
      }
      start = stack.pop();
    } else {
      var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
      l = neighbours[i]; maze[l.x][l.y] = 0;
      l = neighbours[i + 1]; maze[l.x][l.y] = 0;
      start = l
      stack.push( start )
    }
  }
});

app.listen(port, () => console.log(`webserver listening on port ${port}!`));