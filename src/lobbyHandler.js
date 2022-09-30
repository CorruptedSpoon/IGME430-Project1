const lobbys = {

};

const respondJSON = (res, status, obj) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(obj));
  res.end();
};
const respondJSONMeta = (res, status) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end();
};

const addLobby = (body) => {
  const lobby = {
    name: body.name,
    team1: body.team1,
    team2: body.team2,
    score: 0,
  };

  lobbys[body.name] = lobby;
};

const createLobby = (req, res, body) => {
  const responseJSON = {};

  if (!body.name || !body.team1 || !body.team2) {
    responseJSON.message = 'missing params';
    responseJSON.id = 'missingParams';
    return respondJSON(res, 400, responseJSON);
  }
  if (lobbys[body.name]) {
    responseJSON.message = 'name already exists';
    responseJSON.id = 'nameAlreadyExists';
    return respondJSON(res, 400, responseJSON);
  }

  addLobby(body);
  return respondJSONMeta(res, 201);
};

module.exports = {
  createLobby,
};
