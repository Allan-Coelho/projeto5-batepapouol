const bodyContainer = document.querySelector(".container");
const apiURL = "https://mock-api.driven.com.br/api/v6/uol/";
let serverMessages = [];
let username = "";
let isOnline = false;

function ping() {
  axios
    .post(apiURL + "status", {
      name: username,
    })
    .then(() => {
      console.log("pingou");
      return;
    })
    .catch((x) => {
      console.log("não pingou");
      console.log(x);
    });
}

/**
 * Essa função retorna um array com as menssagens do servidor;
 * @returns {message[]} Array contendo objetos do tipo message;
 * @returns {Object} message Objeto com as propriedades de uma mensagem;
 * @returns {String} message.from Quem enviou a mensagem;
 * @returns {String} message.to Quem é o destinatário da mensagem;
 * @returns {String} message.text Conteúdo da mensagem;
 * @returns {String} message.type Tipo da mensagem;
 * @returns {String} message.time Quando a mensagem foi enviada;
 */
function refreshServerMessages() {
  const promise = axios.get(apiURL + "messages");
  promise.then(refreshServerThenHandler);
}

//Lida com uma requisição bem sucedida da função que busca as mensagens no servidor;
function refreshServerThenHandler(x) {
  if (serverMessages.length === 0) {
    serverMessages = x.data;
    renderMessages();
    return;
  }

  serverMessages = [];
  serverMessages = x.data;
  renderMessages();
}

//template de mensagem padrão, para todos.
function standardMessage(message) {
  const template = `
  <div class="message standard">
    <p>
      <span class="time">(${message.time})</span>
      <span><span class="bold">${message.from}</span> para <span class="bold">${message.to}</span>${message.text}</span>
    </p>
  </div>`;

  bodyContainer.innerHTML += template;
}

//template mensagem de status
function statusMessage(message) {
  const template = `
  <div class="message status">
    <p>
      <span class="time">(${message.time})</span>
      <span><span class="bold">${message.from}</span>${message.text}</span>
    </p>
  </div>`;
  bodyContainer.innerHTML += template;
}

//Template de mensagens privadas
function privateMessage(message) {
  const template = `
  <div class="message private">
    <p>
      <span class="time">(${message.time})</span>
      <span><span class="bold">${message.from}</span>reservadamente para <span class="bold">${message.to}:</span>${message.text}</span>
    </p>
  </div>`;
  bodyContainer.innerHTML += template;
}

//renderiza uma nova mensagem
function newMessage(message) {
  if (message === undefined) {
    console.log("Essa mensagem não existe");
    return;
  }

  if (message.type === "status") {
    statusMessage(message);
    return;
  }

  if (message.type === "message") {
    standardMessage(message);
    return;
  }

  if (message.type === "private_message") {
    privateMessage(message);
    return;
  }
}

function renderMessages() {
  if (serverMessages.length === 0) {
    console.log("Não há mensagens para renderizar.");
    return;
  }

  bodyContainer.innerHTML = "";
  for (let index = 0, len = serverMessages.length; index < len; index++) {
    if (
      serverMessages[index].to === "Todos" ||
      serverMessages[index].to === username
    )
      newMessage(serverMessages[index]);
  }
  scrollToLastMessage();
}

function scrollToLastMessage() {
  const renderedMessages = bodyContainer.children;
  renderedMessages[renderedMessages.length - 1].scrollIntoView();
}

function joinUser() {
  if (username === "") {
    while (username === "") {
      username = prompt("Qual o seu nome?");
    }
  }

  if (username === null) {
    while (username === null) {
      username = prompt("Por favor, digite um nome para continuar:");
    }
  }

  axios
    .post(apiURL + "participants", {
      name: username,
    })
    .then(() => {
      isOnline = true;
      refreshServerMessages();
      setInterval(refreshServerMessages, 3000);
      setInterval(ping, 5000);
      setupToSendMessages();
    })
    .catch(() => {
      isOnline = false;
      username = prompt(
        "Esse nome de usuário já existe. Por favor, tente outro.\nQual o seu nome?"
      );
      joinUser();
    });
}

function setupToSendMessages() {
  document.addEventListener(
    "keypress",
    function (e) {
      if (e.key === "Enter") {
        sendStandardMessage();
      }
    },
    false
  );
}

function sendStandardMessage() {
  const inputBox = document.querySelector(".footer input");
  const message = String(inputBox.value);

  if (message === "") {
    console.log("mensagem vazia");
    return;
  }

  axios
    .post(apiURL + "messages", {
      from: username,
      to: "Todos",
      text: message,
      type: "message",
    })
    .then(() => {
      refreshServerMessages();
      console.log("Mensagem enviada com sucesso");
    })
    .catch(() => {
      window.location.reload();
    });
  inputBox.value = "";
}

joinUser();
