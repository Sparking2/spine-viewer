import "pixi-spine";

import { Application, Ticker } from "pixi.js";
import * as UI from "./ui";
import * as LoadEvents from "./load-events";

export let pixiApp: Application;
export let view: HTMLCanvasElement;

function init() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const canvas = document.createElement("canvas");
  canvas.id = "pixi-canvas";
  app.appendChild(canvas);
  view = canvas as HTMLCanvasElement;
  view.addEventListener("drop", LoadEvents.dropHandler);
  view.addEventListener("dragover", LoadEvents.dragHandler);

  pixiApp = new Application({
    view: view,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x808080,
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
  });

  UI.init();
  UI.draw();

  Ticker.shared.add(UI.drawFPS);

  UI.showErrorPanel("ERROR WITH...");
}

init();
