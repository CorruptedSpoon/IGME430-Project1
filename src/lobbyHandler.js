const helper = require('./helper.js');

const lobbys = {}; // holds all lobby objects

const scoreCounterNum = 0.05; // the amount to increment the score

// helper function for createLobby
const addLobby = (params) => {
  const lobby = {
    name: params.name,
    team1: params.team1,
    team2: params.team2,
    score: 0,
  };
  lobbys[params.name] = lobby;
};

// creates and adds a lobby to the lobbys obj based on params
// returns an error if params are missing or if the lobby already exists
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

// returns an array containing the names of all lobbys
// can return an empty array
const getLobbyNames = (req, res) => {
  const responseJson = { lobbys: [] };
  const keys = Object.keys(lobbys);

  for (let i = 0; i < keys.length; i++) {
    responseJson.lobbys.push(lobbys[keys[i]].name);
  }
  return helper.respondJson(res, 200, responseJson);
};

// getLobbyNames will always succeed because it can return an empty array
// so just return sucess
const getLobbyNamesMeta = (req, res) => helper.respondJsonMeta(res, 200);

// returns the object at params.name in lobbys or an error if it doesn't exist
const getLobbyObj = (req, res, params) => {
  const responseJson = {};
  if (!lobbys[params.name]) {
    responseJson.message = 'lobby does not exist';
    responseJson.id = 'lobbyNotFound';
    return helper.respondJson(res, 400, responseJson);
  } return helper.respondJson(res, 200, lobbys[params.name]);
};

const getLobbyObjMeta = (req, res, params) => {
  if (!lobbys[params.name]) {
    return helper.respondJsonMeta(res, 400);
  } return helper.respondJsonMeta(res, 200);
};

// increments the score counter by a set amount
// or an error if the team parameter is invalid
const updateLobby = (req, res, params) => {
  if (params.team === '1') {
    lobbys[params.name].score += scoreCounterNum;
    return helper.respondJsonMeta(res, 204);
  }
  if (params.team === '2') {
    lobbys[params.name].score -= scoreCounterNum;
    return helper.respondJsonMeta(res, 204);
  }

  const responseJson = {};
  responseJson.message = 'team parameter is not 1 or 2';
  responseJson.id = 'invalidParams';
  return helper.respondJson(res, 400, responseJson);
};

module.exports = {
  createLobby,
  getLobbyObj,
  getLobbyObjMeta,
  getLobbyNames,
  getLobbyNamesMeta,
  updateLobby,
};
