const statusStruct = {
  200: 'Success',
  201: 'Created',
  400: 'Bad Request',
};

const handleResPost = async (res) => {
  const content = document.querySelector('#content');

  if (res.status === 400) {
    const json = await res.json();
    let responseHTML = `<h1>${statusStruct[res.status]}</h1>`;
    responseHTML += `<p>${json.message}</p>`;
    content.innerHTML = responseHTML;
    return;
  } window.location.href = './game.html';
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

  handleResPost(res);
};

const init = () => {
  const createLobby = document.querySelector('#createLobby');

  createLobby.addEventListener('submit', (event) => {
    sendPost('/createLobby', createLobby);
    event.preventDefault();
  });
};

window.onload = init;
