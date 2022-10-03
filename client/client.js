const statusStruct = {
  200: 'Success',
  201: 'Created',
  400: 'Bad Request',
};

const handleResGet = async (res) => {
  const lobbySelect = document.querySelector('#joinLobby');

  const json = await res.json();
  const { lobbys } = json;
  let selectHTML = '';
  for (let i = 0; i < lobbys.length; i++) {
    selectHTML += `<option value="${lobbys[i]}">${lobbys[i]}</option>`;
  }
  lobbySelect.innerHTML = selectHTML;
};

const sendGet = async (url) => {
  const res = await fetch(url, {
    method: 'get',
    headers: {
      Accept: 'application/json',
    },
  });
  handleResGet(res);
};

const handleResPost = async (res, name) => {
  const content = document.querySelector('#content');

  if (res.status === 400) {
    const json = await res.json();
    let responseHTML = `<h1>${statusStruct[res.status]}</h1>`;
    responseHTML += `<p>${json.message}</p>`;
    content.innerHTML = responseHTML;
    return;
  }
  sendGet('/getLobbyNames');
  window.location.href = `./game?name=${name}`;
};

const sendPost = async (url, createLobby) => {
  const nameField = createLobby.querySelector('#nameField');
  const team1Field = createLobby.querySelector('#team1Field');
  const team2Field = createLobby.querySelector('#team2Field');

  const formData = `name=${nameField.value}&team1=${team1Field.value}&team2=${team2Field.value}`;

  const res = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: formData,
  });

  handleResPost(res, nameField.value);
};

const init = () => {
  const createLobby = document.querySelector('#createLobby');
  const refreshButton = document.querySelector('#refreshButton');
  const lobbySelect = document.querySelector('#joinLobby');
  const joinButton = document.querySelector('#joinButton');

  createLobby.addEventListener('submit', (event) => {
    sendPost('/createLobby', createLobby);
    event.preventDefault();
  });
  refreshButton.addEventListener('click', () => {
    sendGet('/getLobbyNames');
  });
  joinButton.addEventListener('click', () => {
    if (lobbySelect.value) {
      window.location.href = `./game?name=${lobbySelect.value}`;
    }
  });

  sendGet('/getLobbyNames');
};

window.onload = init;
