document.addEventListener('DOMContentLoaded', () => {
  const gameArea = document.getElementById('game-area');
  const scoreEl = document.getElementById('score');
  const startBtn = document.getElementById('start-game');

  let player;
  let blocks = [];
  let score = 0;
  let gameInterval;
  let blockInterval;
  let isGameOver = false;

  // Create player square
  function createPlayer() {
    player = document.createElement('div');
    player.style.width = '50px';
    player.style.height = '50px';
    player.style.backgroundColor = 'blue';
    player.style.position = 'absolute';
    player.style.bottom = '10px';
    player.style.left = (gameArea.clientWidth / 2 - 25) + 'px';
    player.style.borderRadius = '8px';
    gameArea.appendChild(player);
  }

  // Move player left/right with arrow keys
  function handleKey(e) {
    if (isGameOver) return;
    const left = parseInt(player.style.left);
    if (e.key === 'ArrowLeft' && left > 0) {
      player.style.left = Math.max(0, left - 20) + 'px';
    }
    if (e.key === 'ArrowRight' && left < gameArea.clientWidth - 50) {
      player.style.left = Math.min(gameArea.clientWidth - 50, left + 20) + 'px';
    }
  }

  // Create falling block
  function createBlock() {
    const block = document.createElement('div');
    block.style.width = '40px';
    block.style.height = '40px';
    block.style.backgroundColor = 'red';
    block.style.position = 'absolute';
    block.style.top = '0px';
    block.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 40)) + 'px';
    block.style.borderRadius = '8px';
    gameArea.appendChild(block);
    blocks.push(block);
  }

  // Move blocks down and check collision
  function gameLoop() {
    if (isGameOver) return;

    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];
      const top = parseInt(block.style.top);
      block.style.top = top + 5 + 'px';

      // Remove block if it goes out of the game area
      if (top > gameArea.clientHeight) {
        gameArea.removeChild(block);
        blocks.splice(i, 1);
        score++;
        scoreEl.textContent = score;
      } else if (checkCollision(player, block)) {
        endGame();
      }
    }
  }

  // Collision detection between two elements
  function checkCollision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
      aRect.top > bRect.bottom ||
      aRect.bottom < bRect.top ||
      aRect.left > bRect.right ||
      aRect.right < bRect.left
    );
  }

  function startGame() {
    // Reset
    isGameOver = false;
    score = 0;
    scoreEl.textContent = score;

    // Clear previous blocks
    blocks.forEach(b => gameArea.removeChild(b));
    blocks = [];

    // Remove old player if any
    if (player) gameArea.removeChild(player);

    createPlayer();

    document.addEventListener('keydown', handleKey);

    // Start intervals
    gameInterval = setInterval(gameLoop, 50);
    blockInterval = setInterval(createBlock, 1000);

    startBtn.disabled = true;
    startBtn.textContent = 'Game Running...';
  }

  function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(blockInterval);
    document.removeEventListener('keydown', handleKey);
    alert(`Game Over! Your score: ${score}`);
    startBtn.disabled = false;
    startBtn.textContent = 'Start Game';
  }

  startBtn.addEventListener('click', startGame);
});
