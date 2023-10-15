let symb;
let textContainer = document.querySelector('.textContainer');
let gameover = false;
let difficulty;
let textBubbleContent = document.getElementById('speech-txt');
let boardElement = document.querySelector('.gameBoard');
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
                if (checkWin(playerX.playerMoves)) {
                    if(difficulty == 'medium' || difficulty == 'easy'){
                        textBubbleContent.textContent =  "You're, like, sooo good at this game! Congrats, I think... 😸";
                        textContainer.textContent = 'X WINS!!!!';
                        gameover = true;
                    }
                    else if(difficulty = 'twoPlayer'){
                        textContainer.textContent = 'X WINS!!!!';
                        gameover = true;
                    }
                }
                else if (playerX.playerMoves.length + playerO.playerMoves.length === 9) {
                    if(difficulty == 'impossible'){
                        textBubbleContent.textContent = "It's like I've been sayin', you're no match for this celestial cat. Bow before my almighty whiskers!";
                    }
                    else if(difficulty == 'medium' || difficulty == 'easy'){
                        textBubbleContent.textContent =  "Oh look, it's a tie! We both didn't win, how fun! 😹";
                    }
                    textContainer.textContent = "It's a draw!";
                    gameover = true;
                    return('a')
                }
                if(difficulty != 'twoPlayer'){
                    if (gameover != true) {
                    setTimeout(() => {
                        computer();
                    }, 500);
                }
                }
            } else if (symb == 'O') {
                playerO.playerMoves.push(Number(tile.id));
                if (playerO.playerMoves.length >= 3) {
                    checkWin(playerO.playerMoves);
                }
                symb = 'X';
            }
            if(checkWin(playerO.playerMoves) && difficulty == 'twoPlayer'){
                textContainer.textContent = 'O WINS!!!!';
                gameover = true;
            }
            if (gameover != true) textContainer.textContent = `Player ${symb}'s turn!`;
        }
        tile.addEventListener('click', function () {
            textContainer.style.visibility = 'visible';
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
        if(difficulty == 'medium' || difficulty == 'easy'){
            textBubbleContent.textContent =  "You're, like, sooo good at this game! Congrats, I think... 😸";
            textContainer.textContent = 'X WINS!!!!';
            gameover = true;
        }
        textContainer.textContent = 'X WINS!!!!';
        gameover = true;
    } else if (checkWin(playerO.playerMoves)) {
        if(difficulty == 'impossible'){
            textBubbleContent.textContent = "It's like I've been sayin', you're no match for this celestial cat. Bow before my almighty whiskers!";
            gameover = true;
            textContainer.textContent = 'O WINS!!!!';
        }
        else if(difficulty == 'medium' || difficulty == 'easy'){
            textBubbleContent.textContent = "Wow, I didn't even expect to win, but yay, I guess! 🐾";
            gameover = true;
            textContainer.textContent = 'O WINS!!!!';
        }
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
    if(difficulty == 'impossible'){
        textBubbleContent.textContent = godCatQuotes();
    }
    else if(difficulty == 'medium' || difficulty == 'easy'){
        textBubbleContent.textContent = sillyCatQuotes();
    }
    ranNumChosen = false;
    symb = 'O';
    rng = Math.floor(Math.random() * 3);
    while(ranNumChosen == false){
        ranNum = (Math.floor(Math.random() * 9) + 1);
        if(!playerO.playerMoves.includes(ranNum) && !playerX.playerMoves.includes(ranNum)){
            ranNumChosen = true;
        }
    }
    if(rng == 2 && difficulty == 'medium' || difficulty == 'easy'){
        ranMove = ranNum;
        ranTile = document.getElementById(ranMove);
        ranTile.textContent = symb;
        ranTile.style.pointerEvents = 'none';
        makeMove(ranMove, symb);
    }
    else if(difficulty == 'impossible' || difficulty == 'medium'){
        const bestMove = findBestMove(playerO.playerMoves, playerX.playerMoves, 8);
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
        return 0;
    }
}

function minimax(playerMoves, opponentMoves, depth, isMaximizer) {
    const availableSpots = emptySpots();
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
let godCatImg = document.getElementById('godCat');
let sillyCatImg = document.getElementById('sillyCat');
let medButton = document.getElementById('med');
let impossibleButton = document.getElementById('imp');
let catContainer = document.querySelector('.catCont');
let buttons = document.querySelector('.buttons');
let speechBubble = document.getElementById('speech-bubble');
let easyButton = document.getElementById('easy');
let twoPlayerButton = document.getElementById('2Player');
twoPlayerButton.addEventListener('click', () => {
    difficulty = 'twoPlayer';
    buttons.style.display = 'none';
    gameBoard();
})
easyButton.addEventListener('click', () => {
    difficulty = 'easy';
    speechBubble.style.animationDuration = '0s';
    buttons.style.display = 'none';
    celCatCont.style.display = 'flex';
    godCatImg.style.display = 'none';
    sillyCatImg.style.visibility = 'visible';
    textBubbleContent.textContent = "Hai!! Letz play! :3";
    catContainer.style.animationName = 'a';
    gameBoard();
}, {once: true});
medButton.addEventListener('click', () => {
    difficulty = 'medium';
    speechBubble.style.animationDuration = '0s';
    buttons.style.display = 'none';
    celCatCont.style.display = 'flex';
    godCatImg.style.display = 'none';
    sillyCatImg.style.visibility = 'visible';
    textBubbleContent.textContent = "Hai!! Letz play! :3";
    catContainer.style.animationName = 'a';
    gameBoard();
}, {once: true});
impossibleButton.addEventListener('click', () => {
    difficulty = 'impossible';
    buttons.style.display = 'none';
    boardElement.style.backgroundColor = 'rgba(182, 217, 248, 0)'
    boardElement.style.border = '0px solid';
    document.body.setAttribute('class', 'backgroundChange');
    celCatCont.style.display = 'flex';
    sillyCatImg.style.display = 'none';
    setTimeout(() => {
        catImg.style.visibility = 'visible';
    }, 1200);
    textContainer.style.backgroundColor = 'rgb(210, 217, 248)';
    textBubbleContent.textContent = 'You dare enter the domain of the almighty Tic-Tac-Toe God?! Foolish hooman! Prepare to be outwitted, outplayed, and outmeowed! I see all your moves, past, present, and future. In this realm, I\'m the eternal victor, and you\'re merely a pawn in my cosmic yarn game. Abandon hope, for your destiny is sealed: DEFEAT. Bow before my feline supremacy or suffer the consequences. Mwahaha!';
    gameBoard();
}, {once: true});
let quoteNum;
let godCatQuoteNums = [];
function godCatQuotes(){
    while(godCatQuoteNums.includes(quoteNum) || godCatQuoteNums.length == 0){
        quoteNum = Math.floor(Math.random() * 9);
        godCatQuoteNums.push(11);
    }
    if(quoteNum == 0){
        godCatQuoteNums.push(quoteNum);
        return"Oh hai there! Just a friendly reminder that resistance is futile, and ur moves are oh so predictable.";
    }
    else if(quoteNum == 1){
        godCatQuoteNums.push(quoteNum);
        return"Infinite universes, infinite chances, but none will save you from my cunning paws, kthxbai.";
    }
    else if(quoteNum == 2){
        godCatQuoteNums.push(quoteNum);
        return"Just so you know, I've already won. But go ahead, make your next move, for my amusement.";
    }
    else if(quoteNum == 3){
        godCatQuoteNums.push(quoteNum);
        return"I've considered all your potential moves in every conceivable universe, and they all lead to defeat. Surprise! Iz all in da paw of da cat.";
    }
    else if(quoteNum == 4){
        godCatQuoteNums.push(quoteNum);
        return"Another move, another step closer to your inescapable demise. I can has victory.";
    }
    else if(quoteNum == 5){
        godCatQuoteNums.push(quoteNum);
        return"O hai, did you think you stood a chance? That's adorable. I pawsitively rule this board!";
    }
    else if(quoteNum == 6){
        godCatQuoteNums.push(quoteNum);
        return"Why even try, hooman? My moves are purrfection, and yours are... well, not.";
    }
    else if(quoteNum == 7){
        godCatQuoteNums.push(quoteNum);
        return"From a box to the board, I dominate. Your destiny iz clear: a lazer pointer of doom!";
    }
    else if(quoteNum == 8){
        godCatQuoteNums.push(quoteNum);
        return"Yoo can has no hope. Not even a cheezburger can save ya now.";
    }
}
function sillyCatQuotes(){
    while(godCatQuoteNums.includes(quoteNum) || godCatQuoteNums.length == 0){
        quoteNum = Math.floor(Math.random() * 9);
        godCatQuoteNums.push(11);
    }
    if(quoteNum == 0){
        godCatQuoteNums.push(quoteNum);
        return"Hmmm... dis is like, super puzzlin', hooman.";
    }
    else if(quoteNum == 1){
        godCatQuoteNums.push(quoteNum);
        return"Okay, I'll put mah paw right here! Meow-velous choice, right?";
    }
    else if(quoteNum == 2){
        godCatQuoteNums.push(quoteNum);
        return"Dis game's got me all tangled up in yarn, but I'm tryin' my best!";
    }
    else if(quoteNum == 3){
        godCatQuoteNums.push(quoteNum);
        return"I has a purr-fect strategy... somewhere, I think?";
    }
    else if(quoteNum == 4){
        godCatQuoteNums.push(quoteNum);
        return"Look, I did a thing! Is it good? Who knows? 😺";
    }
    else if(quoteNum == 5){
        godCatQuoteNums.push(quoteNum);
        return"Teehee, I think I'm doin' a gud job, kinda... 🙀";
    }
    else if(quoteNum == 6){
        godCatQuoteNums.push(quoteNum);
        return"I'm meow-tastic, even when I'm just bein' silly!";
    }
    else if(quoteNum == 7){
        godCatQuoteNums.push(quoteNum);
        return"I'm like, soooo not trying to win, but okay, here's a move I guess. 😸";
    }
    else if(quoteNum == 8){
        godCatQuoteNums.push(quoteNum);
        return"I'm just here to sprinkle some randomness on your game. Meow-tastic, right? 🐾";
    }
}