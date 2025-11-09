const socket = io('ws://localhost:3500');

let myId = null;
let myTurn = false;


socket.on("connect", () => {
  myId = socket.id;
});

function sendMessage(e) {
    e.preventDefault();
    
    const input = document.querySelector('input');
    if (input.value === 'first') {
        myTurn = true
    }
    if (!myTurn) return;
    if (input.value) {
        socket.emit('message', input.value);
        input.value = "";
    }
}

/* vamos esperar o click do botão e ao clickar no butão do form, vamos rodar a função */
document.querySelector('form')
    .addEventListener('submit', sendMessage)

/* faz a parte de mudar a cor do board */
function updateBoard(data) {
    const cell = data.text.toUpperCase(); // like "A5" or "J10"
    const isMine = data.id === myId;

    let selector;

    if (isMine) {
        // I attacked enemy
        selector = `#inimigo${cell}`;
    } else {
        // Enemy attacked me
        selector = `#seu${cell}`;
    }

    const square = document.querySelector(selector);
    if (square) {
        square.style.backgroundColor = "red";
    }
}


/* parte de escutar por mensagens */

socket.on("message", (data) => {
    const isMine = data.id === myId;

    if (isMine) {
        // I attacked, so I must wait
        myTurn = false;
    } else {
        // Enemy attacked, so now it's my turn
        myTurn = true;
    }

    updateBoard(data);

     const lista = document.createElement('li');
    lista.textContent = data.id.substring(0,5) + ": " + data.text;
    document.querySelector('ul').appendChild(lista);
})