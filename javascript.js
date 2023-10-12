//create gameboard object containing gameboard array
let symb;
let textContainer = document.querySelector('.textContainer');
let gameover = false;
function player(symbol, moves){
        const playerSymbol = symbol;
        const playerMoves = moves;
        return { playerSymbol, playerMoves};
    }
    const playerX = player('X', []);
    const playerO = player('O', []);

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
                    winCheck(playerX.playerMoves);
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
function winCheck(examArray){
    console.log('checkStart')
    console.log(examArray);
    let matchedNums = 0;
    const winningMoves = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7],];
    for(i=0; i<8; i++){
        matchedNums = 0;
        for(let moveCheck in examArray){
            if(winningMoves[i].includes(examArray[moveCheck])){
                matchedNums++;
            }
        }
        if (matchedNums > 2){
            gameover = true;
            break;
        }
    }
}
let compArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let ranNum;
function computer(){
    symb = 'O';
    let acceptedNum = false;
    while(acceptedNum == false){
        ranNum = Math.floor(Math.random() * 10);
        if(ranNum != 0 && !playerX.playerMoves.includes(ranNum) && !playerO.playerMoves.includes(ranNum)) acceptedNum = true;
    }
    console.log(ranNum);
    let compTile = document.getElementById(ranNum);
    compTile.textContent = symb;
    playerO.playerMoves.push(ranNum);
    console.log(playerO.playerMoves);
    if((playerO.playerMoves).length >= 3){
        winCheck(playerO.playerMoves);
    }
    symb = 'X';
    compTile.style.pointerEvents = 'none';
    textContainer.textContent = `Player ${symb}'s turn!`;
    if (gameover == true){
        textContainer.textContent = `O WINS!!!!`;
    }
}
const oButton = document.getElementById('oBut');
        oButton.addEventListener('click', () =>{
            computer();
            
        });
gameBoard();
let emptySpotArr;
function emptySpots(){
    emptySpotArr = [];
    for(i=1; i<10; i++){
        if(!playerO.playerMoves.includes(i) && !playerX.playerMoves.includes(i)){
            emptySpotArr.push(i);
        }
    }
    return(emptySpotArr);
}

function minimax(newBoard, player) {
    let availSpots = emptySpots();
}
function boardAscii(){
    let boardAsciiArr = [];
    let rowNum = 0;
    for(i=0;i<3;i++){
        let arrRow = [];
        for(a=1;a<4;a++){
            if(playerO.playerMoves.includes(a+rowNum)){
                arrRow.push('O');
            }
            else if(playerX.playerMoves.includes(a+rowNum)){
                arrRow.push('X');
            }
            else{
                arrRow.push('-');
            }
            
            
        }
        boardAsciiArr.push(arrRow);
        rowNum+= 3;
    }
    return(boardAsciiArr);
}

function evaluate(board){
    for(i=0;i<3;i++){
        if(board[i][0] == board[i][1] && board[i][1] == board[i][2]){
            if(board[i][0] == "O"){
            return +10;
            }
            else if(board[i][0] == "X"){
                return -10;
            }
        }
    }
    for(x=0;x<3;x++){
        if(board[0][x] == board[1][x] && board[1][x] == board[2][x]){
            if(board[0][x] == "O"){
                return +10;
                }
                else if(board[0][x] == "X"){
                    return -10;
                }
        }
    }
    if(board[0][0] == board[1][1] && board[1][1] == board[2][2]){
        if(board[0][0] == "O"){
            return +10;
        }
        else if(board[0][0] == "X"){
            return -10;
        }
    }
    if(board[0][2] == board[1][1] && board[1][1] == board[2][0]){
        if(board[0][2] == "O"){
            return +10;
        }
        else if(board[0][2] == "X"){
            return -10;
        }
    }
    return 0;
}
let boardValue = (evaluate(boardAscii()));
