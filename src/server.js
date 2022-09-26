const http = require('http');
const url = require('url');
const query = require('querystring');
const jsonHandler = require('./jsonHandler');
const htmlHandler = require('./htmlHandler');

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
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notFound,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    '/notReal': jsonHandler.notFoundMeta,
  },
  POST: {
    '/addUser': (req, res) => parseBody(req, res, jsonHandler.addUser),
  },
};

const onRequest = (req, res) => {
  const parsedUrl = url.parse(req.url);

  const handler = urlStruct[req.method][parsedUrl.pathname];
  if (handler) {
    handler(req, res);
  } else {
    urlStruct[req.method].notFound(req, res);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});
