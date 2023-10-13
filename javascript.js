let symb;
let textContainer = document.querySelector('.textContainer');
let gameover = false;
let difficulty = 'impossible';
function curPlayer(symbol, moves) {
    const playerSymbol = symbol;
    const playerMoves = moves;
    return { playerSymbol, playerMoves };
}
const playerX = curPlayer('X', []);
const playerO = curPlayer('O', []);
const gameBoard = () => {
    let boardArr = [];
    for (let i = 1; i < 10; i++) {
        boardArr.push('');
    }
    symb = 'X';
    let boardElement = document.querySelector('.gameBoard');
    for (let tileNum in boardArr) {
        let tile = document.createElement('div');
        tile.setAttribute('id', `${Number(tileNum) + 1}`);
        tile.setAttribute('class', 'tile');
        function tileClick() {
            if (gameover == true) {
                return '';
            }
            tile.textContent = symb;
            tile.style.animationName = 'addSymbol';
            if (symb == 'X') {
                playerX.playerMoves.push(Number(tile.id));
                if (playerX.playerMoves.length >= 3) {
                    checkWin(playerX.playerMoves);
                }
                symb = 'O';
                if (playerX.playerMoves.length + playerO.playerMoves.length === 9) {
                    textContainer.textContent = "It's a draw!";
                    gameover = true;
                }
                if (gameover != true) {
                    setTimeout(() => {
                        computer();
                    }, 500);
                }
            } else if (symb == 'O') {
                playerO.playerMoves.push(Number(tile.id));
                if (playerO.playerMoves.length >= 3) {
                    winCheck(playerO.playerMoves);
                }
                symb = 'X';
            }
            if (gameover != true) textContainer.textContent = `Player ${symb}'s turn!`;
        }
        tile.addEventListener('click', function () {
            tileClick();
        }, {
            once: true
        });
        boardElement.appendChild(tile);
    }
};
function makeMove(tileId, symbol) {
    if (symbol == 'X') {
        playerX.playerMoves.push(tileId);
    } else {
        playerO.playerMoves.push(tileId);
    }
    if (checkWin(playerX.playerMoves)) {
        textContainer.textContent = 'X WINS!!!!';
        gameover = true;
    } else if (checkWin(playerO.playerMoves)) {
        textContainer.textContent = 'O WINS!!!!';
        gameover = true;
    } else if (playerX.playerMoves.length + playerO.playerMoves.length === 9) {
        textContainer.textContent = "It's a draw!";
        gameover = true;
    } else {
        symb = symb === 'X' ? 'O' : 'X';
        textContainer.textContent = `Player ${symb}'s turn!`;
        if (symb === 'O') {
            computer();
        }
    }
}
let ranNum; 
let rng;
let ranMove;
let ranTile;
let ranNumChosen;

function checkWin(moves) {
    const winningMoves = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    return winningMoves.some((combo) => combo.every((move) => moves.includes(move)));
}

function computer() {
    ranNumChosen = false;
    symb = 'O';
    rng = Math.floor(Math.random() * 3);
    while(ranNumChosen == false){
        ranNum = (Math.floor(Math.random() * 9) + 1);
        if(!playerO.playerMoves.includes(ranNum) && !playerX.playerMoves.includes(ranNum)){
            ranNumChosen = true;
        }
    }
    if(rng == 2 && difficulty == 'medium'){
        ranMove = ranNum;
        ranTile = document.getElementById(ranMove);
        ranTile.textContent = symb;
        ranTile.style.pointerEvents = 'none';
        makeMove(ranMove, symb);
    }
        else if(difficulty == 'impossible' || difficulty == 'medium'){
        const bestMove = findBestMove(playerO.playerMoves, playerX.playerMoves, 0);
        const compTile = document.getElementById(bestMove);
        compTile.textContent = symb;
        compTile.style.pointerEvents = 'none';
        makeMove(bestMove, symb);
    }
}

function findBestMove(playerMoves, opponentMoves, depth) {
    const availableSpots = emptySpots();
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < availableSpots.length; i++) {
        const move = availableSpots[i];
        playerMoves.push(move);
        const score = minimax(playerMoves, opponentMoves, depth - 1, false);
        playerMoves.pop();
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}

function evaluate(playerMoves, opponentMoves) {
    const scores = {
        X: -1,
        O: 1,
        draw: 0
    };
    if (checkWin(opponentMoves)) {
        return -scores[symb];
    } else if (checkWin(playerMoves)) {
        return scores[symb];
    } else if (playerMoves.length + opponentMoves.length === 9) {
        return scores.draw;
    } else {
        return 0; // Intermediate score for other situations
    }
}

function minimax(playerMoves, opponentMoves, depth, isMaximizer) {
    const availableSpots = emptySpots();
    const scores = {
        X: -1,
        O: 1,
        draw: 0
    };
    if (depth === 0 || checkWin(playerMoves) || checkWin(opponentMoves) || availableSpots.length === 0) {
        return evaluate(playerMoves, opponentMoves);
    }
    if (isMaximizer) {
        let bestScore = -Infinity;
        for (let i = 0; i < availableSpots.length; i++) {
            const move = availableSpots[i];
            playerMoves.push(move);
            const score = minimax(playerMoves, opponentMoves, depth - 1, false);
            playerMoves.pop();
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < availableSpots.length; i++) {
            const move = availableSpots[i];
            opponentMoves.push(move);
            const score = minimax(playerMoves, opponentMoves, depth - 1, true);
            opponentMoves.pop();
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
}

function emptySpots() {
    const emptySpotsArr = [];
    for (let i = 1; i < 10; i++) {
        if (!playerO.playerMoves.includes(i) && !playerX.playerMoves.includes(i)) {
            emptySpotsArr.push(i);
        }
    }
    return emptySpotsArr;
}
let celCatCont = document.querySelector('.cat');
let catImg = document.querySelector('.catImg');
let medButton = document.getElementById('med');
let impossibleButton = document.getElementById('imp');
medButton.addEventListener('click', () => {
    difficulty = 'medium';
    gameBoard();
}, {once: true});
impossibleButton.addEventListener('click', () => {
    difficulty = 'impossible';
    document.body.setAttribute('class', 'backgroundChange');
    celCatCont.style.display = 'flex';
    setTimeout(() => {
        catImg.style.visibility = 'visible';
    }, 1200);
    textContainer.style.backgroundColor = 'rgb(210, 217, 248)';
    gameBoard();
}, {once: true});
