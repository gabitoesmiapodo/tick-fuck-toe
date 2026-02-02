import type { Game } from '../game/game';
import styles from './styles.module.css';

export function mountUI(root: HTMLElement, game: Game) {
  // Create UI structure
  const container = document.createElement('div');
  container.className = styles.container;

  const status = document.createElement('div');
  status.className = styles.status;

  const board = document.createElement('div');
  board.className = styles.board;

  const resetButton = document.createElement('button');
  resetButton.className = styles.resetButton;
  resetButton.textContent = 'Reset Game';

  // Fireworks canvas
  const fireworksCanvas = document.createElement('canvas');
  fireworksCanvas.className = styles.fireworks;
  fireworksCanvas.width = 800;
  fireworksCanvas.height = 600;

  container.appendChild(status);
  container.appendChild(board);
  container.appendChild(resetButton);
  container.appendChild(fireworksCanvas);
  root.appendChild(container);

  // Fireworks animation state
  let animationFrameId: number | null = null;
  let particles: Particle[] = [];

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
  }

  function createFirework() {
    const colors = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#ff00ff',
      '#00ffff',
    ];
    const x = Math.random() * fireworksCanvas.width;
    const y = Math.random() * (fireworksCanvas.height * 0.5);

    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const speed = 2 + Math.random() * 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function animateFireworks() {
    const ctx = fireworksCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    particles = particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life -= 0.01;

      if (p.life > 0) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 3, 3);
        return true;
      }
      return false;
    });

    ctx.globalAlpha = 1;

    if (Math.random() < 0.05) {
      createFirework();
    }

    animationFrameId = requestAnimationFrame(animateFireworks);
  }

  function startFireworks() {
    stopFireworks();
    fireworksCanvas.style.display = 'block';
    particles = [];
    animateFireworks();
  }

  function stopFireworks() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    fireworksCanvas.style.display = 'none';
    particles = [];
    const ctx = fireworksCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }
  }

  // Click fireworks to dismiss
  fireworksCanvas.addEventListener('click', stopFireworks);

  // Create 9 cells
  const cells: HTMLButtonElement[] = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.className = styles.cell;
    cell.dataset.index = String(i);
    cells.push(cell);
    board.appendChild(cell);
  }

  // Render function - updates UI from game state
  function render() {
    const currentBoard = game.getBoard();
    const currentPlayer = game.getCurrentPlayer();
    const gameStatus = game.getStatus();
    const winner = game.getWinner();
    const winningLine = game.getWinningLine();
    const aiPlayer = game.getAIPlayer();

    // Update cells
    cells.forEach((cell, index) => {
      const player = currentBoard[index];
      cell.textContent = player || '';
      cell.disabled = gameStatus !== 'playing' || player !== null;

      // Highlight winning cells
      if (winningLine && winningLine.includes(index)) {
        cell.classList.add(styles.winner);
      } else {
        cell.classList.remove(styles.winner);
      }
    });

    // Update status message and fireworks
    if (gameStatus === 'win' && winner) {
      const winnerLabel = winner === aiPlayer ? 'AI' : 'Human';
      status.textContent = `${winnerLabel} wins!`;
      startFireworks();
    } else if (gameStatus === 'draw') {
      status.textContent = "It's a draw!";
      stopFireworks();
    } else {
      const playerLabel = currentPlayer === aiPlayer ? 'AI' : 'Human';
      status.textContent = `Current player: ${playerLabel} (${currentPlayer})`;
      stopFireworks();
    }
  }

  // Trigger AI move if it's AI's turn
  function triggerAIMove() {
    if (game.isAITurn()) {
      game.playAIMove();
      render();
    }
  }

  // Handle cell click
  function handleCellClick(event: Event) {
    const target = event.target as HTMLElement;
    const index = target.dataset.index;
    if (index !== undefined) {
      const success = game.playMove(Number(index));
      if (success) {
        render();
        // Trigger AI move after human move
        triggerAIMove();
      }
    }
  }

  // Handle reset button click
  function handleResetClick() {
    game.reset();
    render();
    // Trigger AI move if AI starts
    triggerAIMove();
  }

  // Attach event listeners
  board.addEventListener('click', handleCellClick);
  resetButton.addEventListener('click', handleResetClick);

  // Initial render
  render();

  // Trigger AI move if AI starts
  triggerAIMove();

  // Return teardown function
  return {
    teardown() {
      stopFireworks();
      fireworksCanvas.removeEventListener('click', stopFireworks);
      board.removeEventListener('click', handleCellClick);
      resetButton.removeEventListener('click', handleResetClick);
      root.innerHTML = '';
    },
  };
}
