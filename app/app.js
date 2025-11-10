const socket = io('ws://localhost:3500');

let meuID = null; // meuID unico, usado para saber quem eu sou no server
let meuTurno = true; // usado para saber se é meu turno ou não de agir

// gera os navios
let meusNavios = inicializarBatalhao(); 
let naviosRestantes = meusNavios.length;
let hitsInimigos = 0;
const enemyTotalShips = meusNavios.length;

// pinta os meu barcos de verde no tabuleiro
function paintMyShips() {
    for (const [row, col] of meusNavios) {
        const coord = String.fromCharCode(64 + row) + col; 
        const cell = document.querySelector(`#seu${coord}`);
        if (cell) cell.style.backgroundColor = "green";
    }
}

// inicio da conexão, define meu id e meus barcos
socket.on("connect", () => {
    meuID = socket.id;
    paintMyShips();
});


// parte responsavel pelo click no tabuleiro do inimigo e a enviar a coordenada clickada
document.querySelectorAll('[id^="inimigo"]').forEach(cell => {
    cell.addEventListener("click", () => {
        if (!meuTurno) return;
        const coord = cell.id.replace("inimigo", "");
        socket.emit('message', coord);
    });
});

// atualiza ambos os tabuleiros
function updateBoard(data) {
    const cell = data.text.toUpperCase();
    const isMine = data.id === meuID;

    let selector = isMine ? `#inimigo${cell}` : `#seu${cell}`;
    const square = document.querySelector(selector);
    if (!square) return;

    // checa se houve um HIT
    let hit = false;
    for (const [row, col] of meusNavios) {
        const coord = String.fromCharCode(64 + row) + col;
        if (coord === cell) hit = true;
    }

    // se foi hit e não foi eu
    if (hit && !isMine) {
        // inimigo me deu hit
        square.style.backgroundColor = "black"; 
        socket.emit('message', `Hit${square.id.slice(3)}`); // emite a mensagem que eu fui acertado, usada para pintar e dar turno no tabuleiro do inimigo
        naviosRestantes--; //diminui os meu barcos restantes

        if (naviosRestantes <= 0) {
            socket.emit('message', "Eu perdi!");
            alert("Você perdeu!");
            socket.disconnect();
        }

        return;
    }

    // Errou
    square.style.backgroundColor = "red";
}

// exibi as mensagens, aplica os updates no tabuleiro e retorna os hits e condição de ganhar
socket.on("message", (data) => {
    const isMine = data.id === meuID;
    meuTurno = !isMine;
    console.log(data.text, data.text.slice(3), data.text.slice(0, 3))
    // Veja se o inimigo perdeu
    if (data.text === "Eu perdi!" && !isMine) {
        alert("GANHEI!");
        socket.disconnect();
        return; // para o processo inteiro
    }

    // se a mensagem começa com o hit quer dizer que eu acertei logo pinte o lugar onde eu acertei e eu continuo
    if (data.text.slice(0, 3) === "Hit" && !isMine) {
        const coord = data.text.slice(3);
        const square = document.querySelector(`#inimigo${coord}`);
        if (square) square.style.backgroundColor = "orange";
    }

    // manda o data (que provavelmente é uma coordenada) que dependendo do meu turno vai ser o meu ou o tabuleiro do meu inimigo que vai ser pintado
    updateBoard(data);

    // atualiza a lista(ul) do html com as mensagens
    const lista = document.createElement('li');
    lista.textContent = data.id.substring(0,5) + ": " + data.text;
    document.querySelector('ul').appendChild(lista);
});
