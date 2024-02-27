const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./router');

const app = express();

app.use(bodyParser.json());
app.use(express.static('frontend'));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'frontend'));

app.use('/', router);

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
