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
window.countNRooksSolutions = function (n) {
  var solutionCount = 1; // fixme

  var recursion = function (n) {
    var num = n;
    var board = new Board({ n: num });
    var innerCount = 0;
    for (var i = 0; i < num; i++) {
      if (!board.hasAnyRooksConflicts()) {
        innerCount++;
      }
    }
    return innerCount;
  };
  for (var j = n; j > 0; j--) {
    solutionCount *= recursion(j);
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
window.countNQueensSolutions = function (n, indexRow, solution, solutionCount, cache) {
  solutionCount = solutionCount || 0; // fixme
  indexRow = indexRow || 0;
  solution = solution || new Board({ n: n });
  var queensLeft = n;
  cache = cache || [];

  if (n === 0) {
    solutionCount = 1;
    return solutionCount;
  }

  if (indexRow === n) return solutionCount;

  for (var col = 0; col < n; col++) {
    solution.rows()[indexRow][col] = 1;
    queensLeft--;
    indexRow++;
    if (!solution.hasAnyRowConflicts() && !solution.hasAnyColConflicts() && !solution.hasAnyMajorDiagonalConflicts() && !solution.hasMinorDiagonalConflictAt()) {
      solutionCount += countNQueensSolutions(n, indexRow, solution, solutionCount, cache);
    }
    indexRow--;
    solution.rows()[indexRow][col] = 0;
    queensLeft++;
  }

  if (queensLeft === 0) {
    solutionCount++;
  }

  return solutionCount;
  // if (queensLeft === 0) {
  //   console.log(solutionCount);
  //   console.log('cache : ', cache);
  //   if (!cache.includes(JSON.stringify(solution.rows()))) {
  //     cache.push(JSON.stringify(solution.rows()));
  //     console.log('cache : ', cache);
  //     solutionCount++;
  //   }

  //   console.log('result : ' , solutionCount);
  //   console.log(JSON.stringify(solution.rows()));
  // }

  // indexRow++
  // if (indexRow < n) {
  //   return countNQueensSolutions(n, indexRow, solution, solutionCount, cache);
  // } else if (col < n) {
  //   col++
  //   if (indexRow === n && col === n) {
  //     console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  //     return solutionCount;
  //   } else {
  //     indexRow = 0;
  //     return countNQueensSolutions(n, indexRow, solution, solutionCount, cache);
  //   }
  // }
};
