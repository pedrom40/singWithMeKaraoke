const express = require('express');

const app = express();

app.use(express.static('public'));

// root domain
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
