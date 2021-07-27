const canvas = document.querySelector("canvas");
canvas.width = 400;
canvas.height = innerHeight;

const canvasW = canvas.width;
const canvasH = canvas.height;

const ctx = canvas.getContext("2d");
let carX,
  carY,
  carW,
  carH,
  upPressed,
  downPressed,
  rightPressed,
  leftPressed,
  dividerW,
  dividerH,
  dividerX,
  dividerY,
  speed,
  enemyW,
  enemyH,
  score = 0,
  enemyInterval,
  carImg,
  enemyCarImg;

const enemies = [];
let modalEL = document.getElementById("modalEl");

roadDivider();
initCarImg();
drawCar();
initEnemyImg();
// spawnEnemy();
setVariables();
// startGame();

function loadGame() {
  modalEL.style.display = "none";
  document.getElementById("scoreId").innerHTML = score;

  roadDivider();
  initCarImg();
  drawCar();
  initEnemyImg();
  spawnEnemy();
  setVariables();
  startGame();
}

class Enemy {
  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
  }
  update() {
    drawEnemy(this.x, this.y);
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

function drawEnemy(x, y) {
  ctx.drawImage(enemyCarImg, x, y, enemyW, enemyH);
}

function initEnemyImg() {
  enemyCarImg = new Image();
  enemyCarImg.onload = function () {
    drawEnemy(-100, -100);
  };

  enemyCarImg.src = "car4.jpg";
}

function spawnEnemy() {
  if (!enemyInterval) {
    enemyInterval = setInterval(() => {
      const x = Math.floor(Math.random() * (canvasW - carW - 1) + 1);
      const velocity = {
        x: 0,
        y: Math.floor(Math.random() * (7 - 3) + 3),
      };

      let flag = 0;
      for (let i = 0; i < enemies.length; i++) {
        if (
          enemies[i].x >= Math.abs(x - enemyW) &&
          enemies[i].x <= x + enemyW
        ) {
          flag = 1;
        }
      }
      if (enemies.length === 0 || flag === 0)
        enemies.push(new Enemy(x, -30, velocity));
    }, 500);
  }
}

function roadDivider() {
  for (i = 0; i <= 20; i++) {
    ctx.beginPath();
    ctx.rect(dividerX, dividerY + i * 115, dividerW, dividerH);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
}

function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvasW, canvasH);

  dividerY += speed;
  if (dividerY > 100) dividerY = -10;

  if (upPressed) carY -= speed;
  if (downPressed) carY += speed;
  if (rightPressed) carX += speed;
  if (leftPressed) carX -= speed;

  if (carX < 0) carX = 0;
  if (carX > canvasW - carW) carX = canvasW - carW;
  if (carY < 0) carY = 0;
  if (carY > canvasH - carH) carY = canvasH - carH;

  roadDivider();
  drawCar();
  carNavigation();
  enemies.forEach((enemy, index) => {
    //// Remove Enemy Car When crossed Canvas Height
    if (enemy.y > canvasH) {
      enemies.splice(index, 1);
      score += 1;
      document.getElementById("scoreId").innerHTML = score;
    }
    ///// collision Detection
    if (
      carX < enemy.x + enemyW &&
      carX + carW > enemy.x &&
      carY < enemy.y + enemyH &&
      carY + carH > enemy.y
    ) {
      gameOver();
    }
    enemy.update();
  });
}

function startGame() {
  animate();
}

function gameOver() {
  modalEL.style.display = "block";
  document.getElementById("scoreId").innerHTML = score;
  document.getElementById("finalScore").innerHTML = score;
  score = 0;
  cancelAnimationFrame(animationId);
  clearInterval(enemyInterval);
  enemyInterval = null;
  enemies.splice(0, enemies.length);
  // roadDivider();
  setVariables();
  //   drawCar();
}

function initCarImg() {
  carImg = new Image();
  carImg.onload = function () {
    drawCar();
  };
  carImg.src = "car.jpg";
}

function drawCar() {
  ctx.drawImage(carImg, carX, carY, carW, carH);
}

function setVariables() {
  speed = 4;

  carW = 30;
  carH = 60;
  carX = canvasW / 2 - carW / 2;
  carY = canvasH - carH - 20;

  upPressed = false;
  downPressed = false;
  rightPressed = false;
  leftPressed = false;

  dividerW = 10;
  dividerH = 80;
  dividerX = canvasW / 2 - dividerW / 2;
  dividerY = 0;

  enemyW = 30;
  enemyH = 60;
}

function carNavigation() {
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      upPressed = true;
    }
    if (e.key === "ArrowDown") {
      downPressed = true;
    }
    if (e.key === "ArrowRight") {
      rightPressed = true;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = true;
    }
  };
  const handleKeyUp = (e) => {
    if (e.key === "ArrowUp") {
      upPressed = false;
    }
    if (e.key === "ArrowDown") {
      downPressed = false;
    }
    if (e.key === "ArrowRight") {
      rightPressed = false;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = false;
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}
