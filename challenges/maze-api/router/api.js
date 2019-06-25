const express = require('express');
const router = express.Router();

const maze = require('../modules/maze');
const seedRand = require('../modules/seedRand');

router.get('/random', (req, res) => {
  var minSize = (req.query.minSize % 2) ? req.query.minSize : req.query.minSize - 1 || 9;
  var maxSize = (req.query.maxSize % 2) ? req.query.maxSize : req.query.maxSize - 1 || 99;
  var seed = req.query.seed;

  if( minSize > maxSize ) {
    res.json({ success: 'false', error: 'maxSize must be bigger than minSize' });
    return;
  } else if ( minSize < 3 ) {
    res.json({ success: 'false', error: 'minSize must not be smaller than 3' });
    return;
  } else if ( maxSize > 199 ) {
    res.json({ success: 'false', error: 'minSize must not be bigger than 199' });
    return;
  }

  if (seed == undefined) {
    seed = Math.floor(Math.random() * 10000000000);
  }

  const rnd = seedRand(seed);
  maze.rnd = rnd;

  let size = 0;

  if(minSize == maxSize) {
    size = minSize;
  } else {
    let randomSize = rnd.next(minSize, maxSize);
    if (randomSize % 2 == 0) randomSize -= 1;
    size = randomSize;
  }

  let mazeObj = maze.generate(size);

  res.json({ success: 'true', map: mazeObj.map, startingPosition: mazeObj.startingPosition, endingPosition: mazeObj.endingPosition, seed: seed });
});

module.exports = router;