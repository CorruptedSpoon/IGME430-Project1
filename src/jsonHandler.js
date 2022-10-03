const helper = require('./helper.js');

const notFound = (req, res) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };
  helper.respondJson(res, 404, responseJSON);
};

const notFoundMeta = (req, res) => {
  helper.respondJsonMeta(res, 404);
};

module.exports = {
  notFound,
  notFoundMeta,
};
