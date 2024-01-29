const express = require('express');
const app = express();
const port = 1337;
const path = require("path");

app.use(express.json());
app.use(express.static('frontend'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'frontend'));

app.get(('/'),(req, res) => {
    res.render('index.ejs');
});

app.get(('/starter'), (res, req) => {
    res.render('starter.ejs');
});

app.get(('/login'),(req, res) => {
    res.render('login.ejs');
});

app.get(('/register'),(req, res) => {
    res.render('register.ejs');
});

app.get(('/forgot'),(req, res) => {
    res.render('forgot.ejs');
});

app.get(('/about'), (req, res) => {
    res.render('about.ejs');
});

app.get(('/feedback'), (req, res) => {
    res.render('feedback.ejs');
})

app.get('/account:id', (req, res) => {
    const id = req.params.id;
    res.render("");
});

app.post('/add/users', (req, res) => {

});

app.put('/add/users', (req,res) => {
});

app.put('/add/users:id', (req, res) => {
});

app.listen(port, () => {
    console.log(`app is working on port -> ${port}`);
});