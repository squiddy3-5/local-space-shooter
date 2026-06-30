// space-shooter.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let playerX = canvas.width / 2 - 50;
let playerY = canvas.height - 100;
let playerSpeed = 5;
let playerWidth = 100;
let playerHeight = 50;

let projectiles = [];
const projectileSpeed = 10;
const projectileWidth = 10;
const projectileHeight = 20;

let enemies = [];
const enemyCount = 3;
const enemySpeed = 3;
const enemyWidth = 80;
const enemyHeight = 40;

let score = 0;
let gameOver = false;

function drawPlayer() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawProjectiles() {
    projectiles.forEach(projectile => {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function updateGame() {
    if (gameOver) return;

    // Move player
    if (keys.left && playerX > 0) playerX -= playerSpeed;
    if (keys.right && playerX < canvas.width - playerWidth) playerX += playerSpeed;

    // Shoot projectile
    if (keys.space && projectiles.length === 0) {
        projectiles.push({ x: playerX + playerWidth / 2, y: playerY });
    }

    // Move projectiles
    projectiles.forEach((projectile, index) => {
        projectile.y -= projectileSpeed;
        if (projectile.y < 0) projectiles.splice(index, 1);
    });

    // Spawn enemies
    if (enemies.length < enemyCount && Math.random() > 0.95) {
        const x = Math.random() * canvas.width;
        enemies.push({ x, y: 0, width: enemyWidth, height: enemyHeight });
    }

    // Move enemies
    enemies.forEach(enemy => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });

    // Check for collisions between projectiles and enemies
    projectiles.forEach((projectile, index) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                projectile.x >= enemy.x && projectile.x <= enemy.x + enemyWidth &&
                projectile.y >= enemy.y && projectile.y <= enemy.y + enemyHeight
            ) {
                score += 10;
                projectiles.splice(index, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });

    // Check for collision between player and enemies
    if (
        enemies.some(enemy => {
            return (
                playerX >= enemy.x && playerX <= enemy.x + enemyWidth &&
                playerY >= enemy.y && playerY <= enemy.y + enemyHeight
            );
        })
    ) {
        gameOver = true;
    }
}

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawProjectiles();
    drawEnemies();
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

const keys = {};
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'D') keys.right = true;
    if (e.key === ' ') keys.space = true;
});
window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'D') keys.right = false;
    if (e.key === ' ') keys.space = false;
});

function gameLoop() {
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();
