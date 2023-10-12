//create gameboard object containing gameboard array
let symb;
let textContainer = document.querySelector('.textContainer');
let gameover = false;
function curPlayer(symbol, moves){
        const playerSymbol = symbol;
        const playerMoves = moves;
        return { playerSymbol, playerMoves};
    }
    const playerX = curPlayer('X', []);
    const playerO = curPlayer('O', []);
const gameBoard = (() => {
    let boardArr = [];
    for(i=1;i<10;i++){
        boardArr.push('');
    }
    symb = 'X';
    let boardElement = document.querySelector('.gameBoard');
    for(let tileNum in boardArr){
        let tile = document.createElement('div');
        tile.setAttribute('id', `${(Number(tileNum)+1)}`);
        tile.setAttribute('class', 'tile');
        function tileClick(){
            if(gameover == true){
                return('');
            }
            tile.textContent = symb;
            tile.style.animationName = ('addSymbol')
            if(symb == 'X'){
                playerX.playerMoves.push(Number(tile.id));
                if((playerX.playerMoves).length >= 3){
                    checkWin(playerX.playerMoves);
                }
                symb = 'O';
                if(gameover != true){
                    setTimeout(() => {
                    computer();
                    }, 500);
                }
            }else if(symb == 'O'){
                playerO.playerMoves.push(Number(tile.id));
                if((playerO.playerMoves).length >= 3){
                    winCheck(playerO.playerMoves);
                }
                symb = 'X';
            }
            textContainer.textContent = `Player ${symb}'s turn!`;
            if(gameover == true){
                if(symb == 'O'){
                    textContainer.textContent = `X WINS!!!!`;
                }else if(symb == 'X'){
                    textContainer.textContent = `O WINS!!!!`;
                }
            }
        }
        tile.addEventListener('click', function() {tileClick()}, {once: true});
        boardElement.appendChild(tile);
    }
});
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
        textContainer.textContent = 'It\'s a draw!';
        gameover = true;
    } else {
        symb = symb === 'X' ? 'O' : 'X';
        textContainer.textContent = `Player ${symb}'s turn!`;
        if (symb === 'O') {
            computer();
        }
    }
}
function checkWin(moves) {
    const winningMoves = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    return winningMoves.some((combo) => combo.every((move) => moves.includes(move)));
}
function computer() {
    symb = 'O';
    const bestMove = findBestMove(playerO.playerMoves, playerX.playerMoves);
    const compTile = document.getElementById(bestMove);
    compTile.textContent = symb;
    makeMove(bestMove, symb);
}
function findBestMove(playerMoves, opponentMoves) {
    const availableSpots = emptySpots();
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < availableSpots.length; i++) {
        const move = availableSpots[i];
        playerMoves.push(move);
        const score = minimax(playerMoves, opponentMoves, false);
        playerMoves.pop();
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}
function minimax(playerMoves, opponentMoves, isMaximizing) {
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
    }
    const availableSpots = emptySpots();
    let bestScore = isMaximizing ? -Infinity : Infinity;
    for (let i = 0; i < availableSpots.length; i++) {
        const move = availableSpots[i];
        if (isMaximizing) {
            playerMoves.push(move);
        } else {
            opponentMoves.push(move);
        }
        const score = minimax(playerMoves, opponentMoves, !isMaximizing);
        if (isMaximizing) {
            bestScore = Math.max(score, bestScore);
        } else {
            bestScore = Math.min(score, bestScore);
        }
        if (isMaximizing) {
            playerMoves.pop();
        } else {
            opponentMoves.pop();
        }
    }
    return bestScore;
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
gameBoard();