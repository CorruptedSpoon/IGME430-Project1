// deployed from https://github.com/SacuL/RandomWordsAPI licensed under GNU General Public License v3.0
const randWordApiUrl = 'https://obscure-savannah-88677.herokuapp.com/w?n=1';

// holds the state data of the game lobby
let lobbyObj = {};
let currentTeam = 0;
let running = false;
let updateInterval = null;

let word = ''; // the word that needs to be typed
let input = ''; // the current input string that is being typed

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

// adds info like word and input, as well as score to the HTML
const display = () => {
  const content = document.querySelector('#content');
  let displayHtml = '';
  if (lobbyObj.score >= 1) {
    displayHtml = 'Team 1 wins!';
  } else if (lobbyObj.score <= -1) {
    displayHtml = 'Team 2 wins!';
  } else {
    displayHtml = '<h3>score (100 or -100 wins)</h3>';
    displayHtml += `<p>${Math.floor(lobbyObj.score * 100)}</p>`;
    displayHtml += `<h3>${word}<h3>`;
    displayHtml += `${inputDisplayHtml()}`;
  }
  content.innerHTML = displayHtml;
};

// checks for a win based on score, ends the update loop
const checkForWin = () => {
  if (lobbyObj.score >= 1 || lobbyObj.score <= -1) {
    clearInterval(updateInterval);
    running = false;
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
  }
};

// handles all keyboard inputs and updates input accordingly
const handleInput = (e) => {
  if (currentTeam !== 0 && running) {
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
  const url = window.location.href;
  lobbyObj.name = url.split('=')[1];

  const randWordRes = await sendGet(randWordApiUrl);
  word = (await randWordRes.json())[0];

  await update();
  updateInterval = setInterval(update, 100);

  const joinTeam = document.querySelector('#joinTeam');
  let selectHTML = '';
  const createOption = (team) => `<option value="${team}">${team}</option>`;
  selectHTML += createOption(lobbyObj.team1);
  selectHTML += createOption(lobbyObj.team2);
  joinTeam.innerHTML = selectHTML;
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
    running = true;
  });

  document.onkeydown = handleInput;
};

window.onload = init;
