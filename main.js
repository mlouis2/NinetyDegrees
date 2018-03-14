//Ninety Degrees
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class Game {
     constructor(numPlayers, playerNames) {
          this.gameOver = false;
          this.gridSize = 9;
          this.numToWin = 5;
          this.numPlayers = numPlayers;
          this.playerNames = playerNames;
          this.players = [];
          for (let i = 1; i < numPlayers + 1; i++) {
               this.players.push(new Player(i, playerNames[i - 1]));
          }

          this.currentPlayerIndex = 0;
     }
}

class Board {
     constructor() {
          this.pieceRadius = 20;
          this.offset = 50;
          this.size = (50 * game.gridSize) + 10;
          this.buttonWidth = 40;
          this.flipButtonWidth = 50;
          this.buttonY = 10;
          this.buttonSpacing = 10;
          this.textY = 120;

          this.grid = this.createEmptyGrid();
          this.pieceColors = ['white', 'blue', 'yellow', 'green', 'red'];
     }
     drawBackground() {
          ctx.fillStyle = 'black';
          //draw background
          ctx.fillRect(this.offset, this.offset, this.size, this.size);

          let downArrow = new Image();
          downArrow.src = "./images/downArrow.png";

          //draw buttons
          for (let x = 0; x < game.gridSize; x++) {
               ctx.fillStyle = 'black';
               ctx.fillRect((this.offset * x) + this.offset + this.buttonSpacing, this.buttonY, this.buttonWidth, this.buttonWidth);
               ctx.drawImage(downArrow, (this.offset * x) + this.offset + this.buttonSpacing, this.buttonY, this.buttonWidth, this.buttonWidth);
          }

          //draw flip button
          ctx.fillStyle = 'black';
          ctx.fillRect(this.size + this.offset, this.buttonY, this.flipButtonWidth, this.flipButtonWidth);
          let turnArrows = new Image();
          turnArrows.src = "./images/turnArrows.png";
          ctx.drawImage(turnArrows, this.size + this.offset, this.buttonY, this.flipButtonWidth, this.flipButtonWidth);

          ctx.fillStyle = "black";
          ctx.font = '100px Passero One';
          ctx.fillText("Ninety Degrees", this.offset, this.size + (this.offset * 3));

     }
     printWinText(winNum) {
          ctx.fillStyle = "white";
          ctx.fillRect(this.size + (this.offset), this.textY- this.offset, 400, 400);
          ctx.fillStyle = 'black';
          ctx.fillText(game.playerNames[winNum - 1].toUpperCase() + " has won!", this.size + (this.offset * 2), (this.textY));
          game.gameOver = true;
     }
     draw() {
          for (let i = 0; i < game.gridSize; i++) {
               for (let j = 0; j < game.gridSize; j++) {
                    ctx.fillStyle = this.pieceColors[this.grid[i][j]];
                    ctx.beginPath();
                    ctx.arc(this.offset + (i * this.offset) + this.buttonSpacing + this.pieceRadius, this.offset + (j * this.offset) + this.buttonY + this.pieceRadius, this.pieceRadius, 0, 2 * Math.PI, true);
                    ctx.fill();
               }
          }

          //Whose turn it is
          ctx.fillStyle = "white";
          ctx.fillRect(this.size + (this.offset), this.textY- this.offset, 400, 400);
          ctx.fillStyle = "black";
          ctx.font = '50px Passero One';
          ctx.fillText((game.playerNames[game.currentPlayerIndex]).toUpperCase() + "\'s turn!", this.size + (this.offset * 2), this.textY);

     }

     findSpot(col, playerNumber) {
          for (let i = game.gridSize - 1; i >= 0; i--) {
               if (this.grid[col][i] === 0) {
                    this.grid[col][i] = playerNumber;
                    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.numPlayers;
                    this.draw();
                    break;
               }
          }
     }

     createEmptyGrid() {
          let result = [[]];
          for (let i = 0; i < game.gridSize; i++) {
               result[i] = [];
               for (let j = 0; j < game.gridSize; j++) {
                    result[i][j] = 0;
               }
          }

          // //FOR TESTING
          // result[0][1] = 1;
          // result[1][2] = 1;
          // result[2][3] = 1;
          // result[3][4] = 1;
          // result[4][5] = 1;
          // //FOR TESTING

          return result;
     }

     rotate(board) {
          for (let x = 0; x < game.gridSize; x++) {
               for (let y = 0; y < game.gridSize; y++) {
                    board[y][x] = this.grid[x][game.gridSize - y - 1];
               }
          }
          return board;
     }

     shiftPieces(board) {
          for (let i = 0; i < game.gridSize; i++) {
               board[i] = board[i].filter(num => num !== 0);
          }

          for (let i = 0; i < game.gridSize; i++) {
               while (board[i].length < game.gridSize) {
                    board[i].unshift(0);
               }
          }
          return board;
     }

     flip() {

          let turnedBoard = this.createEmptyGrid();

          turnedBoard = this.rotate(turnedBoard);

          turnedBoard = this.shiftPieces(turnedBoard);

          game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.numPlayers;
          this.grid = turnedBoard;
          this.draw();
     }
     checkWin() {
          //check horizontals and verticals
          let horizontalRunCount = 0, verticalRunCount = 0;
          let verticalWinner = 0, horizontalWinner = 0;
          for (let i = 0; i < game.gridSize; i++) {
               for (let j = game.gridSize - 1; j > 1; j--) {
                    if ((this.grid[i][j] !== 0) && (this.grid[i][j] === this.grid[i][j - 1])) {
                         horizontalRunCount++;
                         horizontalWinner = this.grid[i][j];
                    }
                    if ((this.grid[j][i] !== 0) && (this.grid[j][i] === this.grid[j - 1][i])) {
                         verticalRunCount++;
                         verticalWinner = this.grid[j][i];
                    }
               }
               if (verticalRunCount >= game.numToWin - 1) {
                    return verticalWinner;
               }
               if (horizontalRunCount >= game.numToWin - 1) {
                    return horizontalWinner;
               }
               verticalWinner = 0;
               horizontalWinner = 0;
               horizontalRunCount = 0;
               verticalRunCount = 0;
          }

          // let diagRunCount = 0;
          // let diagWinner = 0;
          let majorDiagRunCount = 0;
          let minorDiagRunCount = 0;
          let minorDiagWinner = 0;
          let majorDiagWinner = 0;


          //check first diagonal \
          // for (let x = 0; x < game.gridSize - 1; x++) {
          //      for (let y = 0; y < game.gridSize - 1; y++) {
          //           if (this.grid[y + x][y + x] !== 0 && this.grid[y + x][y + x] === this.grid[y + x + 1][y + x + 1]) {
          //                diagRunCount++;
          //                console.log('current diagRunCount is ' + diagRunCount);
          //                diagWinner = this.grid[y + x][y + x];
          //           }
          //      }
          //      if (diagRunCount >= game.numToWin - 1) {
          //           return diagWinner;
          //      }
          //      diagRunCount = 0;
          //      diagWinner = 0;
          // }

          //check second diagonal \


          return 0;
     }
}

class Player {
     constructor(playerNumber, name) {
          this.playerNumber = playerNumber;
          this.name = name;
     }
     placePiece() {
          let pieceCol = 0;
          for (let x = 0; x < game.gridSize; x++) {
               if (mouse.x > (x * board.offset) + 70 && mouse.x < (x * board.offset) + 110) {
                    pieceCol = x;
                    board.findSpot(pieceCol, this.playerNumber);
                    break;
               }
          }
     }
}

document.body.addEventListener("click", mouseClick);

function mouseClick(event) {
     mouse.x = event.clientX;
     mouse.y = event.clientY;
     if (game.gameOver === false) {
          if (mouse.y > 60 && mouse.y < (60 + board.size)) {
               if (mouse.x > 60 && mouse.x < 660) {
                    game.players[game.currentPlayerIndex].placePiece();
                    if (board.checkWin() !== 0) {
                         board.printWinText(board.checkWin());
                    }
               }
          }
          if (mouse.y > 10 && mouse.y < 70) {
               if (mouse.x > (board.offset + board.size + 10) && mouse.x < (board.offset + board.size + 60)) {
                    board.flip();
                    if (board.checkWin() !== 0) {
                         board.printWinText(board.checkWin());
                    }
               }
          }
     }
}

// let numPlayers = parseInt(prompt("How many players? (2-4)"));
// let playerNames = [];
// for (let i = 1; i < numPlayers + 1; i++) {
//      playerNames.push(prompt("What is player " + i + "\'s name?"))
// }

// let numPlayers = 4;
// let playerNames = ["Maddie", "Leigh", "Merissa", "Ryan"];

let numPlayers = 2;
let playerNames = ["Maddie", "Leigh"];

let game = new Game(numPlayers, playerNames);
let mouse = {x: 0, y: 0};
let board = new Board();
board.drawBackground();
board.draw();
