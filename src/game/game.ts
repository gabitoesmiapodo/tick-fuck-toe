// Core Tic Tac Toe game logic (pure, no DOM)

export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = readonly Cell[];
export type GameStatus = 'playing' | 'win' | 'draw';

// All winning line combinations for 3x3 board
const WINNING_LINES: readonly number[][] = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

interface GameState {
  board: Cell[];
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningLine: number[] | null;
  aiPlayer: Player;
}

function createInitialState(startingPlayer: Player): GameState {
  return {
    board: Array(9).fill(null),
    currentPlayer: startingPlayer,
    status: 'playing',
    winner: null,
    winningLine: null,
    aiPlayer: 'O', // AI always plays as O
  };
}

function checkWinner(board: Cell[]): {
  winner: Player | null;
  winningLine: number[] | null;
} {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: line };
    }
  }
  return { winner: null, winningLine: null };
}

function checkDraw(board: Cell[]): boolean {
  return board.every((cell) => cell !== null);
}

function randomPlayer(): Player {
  return Math.random() < 0.5 ? 'X' : 'O';
}

// Get all empty cell indices
function getEmptyCells(board: Cell[]): number[] {
  return board.reduce<number[]>((acc, cell, index) => {
    if (cell === null) {
      acc.push(index);
    }
    return acc;
  }, []);
}

// Check if a player can win on the next move
function findWinningMove(board: Cell[], player: Player): number | null {
  const emptyCells = getEmptyCells(board);

  for (const index of emptyCells) {
    // Try the move
    const testBoard = [...board];
    testBoard[index] = player;

    // Check if it wins
    const { winner } = checkWinner(testBoard);
    if (winner === player) {
      return index;
    }
  }

  return null;
}

// AI move selection: human-like behavior
// 1. Take winning move if available
// 2. Block opponent's winning move
// 3. Otherwise choose random valid move
function selectAIMove(board: Cell[], aiPlayer: Player): number | null {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return null;
  }

  // 1. Check for winning move
  const winningMove = findWinningMove(board, aiPlayer);
  if (winningMove !== null) {
    return winningMove;
  }

  // 2. Check for blocking move
  const opponent: Player = aiPlayer === 'X' ? 'O' : 'X';
  const blockingMove = findWinningMove(board, opponent);
  if (blockingMove !== null) {
    return blockingMove;
  }

  // 3. Choose random valid move
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

export class Game {
  private state: GameState;

  constructor() {
    this.state = createInitialState(randomPlayer());
  }

  reset(): void {
    this.state = createInitialState(randomPlayer());
  }

  playMove(index: number): boolean {
    // Reject invalid moves
    if (index < 0 || index > 8 || this.state.status !== 'playing') {
      return false;
    }

    // Reject if cell is already occupied
    if (this.state.board[index] !== null) {
      return false;
    }

    // Make the move (mutating internal state)
    this.state.board[index] = this.state.currentPlayer;

    // Check for winner
    const { winner, winningLine } = checkWinner(this.state.board);
    if (winner) {
      this.state.status = 'win';
      this.state.winner = winner;
      this.state.winningLine = winningLine;
      return true;
    }

    // Check for draw
    if (checkDraw(this.state.board)) {
      this.state.status = 'draw';
      return true;
    }

    // Switch player
    this.state.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
    return true;
  }

  getBoard(): Board {
    return [...this.state.board];
  }

  getCurrentPlayer(): Player {
    return this.state.currentPlayer;
  }

  getStatus(): GameStatus {
    return this.state.status;
  }

  getWinner(): Player | null {
    return this.state.winner;
  }

  getWinningLine(): number[] | null {
    return this.state.winningLine ? [...this.state.winningLine] : null;
  }

  // AI-specific methods
  getAIPlayer(): Player {
    return this.state.aiPlayer;
  }

  isAITurn(): boolean {
    return (
      this.state.currentPlayer === this.state.aiPlayer &&
      this.state.status === 'playing'
    );
  }

  playAIMove(): boolean {
    if (!this.isAITurn()) {
      return false;
    }

    const aiMove = selectAIMove(this.state.board, this.state.aiPlayer);
    if (aiMove === null) {
      return false;
    }

    return this.playMove(aiMove);
  }
}
