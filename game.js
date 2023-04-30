'use strict';

//Canvases
const gameCanvas = document.getElementById('gameCanvas');
const gameContext = gameCanvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextContext = nextCanvas.getContext('2d');
const holdCanvas = document.getElementById('holdCanvas');
const holdContext = holdCanvas.getContext('2d');

//Screens
const gameOverScreen = document.querySelector('.gameOverScreen');
const startGameScreen = document.querySelector('.startGameScreen');

//Buttons
const startGame_btn = document.getElementById('startGame-btn');
const restart_btn = document.getElementById('restart-btn');

//Texts
const score_text = document.getElementById('score');
const level_text = document.getElementById('gameLevel');

const imgSize = 95;
const blockSize = 30;
const numColumns = 10;
const numRows = 20;

//iniatilize gameCanvas size
gameCanvas.width = numColumns * blockSize;
gameCanvas.height = numRows * blockSize;
nextCanvas.width = blockSize * 5;
nextCanvas.height = blockSize * 4;
holdCanvas.width = blockSize * 5;
holdCanvas.height = blockSize * 4;

const images = {
	o_img: document.getElementById('o-img'),
	i_img: document.getElementById('i-img'),
	j_img: document.getElementById('j-img'),
	l_img: document.getElementById('l-img'),
	s_img: document.getElementById('s-img'),
	z_img: document.getElementById('z-img'),
	t_img: document.getElementById('t-img'),
};

class Tetromino {
	//ABSTRACT CLASS

	constructor() {
		if (this.constructor.name === 'Tetromino') {
			throw new Error('Cannot make an instance of this class.');
		}

		this.x = 0;
		this.y = 0;
		this.template;
		this.img;
		this.imageX;
		this.imageY;
		this.frozen = false;
	}

	/**
	 * Abstract Method
	 * A method that will return a new instance of this Class
	 */
	copy() {
		throw new Error('Implement in subclasses');
	}

	draw(context) {
		for (let i = 0; i < this.template.length; i++) {
			for (let j = 0; j < this.template[i].length; j++) {
				if (this.template[i][j] == 1) {
					context.drawImage(
						this.img,
						this.imageX,
						this.imageY,
						imgSize,
						imgSize,
						this.x * blockSize + blockSize * j,
						this.y * blockSize + blockSize * i,
						blockSize,
						blockSize
					);
				}
			}
		}
	}

	checkDown() {
		for (let i = 0; i < this.template.length; i++) {
			for (let j = 0; j < this.template[i].length; j++) {
				if (this.template[i][j] != 0) {
					let yPos = i + this.y;
					let xPos = j + this.x;

					if (yPos + 1 >= numRows || gameMap[yPos + 1][xPos] != 0) return false;
				}
			}
		}
		return true;
	}

	moveDown() {
		this.y++;
	}

	checkRight() {
		for (let i = 0; i < this.template.length; i++) {
			for (let j = 0; j < this.template[i].length; j++) {
				if (this.template[i][j] != 0) {
					let xPos = j + this.x;
					let yPos = i + this.y;

					if (xPos + 1 >= numColumns || gameMap[yPos][xPos + 1] != 0) return false;
				}
			}
		}
		return true;
	}
	moveRight() {
		if (this.checkRight()) this.x++;
	}

	checkLeft() {
		for (let i = 0; i < this.template.length; i++) {
			for (let j = 0; j < this.template[i].length; j++) {
				if (this.template[i][j] != 0) {
					let xPos = j + this.x;
					let yPos = i + this.y;

					if (xPos - 1 < 0 || gameMap[yPos][xPos - 1] != 0) return false;
				}
			}
		}
		return true;
	}

	moveLeft() {
		if (this.checkLeft()) this.x--;
	}

	rotate() {
		let rotatable = true;
		let temp = [];
		for (let i = 0; i < this.template.length; i++) {
			temp.push([]);
		}

		for (let row = 0; row < this.template.length; row++) {
			for (let col = 0; col < this.template[row].length; col++) {
				let newRow = col;
				let newCol = temp.length - 1 - row;
				temp[newRow][newCol] = this.template[row][col];

				if (temp[newRow][newCol] != 0) {
					let yPos = newRow + this.y;
					let xPos = newCol + this.x;

					if (xPos < 0 || xPos >= numColumns || yPos < 0 || yPos >= numRows) rotatable = false;
					if (gameMap[yPos][xPos] != 0) rotatable = false;
				}
			}
		}
		if (rotatable) this.template = temp;
	}

	instantDrop() {
		while (this.checkDown()) {
			this.moveDown();
		}
		this.freeze();
	}

	freeze() {
		if (!this.frozen) {
			for (let i = 0; i < this.template.length; i++) {
				for (let j = 0; j < this.template[i].length; j++) {
					if (this.template[i][j] != 0) {
						let xPos = j + this.x;
						let yPos = i + this.y;

						gameMap[yPos][xPos] = {
							img: this.img,
							imageX: this.imageX,
							imageY: this.imageY,
						};
					}
				}
			}
			this.frozen = true;
		}
	}
}

class O extends Tetromino {
	constructor() {
		super();
		this.imageX = 101;
		this.imageY = 101;
		this.img = images.o_img;
		this.template = [
			[1, 1],
			[1, 1],
		];
	}

	copy() {
		return new O();
	}
}

class L extends Tetromino {
	constructor() {
		super();
		this.imageX = 6;
		this.imageY = 103;
		this.img = images.l_img;
		this.template = [
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0],
		];
	}

	copy() {
		return new L();
	}
}

class J extends Tetromino {
	constructor() {
		super();
		this.imageX = 95;
		this.imageY = 0;
		this.img = images.j_img;
		this.template = [
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0],
		];
	}

	copy() {
		return new J();
	}
}

class I extends Tetromino {
	constructor() {
		super();
		this.imageX = 6;
		this.imageY = 101;
		this.img = images.i_img;
		this.template = [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
	}

	copy() {
		return new I();
	}
}

class S extends Tetromino {
	constructor() {
		super();
		this.imageX = 6;
		this.imageY = 102;
		this.img = images.s_img;
		this.template = [
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0],
		];
	}

	copy() {
		return new S();
	}
}

class Z extends Tetromino {
	constructor() {
		super();
		this.imageX = 27;
		this.imageY = 1;
		this.img = images.z_img;
		this.template = [
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0],
		];
	}

	copy() {
		return new Z();
	}
}

class T extends Tetromino {
	constructor() {
		super();
		this.imageX = 102;
		this.imageY = 102;
		this.img = images.t_img;
		this.template = [
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0],
		];
	}

	copy() {
		return new T();
	}
}

//
//  VARIABLES
//
const initialPos = 4;
const lineWidth = 2;
let currentTetromino;
let nextTetromino;
let holdTetromino;
let score;
let gameLevel;
let gameMap = []; //2D array that tracks which spaces are available
let nextTetrominoMap = [];
let holdTetrominoMap = [];
let timeInterval;

const theTetrominoes = [
	new O(initialPos, 0),
	new I(initialPos, 0),
	new L(initialPos, 0),
	new J(initialPos, 0),
	new S(initialPos, 0),
	new Z(initialPos, 0),
	new T(initialPos, 0),
];

/**
 * Generates a random value to get a random Tetromino
 * @returns {Tetromino} - Tetromino Object
 */
function getRandomTetromino() {
	return Object.create(theTetrominoes[Math.floor(Math.random() * theTetrominoes.length)]);
}

/**
 * Find Rows are that are completed, then remove them from the Map Array
 */
function deleteCompletedRows() {
	let currRow = gameMap.length - 1;
	for (let row = gameMap.length - 1; row > 0; row--) {
		let tempRow = [];
		let completedRow = true;

		for (let col = 0; col < gameMap[row].length; col++) {
			tempRow.push(0);
			if (gameMap[row][col] === 0) completedRow = false;
		}

		if (completedRow) {
			gameMap[row] = tempRow;
			score++;
		} else {
			gameMap[currRow--] = gameMap[row];
		}
	}
}

/**
 * Draw the Map (the grids)
 */
function displayMap() {
	gameContext.fillStyle = '#595959';
	gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

	gameContext.fillStyle = 'black';
	for (let i = 0; i < numColumns; i++) {
		gameContext.fillRect(i * blockSize - lineWidth, 0, lineWidth, gameCanvas.height);
	}

	for (let j = 0; j < numRows; j++) {
		gameContext.fillRect(0, j * blockSize - lineWidth, gameCanvas.width, lineWidth);
	}
}

/**
 * If holdTetromino is null, hold the current Tetromino.
 * Otherwise, switch the hold and current Tetrominoes.
 */
function switchTetromino() {
	if (holdTetromino == null) {
		holdTetromino = currentTetromino.copy();
		currentTetromino = nextTetromino;
		nextTetromino = getRandomTetromino();
	} else {
		let temp = holdTetromino;
		holdTetromino = currentTetromino.copy();
		currentTetromino = temp;
		currentTetromino.x = initialPos;
		currentTetromino.y = 0;
	}
}

/**
 * Display the Hold Tetromino
 */
function displayHoldTetromino() {
	holdContext.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
	if (holdTetromino != null) {
		holdTetromino.x = 1;
		holdTetromino.y = 1;

		if (holdTetromino instanceof I) holdTetromino.x = 0.5;

		holdTetromino.draw(holdContext);
	}
}

/**
 * Display the next Tetromino
 */
function displayNextTetromino() {
	nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

	nextTetromino.x = 1;
	nextTetromino.y = 1;

	if (nextTetromino instanceof I) nextTetromino.x = 0.5;

	nextTetromino.draw(nextContext);
}

/**
 * Display the tetrominoes that have already fallen
 */
function displayFallenTetros() {
	for (let row = 0; row < gameMap.length; row++) {
		for (let col = 0; col < gameMap[row].length; col++) {
			if (gameMap[row][col] != 0) {
				let tetro = gameMap[row][col];
				gameContext.drawImage(
					tetro.img,
					tetro.imageX,
					tetro.imageY,
					imgSize,
					imgSize,
					col * blockSize,
					row * blockSize,
					blockSize,
					blockSize
				);
			}
		}
	}
}

/**
 * Display the current score.
 */
function displayScoreLevel() {
	let n = Math.ceil(score / 5);
	if (n > gameLevel) {
		gameLevel = n;
		clearInterval(timeInterval);
		timeInterval = setInterval(fallDown, 1000 / gameLevel);
	}
	score_text.innerText = 'Score: ' + score;
	level_text.innerText = 'Level: ' + gameLevel;
}

/**
 * Initialize the variables
 */
function initializeVariables() {
	let temp2D = [];
	for (let i = 0; i < numRows; i++) {
		let temp = [];
		for (let j = 0; j < numColumns; j++) {
			temp[j] = 0;
		}
		temp2D.push(temp);
	}
	gameMap = temp2D;

	currentTetromino = getRandomTetromino();
	currentTetromino.x = initialPos;

	nextTetromino = getRandomTetromino();
	holdTetromino = null;
	score = 0;
	gameLevel = 1;
	timeInterval = setInterval(fallDown, 1000);
}

/**
 * Display every components of the Game
 */
function displayGame() {
	gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	displayMap();
	displayFallenTetros();
	displayNextTetromino();
	displayHoldTetromino();
	displayScoreLevel();
	currentTetromino.draw(gameContext);
}

/**
 * Checks if the Game is over
 */
function gameOver() {
	currentTetromino.freeze();
	gameOverScreen.style.display = 'flex';
}

/**
 * Performs the falling down effect of the current Tetromino.
 */
function fallDown() {
	if (currentTetromino.checkDown()) {
		currentTetromino.moveDown();
	} else {
		currentTetromino.freeze();
		deleteCompletedRows();

		if (currentTetromino.y === 0) {
			gameOver();
		} else {
			currentTetromino = nextTetromino;
			currentTetromino.x = initialPos;
			currentTetromino.y = 0;

			nextTetromino = getRandomTetromino();
		}
	}
	displayGame();
}

/**
 * Performs the control in the Game
 */
function control(e) {
	if (e.keyCode === 37) {
		currentTetromino.moveLeft();
	} else if (e.keyCode === 38) {
		currentTetromino.rotate();
	} else if (e.keyCode === 39) {
		currentTetromino.moveRight();
	} else if (e.keyCode === 40) {
		if (currentTetromino.checkDown()) currentTetromino.moveDown();
	} else if (e.keyCode === 32) {
		currentTetromino.instantDrop();
	} else if (e.keyCode === 67) {
		switchTetromino();
	}
	displayGame();
}

startGame_btn.addEventListener('click', function () {
	startGameScreen.style.display = 'none';
	initializeVariables();
	displayGame();
	document.addEventListener('keydown', control);
});

restart_btn.addEventListener('click', function () {
    clearInterval(timeInterval);
	initializeVariables();
	restart_btn.blur();

	gameOverScreen.style.display = 'none';
});

displayMap();
