const express = require('express');

const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
// app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join('build')));
app.get('/', function (req, res) {
    // res.sendFile(path.join(__dirname, 'build', 'index.html'));
    const index = path.join(__dirname, 'build', 'index.html');
    res.sendFile(index);
})
app.get('/ping', function (req, res) {
    return res.send('pong');
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port);