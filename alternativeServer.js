let http = require('http');
const port = 1337;
const fs = require("fs");
http.createServer((req, res) => {
    fs.readFile('/frontend/index.ejs', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(data)
        return res.end();
    });
}).listen(port, () => {
    console.log(`Server working on port ${port}`);
});