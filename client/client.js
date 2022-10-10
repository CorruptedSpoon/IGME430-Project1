let titleHasUnderscore = true;

const statusStruct = {
  200: 'Success',
  201: 'Created',
  400: 'Bad Request',
};

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

const updateLobbys = async () => {
  const res = await sendGet('/getLobbyNames');
  const json = await res.json();
  const lobbys = json.lobbys;

  let selectHtml = '';
  for(let i = 0; i < lobbys.length; i++){
    selectHtml += `<option value="${lobbys[i]}">${lobbys[i]}</option>`;
  }
  const lobbySelect = document.querySelector('#joinLobby');
  lobbySelect.innerHTML = selectHtml;
};

const createLobby = async (createForm) => {
  const nameField = createForm.querySelector('#nameField');
  const team1Field = createForm.querySelector('#team1Field');
  const team2Field = createForm.querySelector('#team2Field');
  const formData = `name=${nameField.value}&team1=${team1Field.value}&team2=${team2Field.value}`;

  const contentType = 'application/x-www-form-urlencoded';
  const res = await sendPost('/createLobby', contentType, formData);

  if (res.status === 400) {
    const json = await res.json();
    let responseHTML = `<h1>${statusStruct[res.status]}</h1>`;
    responseHTML += `<p>${json.message}</p>`;
    content.innerHTML = responseHTML;
    return;
  } 
  window.location.href = `./game?name=${nameField.value}`;
};

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
  const createForm = document.querySelector('#createLobby');
  const refreshButton = document.querySelector('#refreshButton');
  const lobbySelect = document.querySelector('#joinLobby');
  const joinButton = document.querySelector('#joinButton');

  createForm.addEventListener('submit', (event) => {
    createLobby(createForm);
    event.preventDefault();
  });
  refreshButton.addEventListener('click', () => {
    updateLobbys();
  });
  joinButton.addEventListener('click', () => {
    if (lobbySelect.value) {
      window.location.href = `./game?name=${lobbySelect.value}`;
    }
  });

  updateTitleInterval = setInterval(updateTitle, 700);

  updateLobbys();
};

window.onload = init;
