import __wbg_init, { World } from "snake-game";

__wbg_init().then(() => {
    const world = World.new();
    console.log(world.width);
});
