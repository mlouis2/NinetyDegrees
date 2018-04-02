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

          //draw flip button
          ctx.fillStyle = 'black';
          ctx.fillRect(this.size + this.offset, this.buttonY, this.flipButtonWidth, this.flipButtonWidth);
          let turnArrows = new Image();
          turnArrows.src = "./images/turnArrows.png";
          ctx.drawImage(turnArrows, this.size + this.offset , this.buttonY, this.flipButtonWidth, this.flipButtonWidth);

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

     print(grid) {

          let result = "";
          for (let row = 0; row < game.gridSize; row++) {
               for (let col = 0; col < game.gridSize; col++) {
                    result += grid[col][row] + " ";
               }
               result += "\n";
          }

          console.log(result);

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
     checkHorizontals(grid) {
          let horizontalRunCount = 0;
          for (let col = 0; col < game.gridSize; col++) {
               for (let row = 0; row < game.gridSize - 1; row++) {
                    if (grid[row][col] != 0 && grid[row][col] == grid[row + 1][col]) {
                         horizontalRunCount++;
                    } else {
                         horizontalRunCount = 0;
                    }
                    if (horizontalRunCount >= (game.numToWin -1)) {
                         return grid[row][col];
                    }
               }
               horizontalRunCount = 0;
          }
          return 0;
     }
     checkVerticals(grid) {
          let verticalRunCount = 0;
          for (let row = 0; row < game.gridSize; row++) {
               for (let col = 0; col < game.gridSize - 1; col++) {
                    if (grid[row][col] != 0 && grid[row][col] == grid[row][col + 1]) {
                         verticalRunCount++;
                    } else {
                         verticalRunCount = 0;
                    }
                    if (verticalRunCount >= (game.numToWin -1)) {
                         return grid[row][col];
                    }
               }
               verticalRunCount = 0;
          }
          return 0;
     }

     checkGrid(grid) {
          for (let list of grid) {
               if (this.checkList(list) !== 0) {
                    return this.checkList(list);
               }
          }
          return 0;
     }

     checkList(list) {
          let run = 0;
          for (let x = 0; x < list.length - 1; x++) {
               if (list[x] !== 0 && list[x] === list[x+1]) {
                    run++;
               } else {
                    run = 0;
               }
               if (run >= (game.numToWin - 1)) {
                    return list[x];
               }
          }
          return 0;
     }

     checkDiagonals() {
          let diagonals = this.getDiagonals();
          return this.checkGrid(diagonals);
     }

     getDiagonals() {
          let diagonals = [];

          for (let row = game.gridSize - 1; row >= 0; row--) {
               let currRow = row;
               let currCol = 0;
               let diagonal = [];
               while(this.isValidPosition(currRow, currCol)) {
                    diagonal.push(this.grid[currRow][currCol]);
                    currRow += 1;
                    currCol += 1;
               }
               diagonals.push(diagonal);
          }

          for (let col = 0; col <= game.gridSize; col++) {
               let currRow = 0;
               let currCol = col;
               let diagonal = [];
               while(this.isValidPosition(currRow, currCol)) {
                    diagonal.push(this.grid[currRow][currCol]);
                    currRow += 1;
                    currCol += 1;
               }
               diagonals.push(diagonal);
          }

          for (let row = game.gridSize - 1; row >= 0; row--) {
               let currRow = row;
               let currCol = 0;
               let diagonal = [];
               while(this.isValidPosition(currRow, currCol)) {
                    diagonal.push(this.grid[currRow][currCol]);
                    currRow -= 1;
                    currCol += 1;
               }
               diagonals.push(diagonal);
          }

          for (let col = 0; col <= game.gridSize; col++) {
               let currRow = game.gridSize - 1;
               let currCol = col;
               let diagonal = [];
               while(this.isValidPosition(currRow, currCol)) {
                    diagonal.push(this.grid[currRow][currCol]);
                    currRow -= 1;
                    currCol += 1;
               }
               diagonals.push(diagonal);
          }

          return diagonals;
     }

     isValidPosition(row, col) {
        return ((row < game.gridSize && col < game.gridSize) && (row >= 0 && col >=0));
     }

     checkWin() {

          let potentialWinner = 0;

          potentialWinner = this.checkVerticals(this.grid);
          if (potentialWinner !== 0) {
               console.log("regular vertical");
               return potentialWinner;
          }
          potentialWinner = this.checkHorizontals(this.grid);
          if (potentialWinner !== 0) {
               console.log("regular horizontal");
               return potentialWinner;
          }

          potentialWinner = this.checkDiagonals(this.grid);
          if (potentialWinner !== 0) {
               console.log("diagonal");
               return potentialWinner;
          }


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

let numPlayers = 2;
let playerNames = [];
for (let i = 1; i < numPlayers + 1; i++) {
     playerNames.push(prompt("What is player " + i + "\'s name?"))
}

let game = new Game(numPlayers, playerNames);
let mouse = {x: 0, y: 0};
let board = new Board();
board.drawBackground();
board.draw();
