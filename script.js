let messages = [];
const bodyContainer = document.querySelector(".container");
const apiURL = "https://mock-api.driven.com.br/api/v6/uol/";
/* const username = prompt('Qual o seu nome?'); */

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
function refreshMessages() {
  const promise = axios.get(apiURL + "messages");
  messages = [];
  promise.then((x) => {
    x.data.forEach(function (item) {
      newMessage(item);
    });
  });
}

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

function statusMessage(message) {
  const template = `
  <div class="message status">
    <span class="time">(${message.time})</span>
    <span><span class="bold">${message.from}</span>${message.text}</span>
  </div>`;
  bodyContainer.innerHTML += template;
}

function privateMessage(message) {
  const template = `
  <div class="message private">
    <span class="time">(${message.time})</span>
    <span><span class="bold">${message.from}</span>reservadamente para <span class="bold">${message.to}:</span>${message.text}</span>
  </div>`;
  bodyContainer.innerHTML += template;
}

function renderMessages() {
  bodyContainer.innerHTML = "";
  console.log(messages);
  for (let index = 0, len = messages.length; index < len; index++) {
    newMessage(messages[index]);
    console.log(messages[index]);
  }
}

function newMessage(message) {
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

function main() {
  refreshMessages();
  renderMessages();
}

main();
