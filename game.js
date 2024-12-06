// Variáveis do jogo
let birdY, birdX, birdSpeed, gravity, lift, pipes, pipeWidth, pipeGap, pipeSpeed, frame, score;
let gameOver = false;
let gameRunning = false;
let highScore = localStorage.getItem("highScore") || 0; // Carrega o recorde salvo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Função para iniciar o jogo
function startGame() {
    gameRunning = true;
    birdY = canvas.height / 2;
    birdX = 50;
    birdSpeed = 0;
    gravity = 0.6;
    lift = -12;
    pipes = [];
    pipeWidth = 60;
    pipeGap = 150;
    pipeSpeed = 3;
    score = 0;
    frame = 0;
    
    // Esconde o menu e a tela de game over, exibe o canvas do jogo
    document.getElementById("menu").style.display = "none";
    document.getElementById("game-over").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("tutorial").style.display = "none";

    updateGame();
}

// Função para mostrar o tutorial
function showTutorial() {
    document.getElementById("tutorial").style.display = "block";
    document.getElementById("menu").style.display = "none";
}

// Função para voltar ao menu
function showMenu() {
    document.getElementById("tutorial").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

// Função para reiniciar o jogo
function retryGame() {
    gameOver = false;
    startGame();
}

// Função para desenhar o pássaro
function drawBird() {
    ctx.beginPath();
    ctx.arc(birdX, birdY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

// Função para desenhar os tubos
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight); // Tubo superior
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight); // Tubo inferior
    });
}

// Função para atualizar a posição dos tubos
function updatePipes() {
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
    pipes.forEach(pipe => pipe.x -= pipeSpeed);

    if (frame % 100 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            topHeight: pipeHeight,
            bottomHeight: canvas.height - pipeHeight - pipeGap
        });
    }
}

// Função para desenhar o fundo
function drawBackground() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Função para atualizar o jogo
function updateGame() {
    if (gameOver) {
        showGameOver();
        return;
    }

    birdSpeed += gravity;
    birdY += birdSpeed;

    drawBackground();
    drawBird();
    updatePipes();
    drawPipes();

    // Verificar colisões
    checkCollisions();

    // Atualizar pontuação
    updateScore();

    // Desenha a pontuação no jogo
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Pontuação: " + score, 10, 30);

    // Desenha o recorde no jogo
    ctx.fillText("Recorde: " + highScore, canvas.width - 150, 30);

    frame++;
    requestAnimationFrame(updateGame);
}

// Função para detectar colisões
function checkCollisions() {
    if (birdY - 10 < 0 || birdY + 10 > canvas.height) {
        gameOver = true;
    }

    pipes.forEach(pipe => {
        if (
            birdX + 10 > pipe.x && birdX - 10 < pipe.x + pipeWidth &&
            (birdY - 10 < pipe.topHeight || birdY + 10 > canvas.height - pipe.bottomHeight)
        ) {
            gameOver = true;
        }
    });
}

// Função para exibir o Game Over
function showGameOver() {
    // Exibe a pontuação final
    document.getElementById("score-final").innerText = score;

    // Atualiza o recorde
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore); // Salva o novo recorde no localStorage
    }

    // Exibe o recorde
    document.getElementById("high-score").innerText = highScore;

    // Exibe a tela de game over
    document.getElementById("game-over").style.display = "block";
    canvas.style.display = "none";
}

// Função para atualizar a pontuação
function updateScore() {
    pipes.forEach(pipe => {
        if (pipe.x + pipeWidth === birdX) {
            score++;
        }
    });
}

// Função para fazer o pássaro subir
function flap() {
    birdSpeed = lift;
}

// Adicionar evento de tecla para fazer o pássaro subir
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && gameRunning) {
        flap();
    }
});

// Iniciar o jogo automaticamente ao carregar a página
startGame();
