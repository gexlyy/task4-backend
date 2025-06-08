const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./auth');
const users = require('./users');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/users', users);

app.listen(3001, () => {
    console.log('Backend running at http://localhost:3001');
});
