function getJson(url, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(JSON.parse(xhr.response));
    }
  }

  xhr.open('GET', url, true);
  xhr.send('');
}

var seed = 1;
let seedString = '';

let mazeObj = {};

function loadMaze() {
  if (seed != undefined) seedString = 'seed=' + seed++ + '&';

  getJson('http://localhost:3000/api/random?' + seedString/* + 'minSize=199&maxSize=199'*/, function(res) { 
  // getJson('https://api.noopschallenge.com/mazebot/random', function(res) { 
    console.log(res);
    mazeObj = res;
    drawMaze(mazeObj.map);
  });
}

var canvas = document.getElementById('maze-canvas');
var ctx = ctx = canvas.getContext("2d");

function drawLine(stack, line) {
  rows = mazeObj.map.length;
  cols = mazeObj.map[0].length;

  let scale = canvas.height / rows;

  ctx.lineWidth = scale / 3;
  ctx.strokeStyle = "#5af";
  ctx.lineJoin = 'round';

  let pos = stack.pop();

  if (line == undefined) {
    // ctx.moveTo(pos.y * scale, pos.x * scale);
    line = [pos];
  }

  if (stack.length > 0) {
    
    ctx.moveTo(line[0].y * scale + scale / 2, line[0].x * scale + scale / 2);

    for (let i = 0; i < line.length; i++) {
      ctx.lineTo(line[i].y * scale + scale / 2, line[i].x * scale + scale / 2);
    }

    line.push(pos);
    ctx.lineTo(pos.y * scale + scale / 2, pos.x * scale + scale / 2);
    ctx.stroke();

    // ctx.fillStyle = '#aaf';
    // ctx.fillRect (pos.y * scale, pos.x * scale, scale, scale);
    requestAnimationFrame(function() {
      drawLine(stack, line);
    });
  } else {
    return;
  }

  
}

function drawMaze(map, scale) {

  rows = map.length;
  cols = map[0].length;

  if(scale == undefined) scale = Math.ceil(canvas.scrollHeight / rows);

  canvas.height = rows * scale;
  canvas.width = cols * scale;


  ctx.fillStyle = "#303038";
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      switch (map[j][i]) {
        // case ' ':
        //   ctx.fillStyle = '#505058';
        //   ctx.fillRect (i * scale, j * scale, scale, scale)
        //   break;
        case 'X':
          ctx.fillStyle = '#101018';
          ctx.fillRect (i * scale, j * scale, scale, scale);
          break;
        case 'A':
          ctx.shadowColor = '#3a3';
          ctx.fillStyle = '#4f4';
          ctx.shadowBlur = 5;

          ctx.beginPath();
          ctx.arc(i * scale+scale/2, j * scale+scale/2, scale/4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // ctx.fillStyle = '#AFA';
          // ctx.fillRect (i * scale, j * scale, scale, scale);
          break;
        case 'B':
            ctx.shadowColor = '#a33';
            ctx.fillStyle = '#f33';
            ctx.shadowBlur = 5;
  
            ctx.beginPath();
            ctx.arc(i * scale+scale/2, j * scale+scale/2, scale/4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
          break;
        default:
          break;
      }
    }
  }
}

loadMaze();

// window.onresize = resizeCanvas;

// function resizeCanvas() {
//   canvas.style.height = canvas.style.width;
// }

function solveMaze() {
  let bfsRes = bfs(mazeObj.map, mazeObj.startingPosition, mazeObj.endingPosition);
  
  // ctx.moveTo(20, 20);
  console.log(bfsRes);
  drawLine(bfsRes.stack);
  // ctx.stroke();
}

function bfs(map, startingPosition, endingPosition) {
  var q = [];
  var d = {};
  var s = [];
  var visited = [];
  var next = {x:0, y:0}
  
  // console.log(player.position.X, player.position.Y);
  q.push( Object.create(startingPosition) );

  while(q.length > 0) {

    next = Object.create( q.shift() );
    
    if (mazeObj.map[next.x][next.y] == 'B') {
      console.log('reached B');
      s.push( Object.create(next) );
      
      var from = d[next.x + ',' + next.y];
    
      while (startingPosition.x != from.x || startingPosition.y != from.y) {
        s.push( Object.create(from) );
        from = d[from.x + ',' + from.y];
      }
      // drawVisited(visited, s);
      return { visited, stack:s };
    }
    
    getNeighboursWhereNot(next.x, next.y, 'X').forEach(function(neighbour) {
      // console.log(neighbour);
      if (!d.hasOwnProperty(neighbour.x + ',' + neighbour.y)) {
        q.push( Object.create(neighbour) );
        visited.push( Object.create(neighbour) );
        d[neighbour.x + ',' + neighbour.y] = Object.create(next);
      }
    });
  }
}

function dfs(map, startingPosition, endingPosition) {
  let curPos = startingPosition;
  let stack = [];
  let visited = [];

  let rows = mazeObj.map.length;
  let cols = mazeObj.map[0].length;

  while(true) {
    console.log(curPos, endingPosition);
    if( curPos.x == endingPosition.x && curPos.y == endingPosition.y ) {
      for( var i = 0; i < cols; i++ ) {
          for( var j = 0; j < rows; j++ ) {
              switch( maze[i][j] ) {
                  case 2: mazeObj.map[i][j] = 3; break;
                  case 4: mazeObj.map[i][j] = 0; break;
              }
          }
      }


      drawMaze(mazeObj.map);
      return;
    }
    var neighbours = getNeighbours( curPos.x, curPos.y, ' ' );
    if( neighbours.length ) {
        stack.push( curPos );
        curPos = neighbours[0];
        mazeObj.map[curPos.x][curPos.y] = 2;
    } else {
      // mazeObj.map[curPos.x][curPos.y] = 4;
      curPos = stack.pop();
    }
  }
}

function getNeighboursWhereNot( sx, sy, a ) {
  var n = [];
  if( sx - 1 > 0 && mazeObj.map[sx - 1][sy] != a ) {
      n.push( { x:sx - 1, y:sy } );
  }
  if( sx + 1 < cols - 1 && mazeObj.map[sx + 1][sy] != a ) {
      n.push( { x:sx + 1, y:sy } );
  }
  if( sy - 1 > 0 && mazeObj.map[sx][sy - 1] != a ) {
      n.push( { x:sx, y:sy - 1 } );
  }
  if( sy + 1 < rows - 1 && mazeObj.map[sx][sy + 1] != a ) {
      n.push( { x:sx, y:sy + 1 } );
  }
  return n;
}