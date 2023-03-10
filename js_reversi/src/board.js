// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = [];
  for (let i = 0; i < 8; i++) {
    let row = new Array(8);
    grid.push(row);
  }

  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
	// [3, 4]
	if ((pos[0] < 0) || (pos[1] < 0) || (pos[0] > 7) || (pos[1] > 7)){
		return false; 
	}
	return true;
}

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
	// [3, 4]
	let x = pos[0]
	let y = pos[1]
	if (!this.isValidPos(pos)) {
		throw new Error('Not valid pos!')
	}

	if (this.isValidPos(pos) && pos !== null) {
		return this.grid[x][y] 
	} else {
		return undefined
	}
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let x = pos[0]
	let y = pos[1]
  if (this.isValidPos(pos) && this.grid[x][y] !== undefined && this.grid[x][y].color === color && this.grid[x][y] !== undefined) {
    return true
  }
  return false
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
	let x = pos[0];
	let y = pos[1];

	if (this.grid[x][y] !== undefined) {
		return true  
	} else {
	return false
	} 
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
	if (!piecesToFlip) {
		piecesToFlip = [];
	}
	//pos = [3, 4]
	let x = pos[0];
	let y = pos[1];

	let cx = dir[0];
	let cy = dir[1];
	let nextPos =  [(x + cx), (y + cy)];

	if (!this.isValidPos(nextPos)) {
		return []
	}

	if (this.grid[nextPos[0]][nextPos[1]] === undefined ) {
		return []
	} 


	if (this.grid[nextPos[0]][nextPos[1]].color !== color) {
		piecesToFlip.push(nextPos);
		return this._positionsToFlip(nextPos, color, dir, piecesToFlip)
	} else {
		return piecesToFlip;
	}

};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  let x = pos[0]
  let y = pos[1]

  if (this.isOccupied(pos)) {
    return false;
  }
  
  for (let i = 0; i < Board.DIRS.length; i++) {
	let piecesToFlip = this._positionsToFlip(pos, color, Board.DIRS[i]);
	if (piecesToFlip.length) {
		return true
	}
  }

  
  if (this.grid[x][y] === color) {
    return false
  }

  return false
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
	if (!this.validMove(pos, color)) {
		throw new Error('Invalid move!');
	  }
	
	  let positionsToFlip = [];
	  for (let dirIdx = 0; dirIdx < Board.DIRS.length; dirIdx++) {
	
		positionsToFlip = positionsToFlip.concat(
		  this._positionsToFlip(pos, color, Board.DIRS[dirIdx])
		);
	  }
	
	  for (let posIdx = 0; posIdx < positionsToFlip.length; posIdx++) {
		this.getPiece(positionsToFlip[posIdx]).flip();
	  }
	
	  this.grid[pos[0]][pos[1]] = new Piece(color);
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
	const validMovesList = [];

	for (let i = 0; i < 8; i++) {
	  for (let j = 0; j < 8; j++) {
		if (this.validMove([i, j], color)) {
		  validMovesList.push([i, j]);
		}
	  }
	}
  
	return validMovesList;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
	return this.validMoves(color).length !== 0;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
	return !this.hasMove("black") && !this.hasMove("white");
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
	for (let i = 0; i < 8; i++) {
		let rowString = " " + i + " |";
	
		for (let j = 0; j < 8; j++) {
		  let pos = [i, j];
		  rowString +=
			(this.getPiece(pos) ? this.getPiece(pos).toString() : ".");
		}
	
		console.log(rowString);
	  }
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE