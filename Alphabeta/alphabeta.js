var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

let history
var stepNumber = 0;

// history.concat(Array(9).fill(1))


const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	history = [Array.from(Array(9).keys())]
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

 function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		history = history.slice(0, stepNumber+1);
		// console.log("square.target.id" , square.target.id)
		turn(square.target.id, huPlayer)
		stepNumber++;
		addButton(stepNumber, square.target.id)
		// console.log(history)
		if (!checkWin(origBoard, huPlayer) && !checkTie()){
			let t = bestSpot();
			// console.log(t)
			turn(t, aiPlayer);
			stepNumber++;
			addButton(stepNumber, t)
		} 
		
	}
}


function addButton(s, value) {
	var btn = document.createElement("BUTTON");  //<button> element
	var t = document.createTextNode(stepNumber +" Go to move #"+ value); // Create a text node
	btn.appendChild(t);   
	btn.onclick = function(){setState(s)};  
	document.getElementById("myView").appendChild(btn);
  }

function setState(setValue){
	stepNumber = setValue;
	console.log(setValue, history[setValue])
	for(let  i=0; i<9; i++ ){
		if(typeof history[setValue][i]  !== 'number')
			document.getElementById(i).innerText =  history[setValue][i];
		else
			document.getElementById(i).innerText =  '';
	}
	origBoard = history[setValue]

}


function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	history.push(Array.from(origBoard))
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
    // console.log("plays" , plays)
	
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
        // console.log("win" , index,  win)
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(newBoard) {
	return newBoard.filter(s => typeof s == 'number');
}


function bestSpot() {
	// return minimax(origBoard, aiPlayer).index;
	// console.log(minimax(origBoard, aiPlayer))
    // console.log(minimax(origBoard, aiPlayer).index)
    return minimax(origBoard, aiPlayer, 0, -10000, 10000).index;
}
// function bestSpot(){
//     return emptySquares()[0];
// }

function checkTie() {
	if (emptySquares(origBoard).length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

const MAX_DEPTH = 5;

function minimax(newBoard, player, depth, alpha, beta) {

	var availSpots = emptySquares(newBoard);
	var bestMove;
	var bestMove = {};
	var move = {};

    console.log("[Dept : "+ depth , "newBoard" ,newBoard, "player",player +" ]")
	if (checkWin(newBoard, huPlayer)) {
		return {score: -10+depth};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10-depth};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < availSpots.length; i++) {
			newBoard[availSpots[i]] = player;
			move.index = availSpots[i];
			var result = minimax(newBoard,huPlayer, depth+1, alpha, beta );
			move.score = result.score;
			newBoard[availSpots[i]] = move.index;
			if(move.score >bestScore){
				bestScore = move.score;
				bestMove.index = move.index;
				bestMove.score = bestScore;
			}
			alpha = Math.max(alpha,bestScore);
            if(beta <= alpha){
                break;    
			}

		}
		return bestMove;
	} else {
		var bestScore = 10000;
		for(var i = 0; i < availSpots.length; i++) {
			newBoard[availSpots[i]] = player;
			move.index = availSpots[i];
			var result = minimax(newBoard,aiPlayer, depth+1, alpha, beta );
			move.score = result.score;
			newBoard[availSpots[i]] = move.index;
			if(move.score < bestScore){
				bestScore = move.score;
				bestMove.index = move.index;
				bestMove.score = bestScore;
			}
			beta = Math.min(beta,bestScore);
            if(beta <= alpha){
                break;   
			}
		}
        console.log("[Return] bestMove : " , bestMove)
		return bestMove;
	}
}

