const http = require('http');
const url = require('url');
const query = require('querystring');
const jsonHandler = require('./jsonHandler');
const htmlHandler = require('./htmlHandler');
const lobbyHandler = require('./lobbyHandler');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (req, res, handler) => {
  const body = [];

  req.on('error', (err) => {
    console.dir(err.message);
    res.statusCode = 400;
    res.end();
  });

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(req, res, bodyParams);
  });
};

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndexHtml,
    '/style.css': htmlHandler.getCSS,
    '/game': htmlHandler.getGameHtml,
    '/client.js': htmlHandler.getClientJs,
    '/game.js': htmlHandler.getGameJs,
    '/getLobbyObj': lobbyHandler.getLobbyObj,
    '/getLobbyNames': lobbyHandler.getLobbyNames,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getLobbyObj': lobbyHandler.getLobbyObjMeta,
    '/getLobbyNames': lobbyHandler.getLobbyNamesMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/createLobby': (req, res) => parseBody(req, res, lobbyHandler.createLobby),
    '/removeLobby': (req, res) => parseBody(req, res, lobbyHandler.removeLobby),
    '/updateLobby': (req, res) => parseBody(req, res, lobbyHandler.updateLobby),
    '/addPlayer': (req, res) => parseBody(req, res, lobbyHandler.addPlayer),
    '/removePlayer': (req, res) => parseBody(req, res, lobbyHandler.removePlayer),
    '/startGame': (req, res) => parseBody(req, res, lobbyHandler.startGame),
  },
};

const onRequest = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const params = query.parse(parsedUrl.query);

  const handler = urlStruct[req.method][parsedUrl.pathname];
  if (handler) {
    handler(req, res, params);
  } else {
    console.log(`${req.method} ${parsedUrl.pathname}`);
    urlStruct[req.method].notFound(req, res);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});
