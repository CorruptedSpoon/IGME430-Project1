// deployed from https://github.com/SacuL/RandomWordsAPI licensed under GNU General Public License v3.0
const randWordApiUrl = 'https://obscure-savannah-88677.herokuapp.com/w?n=1';
const emojis = ['&#128515;', '&#128514;', '&#128513;', '&#128517;', '&#127774', '&#127773', '&#128056', '&#128053', '&#128047', '&#128125', '&#128519', '&#128523', '&#128525', '&#128526', '&#128540'];

let lobbyObj = {}; // holds the state data of the game lobby
let currentTeam = 0;
let updateInterval = null;
let titleHasUnderscore = true;
let gameStartUIUpdated = false;

let word = ''; // the word that needs to be typed
let input = ''; // the current input string that is being typed
let t1Emojis = [];
let t2Emojis = [];

let canvas = null;
const markerRadius = 20; // width of the score marker in pixels
const trackHeight = 4; // height of the track the marker will be aligned with

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

// builds html to display input, color coded to indicate if the characters match word
const inputDisplayHtml = () => {
  if(input === '') return '';

  let html = '<p><span class=';
  let isMatching = true;

  if(input[0] === word[0]){
    html += `"greenText">`;
  } 
  else{
    html += `"redText">`;
    isMatching = false;
  }

  for(let i = 0; i < input.length; i++){
    if(input[i] === word[i]){
      if(isMatching){
        html += input[i];
      } else{
        html += `</span><span class="greenText">${input[i]}`;
      }
    } 
    else{
      if(!isMatching){
        html += input[i];
      } else{
        html += `</span><span class="redText">${input[i]}`;
      }
    }
  } return html + '</span></p>';
};

// draws a solid circle at the specified position
const fillCircle = (ctx, color, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, markerRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

// draws the visual indicator of score to the canvas
const draw = () => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const markerX = -lobbyObj.score * (width / 2 - markerRadius) + width / 2;
  const markerY = height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'white';

  const startX = markerRadius;
  const startY = height / 2 - trackHeight / 2;
  const endX = width - markerRadius - startX;
  const enxY = height / 2 + trackHeight / 2 - startY;
  ctx.fillRect(startX, startY, endX, enxY);
  fillCircle(ctx, "#db8787", markerX, markerY);
};

// displays all current game info as html and calls draw
const display = () => {
  // this stuff displays the team info such as name and number of players
  const t1Name = document.querySelector('#t1Name');
  const t1PlayersList = document.querySelector('#t1PlayersList');
  const t2Name = document.querySelector('#t2Name');
  const t2PlayersList = document.querySelector('#t2PlayersList');

  t1Name.innerHTML = lobbyObj.team1;
  t2Name.innerHTML = lobbyObj.team2;
  
  // returns an array of length numPlayers starting with elements from
  // tEmojis and adding random elements from emojis if necessary
  const setPlayerEmojis = (tEmojis, numPlayers) => {
    let newTEmojis = [];
    for(let i = 0; i < numPlayers; i++){
      if(tEmojis[i]){
        newTEmojis.push(tEmojis[i])
      }
      else{
        newTEmojis.push(emojis[Math.floor(Math.random() * emojis.length)]);
      }
    }
    return newTEmojis;
  };
  t1Emojis = setPlayerEmojis(t1Emojis, lobbyObj.t1NumPlayers);
  t2Emojis = setPlayerEmojis(t2Emojis, lobbyObj.t2NumPlayers);
  t1PlayersList.innerHTML = t1Emojis.join('');
  t2PlayersList.innerHTML = t2Emojis.join('');

  if(lobbyObj.running && !gameStartUIUpdated){
    document.querySelector('#go').classList.remove('hidden');
    document.querySelector('#waiting').classList.add('hidden');
    gameStartUIUpdated = true;
  }

  // this displays the current word and input
  const content = document.querySelector('#content');
  let displayHtml = '';
  if (lobbyObj.score >= 1) {
    displayHtml = `<h2>${lobbyObj.team1} wins!</h2>`;
  } else if (lobbyObj.score <= -1) {
    displayHtml = `<h2>${lobbyObj.team2} wins!</h2>`;
  } else if (lobbyObj.running) {
    displayHtml += `<h3>${word}<h3>`;
    displayHtml += `${inputDisplayHtml()}`;
  }
  content.innerHTML = displayHtml;

  draw();
};

// checks for a win based on score, ends the update loop
const checkForWin = () => {
  if (lobbyObj.score >= 1 || lobbyObj.score <= -1) {
    clearInterval(updateInterval);
    lobbyObj.running = false;

    const formData = `name=${lobbyObj.name}`;
    const contentType = 'application/x-www-form-urlencoded';
    sendPost('/removeLobby', contentType, formData);
  }
};

// adds to the score and resets the current word if input is equal to word
const checkInput = async () => {
  if(input === word){
    const formData = `name=${lobbyObj.name}&team=${currentTeam}`;
    const contentType = 'application/x-www-form-urlencoded';
    sendPost('/updateLobby', contentType, formData);

    const randWordRes = await sendGet(randWordApiUrl);
    word = (await randWordRes.json())[0];
    input = '';

    document.querySelector('#go').classList.add('hidden');
  }
};

// handles all keyboard inputs and updates input accordingly
const handleInput = (e) => {
  if (currentTeam !== 0 && lobbyObj.running) {
    const key = e.keyCode;
    const keyChar = String.fromCharCode(key).toLowerCase();

    if(key === 8 && input !== ''){ // check for backspace input and that the current input string is not empty
      input = input.slice(0, input.length - 1);
    } else if(keyChar.match(/^[a-z]+$/) && input.length < word.length){ // make sure that the current input string is not the same length as the word before adding characters
      input += keyChar;
    }
  }
};

// main update loop that runs on an interval while the game is running
// updates the lobby state object
const update = async () => {
  const res = await sendGet(`/getLobbyObj?name=${lobbyObj.name}`);
  const json = await res.json();

  lobbyObj = json;

  checkInput();
  checkForWin();
  display();
};

// initializes lobbyObj, word, update loop, join team select
const initGame = async () => {
  canvas = document.querySelector('#canvas');
  
  const url = window.location.href;
  lobbyObj.name = url.split('=')[1];

  const randWordRes = await sendGet(randWordApiUrl);
  word = (await randWordRes.json())[0];

  await update();

  updateInterval = setInterval(update, 100);
  updateTitleInterval = setInterval(updateTitle, 700);

  const joinTeam = document.querySelector('#joinTeam');
  let selectHTML = '';
  const createOption = (team) => `<option value="${team}">${team}</option>`;
  selectHTML += createOption(lobbyObj.team1);
  selectHTML += createOption(lobbyObj.team2);
  joinTeam.innerHTML = selectHTML;
};

// decrements the player count
const onClientClose = () => {
  const formData = `name=${lobbyObj.name}&team=${currentTeam}`;
  const contentType = 'application/x-www-form-urlencoded';
  sendPost('/removePlayer', contentType, formData);
};

// sets the currentTeam
// calls addPlayer to increment the player count
// sets up onbeforeunload handler
const setTeam = (teamName) => {
  if (lobbyObj.team1 === teamName) currentTeam = 1;
  else currentTeam = 2;

  if(lobbyObj.t1NumPlayers === 0 && lobbyObj.t2NumPlayers === 0){
    document.querySelector('#startButton').classList.remove('hidden');
  }
  else{
    document.querySelector('#waiting').classList.remove('hidden');
  }

  const formData = `name=${lobbyObj.name}&team=${currentTeam}`;
  const contentType = 'application/x-www-form-urlencoded';
  sendPost('/addPlayer', contentType, formData);

  window.onbeforeunload = onClientClose;
};

// animates the 'Type War_' logo
const updateTitle = () => {
  const title = document.querySelector('#title');
  if(titleHasUnderscore){
    title.innerHTML = 'Type War';
  }
  else{
    title.innerHTML = 'Type War_';
  }
  titleHasUnderscore = !titleHasUnderscore;
}

const init = () => {
  const joinButton = document.querySelector('#joinButton');
  const joinTeam = document.querySelector('#joinTeam');
  const joinText = document.querySelector('#joinText');
  const startButon = document.querySelector('#startButton');

  initGame();

  joinButton.addEventListener('click', () => {
    setTeam(joinTeam.value);
    joinButton.parentNode.removeChild(joinButton);
    joinTeam.parentNode.removeChild(joinTeam);
    joinText.parentNode.removeChild(joinText);
  });

  startButon.addEventListener('click', () => {
    const formData = `name=${lobbyObj.name}`;
    const contentType = 'application/x-www-form-urlencoded';

    startButon.parentNode.removeChild(startButon);

    sendPost('/startGame', contentType, formData);
  });

  document.onkeydown = handleInput;
};

window.onload = init;
