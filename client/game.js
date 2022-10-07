// holds the state data of the game lobby
let lobbyObj = {};
let currentTeam = 0;
let running = true;
let updateInterval = null;

// const statusStruct = {
//   200: 'Success',
//   201: 'Created',
//   400: 'Bad Request',
// };

const sendGet = async (url) => {
  const res = await fetch(url, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
    },
  });
  return res;
};

const sendPost = async (url, contentType, body) => {
  const res = await fetch(url, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': contentType,
    },
    body: body,
  });
  return res;
};

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

const checkForWin = () => {
  if (lobbyObj.score >= 1 || lobbyObj.score <= -1) {
    clearInterval(updateInterval);
    running = false;
  }
};

const update = async () => {
  const res = await sendGet(`/getLobbyObj?name=${lobbyObj.name}`);
  const json = await res.json();

  lobbyObj = json;

  checkForWin();
  display();
};

const initGame = async () => {
  const url = window.location.href;
  lobbyObj.name = url.split('=')[1];

  await update();
  updateInterval = setInterval(update, 100);

  const joinTeam = document.querySelector('#joinTeam');
  let selectHTML = '';
  const createOption = (team) => `<option value="${team}">${team}</option>`;
  selectHTML += createOption(lobbyObj.team1);
  selectHTML += createOption(lobbyObj.team2);
  joinTeam.innerHTML = selectHTML;
};

const handleInput = (e) => {
  if (currentTeam !== 0 && running) {
    const key = e.keyCode;

    if (key === 32) {
      const formData = `name=${lobbyObj.name}&team=${currentTeam}`;
      const contentType = 'application/x-www-form-urlencoded';
      sendPost('/updateLobby', contentType, formData);
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

  initGame();

  joinButton.addEventListener('click', () => {
    setTeam(joinTeam.value);
    joinButton.parentNode.removeChild(joinButton);
    joinTeam.parentNode.removeChild(joinTeam);
    joinText.parentNode.removeChild(joinText);
  });

  document.onkeydown = handleInput;
};

window.onload = init;
