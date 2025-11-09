function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function origemDoNavio (limiteX, limiteY) {
    let coordenadaOrigemX = getRandomInt(limiteX, limiteY)
    let coordenadaOrigemY = getRandomInt(limiteX, limiteY)
    let origem = [coordenadaOrigemX, coordenadaOrigemY]
    
    return origem
}

function navio3Espacos () {

    let origem = origemDoNavio(3, 8)
    let centro = origem
    let final = origem
    let direcao = getRandomInt(1,4)

    switch (direcao) {
        case 1:
            centro = [origem[0]+1, origem[1]]
            final =[origem[0]+2, origem[1]]
            break
        case 2:
            centro = [origem[0]-1, origem[1]]
            final =[origem[0]-2, origem[1]]
            break
        case 3:
            centro = [origem[0], origem[1]+1]
            final =[origem[0], origem[1]+2]
            break
        case 4:
            centro = [origem[0], origem[1]-1]
            final =[origem[0], origem[1]-2]
            break
    }

    return [origem, centro, final]
}

function navio2Espacos () {

    let origem = origemDoNavio(2, 9)
    let final = origem
    let direcao = getRandomInt(1,4)

    switch (direcao) {
        case 1:
            final =[origem[0]+1, origem[1]]
            break
        case 2:
            final =[origem[0]-1, origem[1]]
            break
        case 3:
            final =[origem[0], origem[1]+1]
            break
        case 4:
            final =[origem[0], origem[1]-1]
            break
    }

    return [origem, final]
}

function navio1Espacos () {
    let origem = origemDoNavio(1, 10)
    return origem
}

function inicializarBatalhao () {
        let [navio3Pos1, navio3Pos2, navio3Pos3] = navio3Espacos()
        const navio3 = [navio3Pos1, navio3Pos2, navio3Pos3]

        let conflito = true

        while (conflito) {
        let [n2p1, n2p2] = navio2Espacos()
        navio2 = [n2p1, n2p2]

        navio1 = [navio1Espacos()]

        conflito = false

        // verifica navio2 vs navio3
        for (let i = 0; i < navio2.length; i++) {
            for (let j = 0; j < navio3.length; j++) {
                if (navio2[i][0] === navio3[j][0] && navio2[i][1] === navio3[j][1]) {
                    conflito = true
                }
            }
        }

        // verifica navio1 vs navio3
        for (let i = 0; i < navio1.length; i++) {
            for (let j = 0; j < navio3.length; j++) {
                if (navio1[i][0] === navio3[j][0] && navio1[i][1] === navio3[j][1]) {
                    conflito = true
                }
            }
        }

        // verifica navio1 vs navio2
        for (let i = 0; i < navio1.length; i++) {
            for (let j = 0; j < navio2.length; j++) {
                if (navio1[i][0] === navio2[j][0] && navio1[i][1] === navio2[j][1]) {
                    conflito = true
                }
            }
        }
    }

    const batalhao = navio3.concat(navio2, navio1)
    return batalhao
}

console.log(inicializarBatalhao())