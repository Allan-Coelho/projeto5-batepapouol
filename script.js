let messages = [];
const apiURL = "https://mock-api.driven.com.br/api/v6/uol/";


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
    promise.then((x) => {
      console.log(x)
    });
  }

main();
function main() {
  refreshMessages();
  console.log(messages);
}

