const express = require('express');
const app = express();
const port = 3000 || 8080;

app.all('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<html><head> <link href="https://fonts.googleapis.com/css?famiy=Roboto Condensed" rel="stylesheet"> <style>body{font-family: "Roboto Condensed"; font-size: 21px; color: white; background-color: #23272A; margin-left: 5%; margin-top: 2%;}a{color: #5865F2}a:hover{color: #818bff}h1{font-size: 48px;}</style></head><body> <h1>如何24/7?</h1> </p></a><i>請使用 <a href="https://uptimerobot.com/">Uptime-Robot</a> 可以讓你Bot保持上線</i></p> <h1>WebTer</h1> <b><a href=https://discord.gg/hbZXjAZjv5>Discord Server</a> <br> <iframe src="https://discord.com/widget?id=612672719804301330&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`);
  res.end();
});

function k() {
  app.listen(port, () => {
    console.log("連結已產生! , 請使用https://uptimerobot.com 謝謝!".bgGreen.white)
  });
}
module.exports = k;