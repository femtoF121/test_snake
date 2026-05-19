import { GUI } from "./classes/GUI.js";
import { Game } from "./classes/Game.js";

const gui = new GUI();
const game = new Game(gui);

game.init().then(() => {
  gui.onPlay = (mode) => {
    game.start(mode);
  };

  gui.onMenu = () => {
    game.stop();
    game.reset();
  };
});
