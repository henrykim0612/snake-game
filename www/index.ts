import __wbg_init, {World, Direction, GameStatus} from "snake-game";
import {rnd} from "./utils/rnd";

__wbg_init().then(wasm => {
  const CELL_SIZE = 20;
  const WORLD_WIDTH = 4;
  const snakeSpawnIdx = rnd(WORLD_WIDTH * WORLD_WIDTH);

  const world = World.new(WORLD_WIDTH, snakeSpawnIdx);
  const worldWidth = world.width();

  const $points = document.getElementById("points");
  const $gameStatus = document.getElementById("game-status");
  const $gameControlBtn = document.getElementById("game-control-btn");
  const $canvas = document.getElementById("snake-canvas") as HTMLCanvasElement;
  const ctx = $canvas.getContext("2d");

  $canvas.height = worldWidth * CELL_SIZE;
  $canvas.width = worldWidth * CELL_SIZE;

  const snakeCellPtr = world.snake_cells();
  const snakeLen = world.snake_length();

  $gameControlBtn.addEventListener("click", _ => {
    const status = world.game_status();

    if (status === undefined) {
      $gameControlBtn.textContent = "Playing..."
      world.start_game();
      play();
    } else {
      location.reload();
    }
  })

  document.addEventListener("keydown", e => {
    switch (e.code) {
      case "ArrowUp":
        world.change_snake_dir(Direction.Up);
        break;
      case "ArrowRight":
        world.change_snake_dir(Direction.Right);
        break;
      case "ArrowDown":
        world.change_snake_dir(Direction.Down);
        break;
      case "ArrowLeft":
        world.change_snake_dir(Direction.Left);
        break;
    }
  })

  function drawWorld() {
    ctx.beginPath();

    for (let x = 0; x < worldWidth + 1; x++) {
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, worldWidth * CELL_SIZE);
    }

    for (let y = 0; y < worldWidth + 1; y++) {
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(worldWidth * CELL_SIZE, y * CELL_SIZE);
    }

    ctx.stroke();
  }

  function drawReward() {
    const idx = world.reward_cell();
    const col = idx % worldWidth;
    const row = Math.floor(idx / worldWidth);

    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(
      col * CELL_SIZE,
      row * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
    ctx.stroke();
  }

  function drawSnake() {
    const snakeCells = new Uint32Array(
      wasm.memory.buffer,
      world.snake_cells(),
      world.snake_length()
    )

    snakeCells
      .filter((cellIdx, i) => !(i > 0 && cellIdx === snakeCells[0])) // 충돌 시 머리 색깔 유지를 위한 필터
      .forEach((cellIdx, i) => {
        const col = cellIdx % worldWidth;
        const row = Math.floor(cellIdx / worldWidth);

        // we are overriding snake head color by body when we crush
        ctx.fillStyle = i === 0 ? "#0093ff" : "#000000";

        ctx.beginPath();
        ctx.fillRect(
          col * CELL_SIZE,
          row * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      })
    ctx.stroke();
  }

  function drawGameStatus() {
    $gameStatus.textContent = world.game_status_text();
    $points.textContent = world.points().toString();

    const status = world.game_status();
    if (status == GameStatus.Won || status == GameStatus.Lost) {
      $gameControlBtn.textContent = "Re-Play";
    }
  }

  function paint() {
    drawWorld();
    drawSnake();
    drawReward();
    drawGameStatus();
  }

  function play() {
    const status = world.game_status();

    if (status == GameStatus.Won || status == GameStatus.Lost) {
      $gameControlBtn.textContent = "Re-Play";
      return;
    }

    const fps = 3;
    setTimeout(() => {
      ctx.clearRect(0, 0, $canvas.width, $canvas.height);
      world.step();
      paint();
      // the method takes a callback to invoked before the next repaint
      requestAnimationFrame(play);
    }, 1000 / fps);
  }

  paint();
});
