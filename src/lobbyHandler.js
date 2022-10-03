const helper = require('./helper.js');

const lobbys = {};

const scoreCounterNum = 0.05;

const addLobby = (params) => {
  const lobby = {
    name: params.name,
    team1: params.team1,
    team2: params.team2,
    score: 0,
  }; 
  lobbys[params.name] = lobby;
};

const createLobby = (req, res, params) => {
  const responseJSON = {};

  if (!params.name || !params.team1 || !params.team2) {
    responseJSON.message = 'missing params';
    responseJSON.id = 'missingParams';
    return helper.respondJson(res, 400, responseJSON);
  }
  if (lobbys[params.name]) {
    responseJSON.message = 'name already exists';
    responseJSON.id = 'nameAlreadyExists';
    return helper.respondJson(res, 400, responseJSON);
  }

  addLobby(params);
  return helper.respondJsonMeta(res, 201);
};

const getLobbyNames = (req, res) => {
  const responseJson = { lobbys: [] };
  const keys = Object.keys(lobbys);

  for (let i = 0; i < keys.length; i++) {
    responseJson.lobbys.push(lobbys[keys[i]].name);
  }
  return helper.respondJson(res, 200, responseJson);
};

const getLobbyObj = (req, res, params) => {
  const responseJson = {};
  if (!lobbys[params.name]) {
    responseJson.message = 'lobby does not exist';
    responseJson.id = 'lobbyNotFound';
    return helper.respondJson(res, 400, responseJson);
  } return helper.respondJson(res, 200, lobbys[params.name]);
};

const updateLobby = (req, res, params) => {
  console.log(params.team);
  if (params.team === '1') {
    lobbys[params.name].score += scoreCounterNum;
  } else {
    lobbys[params.name].score -= scoreCounterNum;
  } return helper.respondJsonMeta(res, 200);
};

module.exports = {
  createLobby,
  getLobbyObj,
  getLobbyNames,
  updateLobby,
};
