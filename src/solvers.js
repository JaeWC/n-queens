/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function (n) {
  var solution = []; // fixme

  var num = n;
  var board = new Board({ n: num });

  var randomRow = Math.floor(Math.random() * num);
  var randomCol = Math.floor(Math.random() * num);
  board.rows()[randomRow][randomCol] = 1;

  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      board.rows()[i][j] = 1;
      if (board.hasAnyRooksConflicts()) {
      // if ((board.hasRowConflictAt(i)) || (board.hasColConflictAt(j))) {
        board.rows()[i][j] = 0;
      }
    }
    solution.push(board.rows()[i]);
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function (n, board, indexRow, rooksLeft) {
  var solutionCount = 0; // fixme

  indexRow = indexRow || 0;
  board = board || new Board({ n: n });
  if (rooksLeft === undefined) rooksLeft = n;

  if (rooksLeft > 0) {
    for (var col = 0; col < n; col++) {
      board.togglePiece(indexRow, col);
      rooksLeft--;
      indexRow++;
      if (!board.hasAnyRooksConflicts()) {
        solutionCount = solutionCount + window.countNRooksSolutions(n, board, indexRow, rooksLeft);
      }
      indexRow--;
      board.togglePiece(indexRow, col);
      rooksLeft++;
    }
  } else {
    solutionCount++;
  }
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function (n, indexRow, indexCol) {
  var queensLeft = n;
  indexRow = indexRow || 0;
  indexCol = indexCol || 0;

  if (n === 0) return [];

  var solution = new Board({ n: n });
  solution.rows()[indexRow][indexCol] = 1;

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      solution.rows()[i][j] = 1;
      queensLeft--;
      if (solution.hasAnyQueenConflictsOn(i, j)) {
        solution.rows()[i][j] = 0;
        queensLeft++;
      }
    }
  }

  if (queensLeft === 0) {
    solution = solution.rows();
    console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
    return solution;
  }

  if (queensLeft !== 0) {
    indexRow++;
    if (indexRow < n) {
      return findNQueensSolution(n, indexRow, indexCol);
    } else if (indexCol < n) {
      indexRow = 0;
      indexCol++;
      return findNQueensSolution(n, indexRow, indexCol);
    } else if (indexCol === n) {
      solution = new Board({ n: n });
      return solution.rows();
    }
  }
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function (n, board, indexRow, queensLeft) {
  var solutionCount = 0; // fixme

  indexRow = indexRow || 0;
  board = board || new Board({ n: n });
  console.log('queenleft : ', queensLeft);
  if (queensLeft === undefined) queensLeft = n;
  console.log('queenleft : ', queensLeft);

  if (n <= 1) return 1;

  if (queensLeft > 0) {
    for (var col = 0; col < n; col++) {
      console.log('row is : ', indexRow);
      console.log('col is : ', col);
      board.togglePiece(indexRow, col);
      queensLeft--;
      indexRow++;
      if (!board.hasAnyQueensConflicts()) {
        console.log('queenleft : ', queensLeft);
        solutionCount = solutionCount + countNQueensSolutions(n, board, indexRow, queensLeft);
      }
      indexRow--;
      board.togglePiece(indexRow, col);
      queensLeft++;
    }
  } else {
    solutionCount++;
  }
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
