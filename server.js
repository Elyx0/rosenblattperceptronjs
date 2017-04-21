const express = require('express');
const app = express();
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  app.use('dist',express.static(path.join(__dirname,'dist')));
} else {
  app.use(express.static(path.join(__dirname, '/dist')));
}
app.set('port', (process.env.PORT || 8080));
app.get('/', function response(req, res) {
       res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.listen(app.get('port'), _ => {
  console.log('Listening on', app.get('port'));
});
