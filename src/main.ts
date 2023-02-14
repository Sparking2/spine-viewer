import "pixi-spine";

import { Application, Ticker } from "pixi.js";
import * as UI from "./ui";
import * as LoadEvents from "./load-events";
import { mainBG } from "./colors";
import "./style.css";

let size = [1920, 1080];
let ratio = size[0] / size[1];

export let pixiApp: Application;
export let view: HTMLCanvasElement;

function init() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.className = "app flex-center";
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
    backgroundColor: mainBG,
    width: app.clientWidth * 0.9,
    height: app.clientHeight * 0.9,
    resizeTo: app,
  });

  resize();
  window.onresize = resize;

  UI.init();
  UI.draw();

  Ticker.shared.maxFPS = 60;
  Ticker.shared.add(UI.drawFPS);

  UI.showErrorPanel("ERROR WITH...");
}

function resize() {
  let w: number;
  let h: number;

  if (window.innerWidth / window.innerHeight >= ratio) {
    w = window.innerHeight * ratio;
    h = window.innerHeight;
  } else {
    w = window.innerWidth;
    h = window.innerWidth / ratio;
  }
  view.style.width = w + "px";
  view.style.height = h + "px";

  setTimeout(() => {
    UI.draw();
  }, 100);
}

init();
