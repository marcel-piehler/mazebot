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

function loadMaze() {
  if (seed != undefined) seedString = 'seed=' + seed++ + '&';

  getJson('http://localhost:3000/api/random?' + seedString/* + 'minSize=199&maxSize=199'*/, function(res) { 
    console.log(res);
    drawMaze(res.map);
  });
}

var canvas = document.getElementById('maze-canvas');
var ctx = ctx = canvas.getContext("2d");

function drawMaze(map, scale) {
  if(scale == undefined) scale = 10;

  rows = map.length;
  cols = map[0].length;

  canvas.height = rows * scale;
  canvas.width = cols * scale;


  ctx.fillStyle = "#181820";
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      switch (map[j][i]) {
        case ' ':
          ctx.fillStyle = '#505058';
          ctx.fillRect (i * scale, j * scale, scale, scale)
          break;
        case 'X':
          ctx.fillStyle = '#181820';
          ctx.fillRect (i * scale, j * scale, scale, scale);
          break;
        case 'A':
          ctx.fillStyle = '#AFA';
          ctx.fillRect (i * scale, j * scale, scale, scale);
          break;
        case 'B':
          ctx.fillStyle = '#FAA';
          ctx.fillRect (i * scale, j * scale, scale, scale);
          break;
        default:
          break;
      }
    }
  }
}

loadMaze();

window.onresize = resizeCanvas;

function resizeCanvas() {
  canvas.style.height = canvas.style.width;
}