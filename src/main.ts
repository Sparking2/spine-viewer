import "pixi-spine";

import { Application, BaseTexture } from "pixi.js";
import { ISkeletonData, Spine, TextureAtlas } from "pixi-spine";
import * as SpineRuntime from "@pixi-spine/runtime-4.1";
import * as ReadPromises from "./readPromises";
import * as UI from "./ui";
import { SpineData } from "./dataContainer";

let currentSpine: Spine | null = null;

let loadedSpineData: SpineData = {
  fileName: "",
  animations: [],
  skins: [],
  activeAnimationIndex: 0,
  isAnimationPlaying: true,
  actions: new Map([
    ["play", playClicked],
    ["changeAnimation", animationClicked],
  ]),
};

const app = document.querySelector<HTMLDivElement>("#app")!;

const canvas = document.createElement("canvas");
canvas.id = "pixi-canvas";
app.appendChild(canvas);
const view = canvas as HTMLCanvasElement;
view.addEventListener("drop", dropHandler);
view.addEventListener("dragover", dragHandler);

const pixiApp = new Application({
  view: view,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x808080,
  width: window.innerWidth / 2,
  height: window.innerHeight / 2,
});

UI.draw(pixiApp, loadedSpineData);

function dragHandler(ev: Event) {
  ev.preventDefault();
}

async function dropHandler(ev: DragEvent) {
  ev.preventDefault();
  if (!ev.dataTransfer) return;

  if (!ev.dataTransfer.items) {
    console.error("no file");
    return;
  }

  let promiseSkeleton = ReadPromises.emptyPromise();
  let promiseAtlas = ReadPromises.emptyPromise();
  let promiseImage = ReadPromises.emptyPromise();

  let rawSkeletonData: string = "";
  let rawAtlasData: string = "";
  let image: string = "";

  let length = ev.dataTransfer.items.length;
  for (let i = 0; i < length; i++) {
    const item = ev.dataTransfer.items[i];
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (!file) return;
      const fieType = file.name.split(".").pop();
      switch (fieType) {
        case "json":
          {
            loadedSpineData.fileName = file.name.split(".")[0];
            promiseSkeleton = ReadPromises.promiseReadAsText(file);
          }
          break;
        case "atlas":
          {
            promiseAtlas = ReadPromises.promiseReadAsText(file);
          }
          break;
        case "png":
          {
            promiseImage = ReadPromises.promiseReadAsURL(file);
          }
          break;
      }
    }
  }

  await promiseSkeleton
    .then((r) => (rawSkeletonData = JSON.parse(r)))
    .catch(displayError);
  await promiseAtlas.then((r) => (rawAtlasData = r)).catch(displayError);
  await promiseImage.then((r) => (image = r)).catch(displayError);

  let spineAtlas = new TextureAtlas(rawAtlasData, (_, callback) => {
    callback(BaseTexture.from(image));
  });

  let spineAtlasLoader = new SpineRuntime.AtlasAttachmentLoader(spineAtlas);
  let spineJsonParser = new SpineRuntime.SkeletonJson(spineAtlasLoader);
  spineJsonParser.scale = 0.25;
  let spineData = spineJsonParser.readSkeletonData(rawSkeletonData);
  if (currentSpine != null) currentSpine.destroy();
  currentSpine = new Spine(spineData as ISkeletonData);

  loadedSpineData.animations = currentSpine.spineData.animations.map(
    (x) => x.name
  );
  loadedSpineData.skins = currentSpine.spineData.skins.map((x) => x.name);
  loadedSpineData.activeAnimationIndex = 3;
  currentSpine.state.setAnimation(
    0,
    loadedSpineData.animations[loadedSpineData.activeAnimationIndex],
    true
  );
  pixiApp.stage.addChild(currentSpine);
  currentSpine.position.set(view.width * 0.25, view.height * 0.5);

  UI.draw(pixiApp, loadedSpineData);

  console.log(loadedSpineData);
}

function playClicked() {
  if (currentSpine === null) return;
  loadedSpineData.isAnimationPlaying = !loadedSpineData.isAnimationPlaying;
  currentSpine.state.timeScale = loadedSpineData.isAnimationPlaying ? 1.0 : 0.0;
}

function animationClicked(index: number) {
  if (currentSpine === null) return;
  currentSpine.state.clearTracks();
  currentSpine.state.setAnimation(
    index,
    loadedSpineData.animations[index],
    true
  );
}

const displayError = (error: string) => {
  console.error(error);
};
