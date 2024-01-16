const express = require('express');
const app = express();
const port = 1337;
const dir = __dirname+'/frontend/html/';
app.get(('/'),(req, res) => {
    res.sendFile(dir + 'main.html');
});

app.post('/add', (req, res) => {

});
app.listen(port, () => {
    console.log(`app is working on port -> ${port}`);
});