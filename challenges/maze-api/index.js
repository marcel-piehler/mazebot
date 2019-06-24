const express = require('express');
const app = express();
const port = 3000;

app.set('json spaces', 0);

app.use('/', express.static('../maze-frontend'));

app.use('/api', require('./router/api'));

app.listen(port, () => console.log(`webserver listening on port ${port}!`));