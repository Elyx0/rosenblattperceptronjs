const express = require('express');
const app = express();
const path = require('path');

app.use('dist',express.static(path.join(__dirname,'dist')));
app.use('media',express.static(path.join(__dirname,'media')));
app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), _ => {
  console.log('Listening on', app.get('port'));
});
