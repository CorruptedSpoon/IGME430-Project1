const fs = require('fs');
const helper = require('./helper.js');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const game = fs.readFileSync(`${__dirname}/../client/game.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const clientJs = fs.readFileSync(`${__dirname}/../client/client.js`);
const gameJs = fs.readFileSync(`${__dirname}/../client/game.js`);

const getIndexHtml = (req, res) => {
  helper.respond(res, 200, 'text/html', index);
};

const getGameHtml = (req, res) => {
  helper.respond(res, 200, 'text/html', game);
};

const getCSS = (req, res) => {
  helper.respond(res, 200, 'text/css', css);
};

const getClientJs = (req, res) => {
  helper.respond(res, 200, 'text/javascript', clientJs);
};

const getGameJs = (req, res) => {
  helper.respond(res, 200, 'text/javascript', gameJs);
};

module.exports = {
  getIndexHtml,
  getGameHtml,
  getCSS,
  getClientJs,
  getGameJs,
};
