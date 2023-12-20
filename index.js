const express = require('express');
const app = express();
const port = 1337;

app.get(('/'),(req, res) => {
    res.send(')))')
});

app.listen(port, () => {
    console.log(`app is working on port -> ${port}`);
});