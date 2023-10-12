//create gameboard object containing gameboard array
let symb;
let textContainer = document.querySelector('.textContainer');
let gameover = false;
const gameBoard = (() => {
    let boardArr = [];
    for(i=1;i<10;i++){
        boardArr.push('');
    }
    symb = 'X';
    function player(symbol, moves){
        const playerSymbol = symbol;
        const playerMoves = moves;
        return { playerSymbol, playerMoves};
    }
    const playerX = player('X', []);
    const playerO = player('O', []);
    let boardElement = document.querySelector('.gameBoard');
    for(let tileNum in boardArr){
        let tile = document.createElement('div');
        tile.setAttribute('id', `${(Number(tileNum)+1)}`);
        tile.setAttribute('class', 'tile');
        tile.addEventListener('click', () =>{
            if(gameover == true){
                return('');
            }
            tile.textContent = symb;
            if(symb == 'X'){
                playerX.playerMoves.push(Number(tile.id));
                if((playerX.playerMoves).length >= 3){
                    winCheck(playerX.playerMoves);
                }
                symb = 'O';
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
        });
        boardElement.appendChild(tile);
        const xButton = document.getElementById('xBut');
        const oButton = document.getElementById('oBut');
        xButton.addEventListener('click', () =>{
            symb = 'X';
        })
        oButton.addEventListener('click', () =>{
            symb = 'O';
        });
    }
});
function winCheck(examArray){
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
gameBoard();