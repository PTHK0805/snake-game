const gameBoard = document.getElementById("game-board");

let boardWidth = 400;
let boardHeight = 400;
const snakeSize = 20;
const snakeSpeed = 200;

let snake = [{ x: 200, y: 200 }];
let food = { x: 100, y: 100 };
let direction = { x: 0, y: 0 };
let score = 0;
let winScore = 10;
let gameInterval;

let touchStartX = 0;
let touchStartY = 0;

function calculateBoardSize() {
  const gameBoard = document.getElementById("game-board");
  const screenWidth = window.innerWidth;
  boardWidth = screenWidth;

  if (screenWidth < 400) {
    boardWidth = screenWidth;
  } else {
    boardWidth = 400;
  }
  gameBoard.style.width = boardWidth + "px";
}

window.addEventListener('resize', calculateBoardSize);
window.addEventListener('load', calculateBoardSize);

function initializeGame() {
  snake = [{ x: 200, y: 200 }];
  do {
    food = {
      x: Math.floor(Math.random() * (boardWidth / snakeSize)) * snakeSize,
      y: Math.floor(Math.random() * (boardHeight / snakeSize)) * snakeSize
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  direction = { x: 0, y: 0 };
  score = 0;
  document.getElementById('score-board').textContent = `Score: ${score} / ${winScore}`;
  document.getElementById('start-menu').style.display = 'none';
  document.getElementById('game-over-menu').style.display = 'none';
  gameInterval = setInterval(() => {
    moveSnake();
    drawBoard();
  }, snakeSpeed);
}


function moveSnake() {
  let head = { x: snake[0].x + direction.x * snakeSize, y: snake[0].y + direction.y * snakeSize };

  // Check for collision with walls
  if (head.x < 0 || head.x >= boardWidth || head.y < 0 || head.y >= boardHeight) {
    gameOver();
    return;
  }

  // Check for collision with self
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * (boardWidth / snakeSize)) * snakeSize,
      y: Math.floor(Math.random() * (boardHeight / snakeSize)) * snakeSize
    };
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;
    const randomBrightColor = `rgb(${r}, ${g}, ${b})`;
    food.color = randomBrightColor;
    if (score >= winScore) {
      win();
      return;
    }
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function drawBoard() {
  const snakeElements = gameBoard.querySelectorAll('.snake');
  snakeElements.forEach(element => element.remove());

  const foodElement = gameBoard.querySelector('.food');
  if (foodElement) {
    foodElement.remove();
  }

  // Draw snake
  snake.forEach((segment, index) => {
    let snakeElement = document.createElement('div');
    snakeElement.style.left = `${segment.x}px`;
    snakeElement.style.top = `${segment.y}px`;
    snakeElement.classList.add('snake');
    gameBoard.appendChild(snakeElement);
  });

  // Draw food
  let foodElem = document.createElement('div');
  foodElem.style.left = `${food.x}px`;
  foodElem.style.top = `${food.y}px`;
  foodElem.classList.add('food');
  foodElem.style.backgroundColor = food.color;
  gameBoard.appendChild(foodElem);

  // Update score
  document.getElementById('score-board').textContent = `Score: ${score} / ${winScore}`;
}

function gameOver() {
  clearInterval(gameInterval);

  const snakeElements = gameBoard.querySelectorAll('.snake');
  const foodElement = gameBoard.querySelector('.food');
  snakeElements.forEach(element => element.remove());
  if (foodElement) {
    foodElement.remove();
  }

  document.getElementById('final-score').textContent = `Score: ${score}`;
  document.getElementById('game-over-menu').style.display = 'block';
  document.getElementById('game-over-title').textContent = 'Game Over';
  document.getElementById('restart-button').textContent = 'Restart';
}

function win() {
  clearInterval(gameInterval);
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 }
  });

  const snakeElements = gameBoard.querySelectorAll('.snake');
  const foodElement = gameBoard.querySelector('.food');
  snakeElements.forEach(element => element.remove());
  if (foodElement) {
    foodElement.remove();
  }

  document.getElementById('game-over-menu').style.display = 'block';
  document.getElementById('game-over-title').textContent = 'You Win';
  document.getElementById('final-score').textContent = `Score: ${score}`;
  document.getElementById('restart-button').textContent = 'Play Again';
}

let lastKeyPressTime = 0;
const keyPressDelay = 200;

document.addEventListener("keydown", e => {
  const currentTime = new Date().getTime();
  if (currentTime - lastKeyPressTime < keyPressDelay) {
    return;
  }
  lastKeyPressTime = currentTime;

  console.log(e.key)

  if ((e.key === "ArrowRight" || e.key === "d") && direction.x !== -1) {
    direction = { x: 1, y: 0 };
  } else if ((e.key === "ArrowLeft" || e.key === "a") && direction.x !== 1) {
    direction = { x: -1, y: 0 };
  } else if ((e.key === "ArrowUp" || e.key === "w") && direction.y !== 1) {
    direction = { x: 0, y: -1 };
  } else if ((e.key === "ArrowDown" || e.key === "s") && direction.y !== -1) {
    direction = { x: 0, y: 1 };
  }
});

const upArrow = document.getElementById('up-arrow');
const downArrow = document.getElementById('down-arrow');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

upArrow.addEventListener('click', () => {
  const currentTime = new Date().getTime();
  if (currentTime - lastKeyPressTime < keyPressDelay) {
    return;
  }
  lastKeyPressTime = currentTime;
  
  if (direction.y !== 1) {
    direction = { x: 0, y: -1 };
  }
});

downArrow.addEventListener('click', () => {
  const currentTime = new Date().getTime();
  if (currentTime - lastKeyPressTime < keyPressDelay) {
    return;
  }
  lastKeyPressTime = currentTime;
  
  if (direction.y !== -1) {
    direction = { x: 0, y: 1 };
  }
});

leftArrow.addEventListener('click', () => {
  const currentTime = new Date().getTime();
  if (currentTime - lastKeyPressTime < keyPressDelay) {
    return;
  }
  lastKeyPressTime = currentTime;
  
  if (direction.x !== 1) {
    direction = { x: -1, y: 0 };
  }
});

rightArrow.addEventListener('click', () => {
  const currentTime = new Date().getTime();
  if (currentTime - lastKeyPressTime < keyPressDelay) {
    return;
  }
  lastKeyPressTime = currentTime;
  
  if (direction.x !== -1) {
    direction = { x: 1, y: 0 };
  }
});

// function handleTouchStart(event) {
//   touchStartX = event.touches[0].clientX;
//   touchStartY = event.touches[0].clientY;
// }

// function handleTouchMove(event) {
//   if (!touchStartX || !touchStartY) {
//     return;
//   }

//   event.preventDefault();

//   const touchEndX = event.touches[0].clientX;
//   const touchEndY = event.touches[0].clientY;

//   const deltaX = touchEndX - touchStartX;
//   const deltaY = touchEndY - touchStartY;

//   if (Math.abs(deltaX) > Math.abs(deltaY)) {
//     // Horizontal swipe
//     if (deltaX > 0 && direction.x !== -1) {
//       direction = { x: 1, y: 0 };
//     } else if (deltaX < 0 && direction.x !== 1) {
//       direction = { x: -1, y: 0 };
//     }
//   } else {
//     // Vertical swipe
//     if (deltaY > 0 && direction.y !== -1) {
//       direction = { x: 0, y: 1 };
//     } else if (deltaY < 0 && direction.y !== 1) {
//       direction = { x: 0, y: -1 };
//     }
//   }

//   touchStartX = 0;
//   touchStartY = 0;
// }

// const touchPad = document.getElementById('touch-pad');
// touchPad.addEventListener('touchstart', handleTouchStart, { passive: false });
// touchPad.addEventListener('touchmove', handleTouchMove, { passive: false });


document.getElementById('start-button').addEventListener('click', initializeGame);
document.getElementById('restart-button').addEventListener('click', initializeGame);
window.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    initializeGame();
  }

  if (e.key === 'Escape') {
    window.location.reload();
  }
});

// Show start menu on load
document.getElementById('start-menu').style.display = 'block';