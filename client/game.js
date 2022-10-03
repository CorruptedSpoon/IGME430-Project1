// holds the state data of the game lobby
let lobbyObj = {};
let currentTeam = 0;
let running = true;
let interval = null;

// const statusStruct = {
//   200: 'Success',
//   201: 'Created',
//   400: 'Bad Request',
// };

const display = () => {
  const content = document.querySelector('#content');
  let displayHtml = '';
  if (lobbyObj.score >= 1) {
    displayHtml = 'Team 1 wins!';
  } else if (lobbyObj.score <= -1) {
    displayHtml = 'Team 2 wins!';
  } else {
    displayHtml = '<h3>score (100 or -100 wins)</h3>';
    displayHtml += `${Math.floor(lobbyObj.score * 100)}`;
  }

  content.innerHTML = displayHtml;
};

const updateLobbyObj = (json) => {
  lobbyObj = json;
  if (lobbyObj.score >= 1 || lobbyObj.score <= -1) {
    clearInterval(interval);
    running = false;
  }
  display();
};

const handleGetJson = async (res, handler) => {
  const json = await res.json();

  handler(json);
};

const sendGetJson = async (url, jsonHandler) => {
  const res = await fetch(url, {
    method: 'get',
    headers: {
      Accept: 'application/json',
    },
  });
  handleGetJson(res, jsonHandler);
};

const initGame = (json) => {
  updateLobbyObj(json);

  const joinTeam = document.querySelector('#joinTeam');
  let selectHTML = '';
  const createOption = (team) => `<option value="${team}">${team}</option>`;
  selectHTML += createOption(lobbyObj.team1);
  selectHTML += createOption(lobbyObj.team2);
  joinTeam.innerHTML = selectHTML;

  const update = () => sendGetJson(`/getLobbyObj?name=${lobbyObj.name}`, updateLobbyObj);
  interval = setInterval(update, 500);
};

const sendPost = async (url) => {
  const formData = `name=${lobbyObj.name}&team=${currentTeam}`;

  await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
};

const handleInput = (e) => {
  if (currentTeam !== 0 && running) {
    const key = e.keyCode;
    console.log(key);

    if (key === 32) {
      console.log('sending post');
      sendPost('/updateLobby');
    }
  }
};

const setTeam = (teamName) => {
  if (lobbyObj.team1 === teamName) currentTeam = 1;
  else currentTeam = 2;
};

const init = () => {
  const joinButton = document.querySelector('#joinButton');
  const joinTeam = document.querySelector('#joinTeam');
  const joinText = document.querySelector('#joinText');
  const url = window.location.href;
  const lobbyName = url.split('=')[1];

  sendGetJson(`/getLobbyObj?name=${lobbyName}`, initGame);

  joinButton.addEventListener('click', () => {
    setTeam(joinTeam.value);
    joinButton.parentNode.removeChild(joinButton);
    joinTeam.parentNode.removeChild(joinTeam);
    joinText.parentNode.removeChild(joinText);
  });

  document.onkeydown = handleInput;
};

window.onload = init;
