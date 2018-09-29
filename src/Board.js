// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {
  /* eslint-disable */
  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:')
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;')
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;')
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')))
      } else {
        this.set('n', params.length)
      }
    },

    rows: function () {
      return _(_.range(this.get('n'))).map(function (rowIndex) {
        return this.get(rowIndex)
      }, this)
    },

    togglePiece: function (rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex]
      this.trigger('change')
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex - rowIndex
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex + rowIndex
    },

    hasAnyRooksConflicts: function () {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts()
    },

    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      )
    },

    hasAnyQueensConflicts: function () {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts()
    },

    _isInBounds: function (rowIndex, colIndex) {
      return (
        rowIndex >= 0 && rowIndex < this.get('n') &&
        colIndex >= 0 && colIndex < this.get('n')
      )
    },
    /* eslint-enable */

    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /* =========================================================================
    =                 TODO: fill in these Helper Functions                    =
    ========================================================================= */

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function (rowIndex) {
      return this.rows()[rowIndex].filter(el => el === 1).length > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function () {
      for (var rowIndex = 0; rowIndex < this.rows().length; rowIndex++) {
        if (this.hasRowConflictAt(rowIndex)) {
          return true;
        }
      }
      return false;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function (colIndex) {
      var col = [];

      for (var i = 0; i < this.rows().length; i++) {
        col.push(this.rows()[i][colIndex]);
      }
      return col.filter(el => el === 1).length > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function () {
      for (let colIndex = 0; colIndex < this.rows().length; colIndex++) {
        if (this.hasColConflictAt(colIndex)) {
          return true;
        }
      }
      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalColumnIndexAtFirstRow) {
      const boardLength = this.rows().length;
      var majorDiagonal = [];

      for (var i = 0; i < boardLength; i++) {
        for (var j = 0; j < boardLength; j++) {
          if (j - i === majorDiagonalColumnIndexAtFirstRow) {
            majorDiagonal.push(this.rows()[i][j]);
          }
        }
      }

      return majorDiagonal.filter(el => el === 1).length > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function () {
      const index = this.rows().length - 1;

      for (let majorDIndex = -1 * index; majorDIndex < index; majorDIndex++) {
        if (this.hasMajorDiagonalConflictAt(majorDIndex)) {
          return true;
        }
      }
      return false; // fixme
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function (minorDiagonalColumnIndexAtFirstRow) {
      const boardLength = this.rows().length;
      var minorDiagonal = [];

      for (var i = 0; i < boardLength; i++) {
        for (var j = 0; j < boardLength; j++) {
          if (i + j === minorDiagonalColumnIndexAtFirstRow) {
            minorDiagonal.push(this.rows()[i][j]);
          }
        }
      }

      return minorDiagonal.filter(el => el === 1).length > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function () {
      const maxIndex = (this.rows().length - 1) * 2;

      for (var minorDIndex = 0; minorDIndex < maxIndex; minorDIndex++) {
        if (this.hasMinorDiagonalConflictAt(minorDIndex)) {
          return true;
        }
      }
      return false; // fixme
    }

    /* --------------------  End of Helper Functions  --------------------- */

  });
  /* eslint-disable */
  var makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0
      })
    })
  }
  /* eslint-enable */
}());
