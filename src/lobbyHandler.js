const lobbys = {

};

const scoreCounterNum = 0.05;

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

const getLobbyNames = (req, res) => {
  const responseJson = { lobbys: [] };
  const keys = Object.keys(lobbys);

  for (let i = 0; i < keys.length; i++) {
    responseJson.lobbys.push(lobbys[keys[i]].name);
  }
  return respondJSON(res, 200, responseJson);
};

const getLobby = (req, res, params) => {
  const responseJson = {};
  if (!lobbys[params.name]) {
    responseJson.message = 'lobby does not exist';
    responseJson.id = 'lobbyNotFound';
    return respondJSON(res, 400, responseJson);
  } return respondJSON(res, 200, lobbys[params.name]);
};

const updateLobby = (req, res, params) => {
  console.log(params.team);
  if (params.team === '1') {
    lobbys[params.name].score += scoreCounterNum;
  } else {
    lobbys[params.name].score -= scoreCounterNum;
  } return respondJSONMeta(res, 200);
};

module.exports = {
  createLobby,
  getLobby,
  getLobbyNames,
  updateLobby,
};
