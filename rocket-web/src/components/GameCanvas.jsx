import React, { useEffect, useRef } from 'react';
import { getRandomStarSize, drawStar } from '../utils/canvasHelper';

export default function GameCanvas({ config, isConnected, onGameOver }) {
  const canvasRef = useRef(null);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rocketImg = new Image();
    rocketImg.src = '/rize2.png';

    const playerSize = 65;
    let playerX = (canvas.width - playerSize) / 2;
    const playerY = canvas.height - playerSize - 35;

    let life = config.life;
    let score = 0;
    let isGameOver = false;
    let isFeverTime = false;
    let leftPressed = false;
    let rightPressed = false;
    let enemies = [];
    let animationFrameId;

    function initGame() {
      life = config.life;
      score = 0;
      isGameOver = false;
      isFeverTime = false;
      playerX = (canvas.width - playerSize) / 2;
      enemies = [];
      for (let i = 0; i < config.enemyCount; i++) {
        const size = getRandomStarSize(config.minStarSize, config.maxStarSize);
        enemies.push({
          x: Math.random() * (canvas.width - size * 2),
          y: -Math.random() * canvas.height,
          size: size
        });
      }
    }

    initGame();

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') leftPressed = true;
      if (e.key === 'ArrowRight') rightPressed = true;
      if ((e.key === 'r' || e.key === 'R') && isGameOver) {
        initGame();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') leftPressed = false;
      if (e.key === 'ArrowRight') rightPressed = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    function update() {
      if (isGameOver) return;

      if (leftPressed && playerX > 0) playerX -= config.playerSpeed;
      if (rightPressed && playerX < canvas.width - playerSize) playerX += config.playerSpeed;

      isFeverTime = score >= config.feverTriggerScore;

      const pLeft = playerX + 18;
      const pRight = playerX + playerSize - 18;
      const pTop = playerY + 12;
      const pBottom = playerY + playerSize - 12;

      enemies.forEach((enemy) => {
        enemy.y += config.enemySpeed;

        if (enemy.y > canvas.height) {
          enemy.size = getRandomStarSize(config.minStarSize, config.maxStarSize);
          enemy.y = -enemy.size * 2;
          enemy.x = Math.random() * Math.max(1, canvas.width - enemy.size * 2);
          score += isFeverTime ? config.baseScore * config.feverMultiplier : config.baseScore;
        }

        const eLeft = enemy.x + 2;
        const eRight = enemy.x + enemy.size * 1.6;
        const eTop = enemy.y + 2;
        const eBottom = enemy.y + enemy.size * 1.6;

        if (pLeft < eRight && pRight > eLeft && pTop < eBottom && pBottom > eTop) {
          life--;
          enemy.size = getRandomStarSize(config.minStarSize, config.maxStarSize);
          enemy.y = -enemy.size * 2;
          enemy.x = Math.random() * Math.max(1, canvas.width - enemy.size * 2);

          if (life <= 0) {
            isGameOver = true;
            if (onGameOverRef.current) {
              onGameOverRef.current(score);
            }
          }
        }
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (rocketImg.complete && rocketImg.naturalWidth > 0) {
        ctx.drawImage(rocketImg, playerX, playerY, playerSize, playerSize);
      } else {
        ctx.fillStyle = 'cyan';
        ctx.fillRect(playerX, playerY, playerSize, playerSize);
      }

      enemies.forEach((enemy) => {
        drawStar(ctx, enemy.x + enemy.size, enemy.y + enemy.size, enemy.size, 'yellow');
      });

      ctx.fillStyle = 'white';
      ctx.font = "bold 18px '맑은 고딕'";
      ctx.textAlign = 'left';
      ctx.fillText(`점수: ${score}   |   남은 목숨: ${life}`, 20, 35);

      if (isFeverTime && !isGameOver) {
        ctx.fillStyle = 'orange';
        ctx.font = "bold 20px '맑은 고딕'";
        ctx.fillText(`🔥 FEVER TIME! 점수 ${config.feverMultiplier}배 획득 중! 🔥`, 20, 70);
      }

      if (isGameOver) {
        ctx.fillStyle = 'red';
        ctx.font = "bold 35px '맑은 고딕'";
        ctx.textAlign = 'center';
        ctx.fillText(config.gameOverMsg, canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = 'white';
        ctx.font = "20px '맑은 고딕'";
        ctx.fillText('다시 하려면 R 키를 누르세요!', canvas.width / 2, canvas.height / 2 + 30);
      }
    }

    function loop() {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [config]);

  return (
    <div className="game-section">
      <h2 className="game-title">
        {isConnected
          ? `🚀 ${config.gameTitle}`
          : '⚠️ Java 서버(8080) 미연결 (기본 모드로 실행 중)'}
      </h2>
      <canvas ref={canvasRef} width={550} height={650} className="game-canvas" />
    </div>
  );
}
