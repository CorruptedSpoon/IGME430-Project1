const users = {};

const respondJSON = (req, res, status, obj) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(obj));
  res.end();
};

const respondJSONMeta = (req, res, status) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end();
};

const getUsers = (req, res) => {
  const responseJSON = {
    users,
  };
  respondJSON(req, res, 200, responseJSON);
};

const getUsersMeta = (req, res) => {
  respondJSONMeta(req, res, 200);
};

const notFound = (req, res) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };
  respondJSON(req, res, 404, responseJSON);
};

const notFoundMeta = (req, res) => {
  respondJSONMeta(req, res, 404);
};

const addUser = (req, res, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(req, res, 400, responseJSON);
  }

  let responseCode = 204;

  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(req, res, responseCode, responseJSON);
  } return respondJSONMeta(req, res, responseCode);
};

module.exports = {
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  addUser,
};
