const helper = require('./helper.js');

const lobbys = {}; // holds all lobby objects

const scoreCounterNum = 0.1; // the amount to increment the score

// helper function for createLobby
const addLobby = (params) => {
  const lobby = {
    name: params.name,
    team1: params.team1,
    team2: params.team2,
    t1NumPlayers: 0,
    t2NumPlayers: 0,
    score: 0,
    running: false,
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

// removes the lobby with the given name param after an amount of time
// returns an error if the lobby doesn't exist
const removeLobby = async (req, res, params) => {
  if (lobbys[params.name]) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    delete lobbys[params.name];
    return helper.respondJsonMeta(res, 204);
  }

  const responseJson = {
    message: 'lobby does not exist',
    id: 'lobbyNotFound',
  };
  return helper.respondJson(res, 400, responseJson);
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

// increments the player count variable for a specific team
const changePlayerCount = (res, params, numToAdd) => {
  if (lobbys[params.name]) {
    if (params.team === '1') {
      lobbys[params.name].t1NumPlayers += numToAdd;
      return helper.respondJsonMeta(res, 204);
    }
    if (params.team === '2') {
      lobbys[params.name].t2NumPlayers += numToAdd;
      return helper.respondJsonMeta(res, 204);
    }

    const responseJson = {
      message: 'team parameter is not 1 or 2',
      id: 'invalidTeamParam',
    };
    return helper.respondJson(res, 400, responseJson);
  }

  const responseJson = {
    message: 'the lobby does not exist',
    id: 'invalidNameParam',
  };
  return helper.respondJson(res, 400, responseJson);
};

const addPlayer = (req, res, params) => {
  changePlayerCount(res, params, 1);
};

const removePlayer = (req, res, params) => {
  changePlayerCount(res, params, -1);
};

const startGame = (req, res, params) => {
  if (lobbys[params.name]) {
    lobbys[params.name].running = true;
    return helper.respondJsonMeta(res, 204);
  }
  const responseJson = {
    message: 'the lobby does not exist',
    id: 'invalidNameParam',
  };
  return helper.respondJson(res, 400, responseJson);
};

module.exports = {
  createLobby,
  removeLobby,
  getLobbyObj,
  getLobbyObjMeta,
  getLobbyNames,
  getLobbyNamesMeta,
  updateLobby,
  addPlayer,
  removePlayer,
  startGame,
};
