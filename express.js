const express = require("express");
const app = express();
const port = 9999;

app.get("/", (req , res) => {
    res.sendFile(__dirname+'/frontend/html/mainpage.html');
})
app.get("/mainpage", (req , res) => {
    res.sendFile(__dirname+'/frontend/html/mainpage.html');
})
app.get("/Drag&Drop", (req , res) => {
    res.sendFile(__dirname+'/frontend/html/Drag&Drop.html');
})
app.get("/feedback", (req , res) => {
    res.sendFile(__dirname+'/frontend/html/feedback.html');
})
app.get("/frameworks", (req , res) => {
    res.sendFile(__dirname+'/frontend/html/frameworks.html');
})
app.get("/languages", (req , res) => {
    res.sendFile(__dirname+'/frontend/html/languages.html');
})
app.get("/video&sources", (req , res) => {
    res.sendFile(__dirname+'/frontend/html/video&sources.html');
})
app.get("/feedback", (req , res) => {
    res.sendFile(__dirname+'/frontend/html/feedback.html');
})

app.listen(port, () => {
    console.log(`App is listening on port => ${port}`);
})