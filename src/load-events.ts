import * as ReadPromises from "./readPromises";
import { environmentData, setActiveSpine } from "./dataContainer";
import { ISkeletonData, Spine, TextureAtlas } from "pixi-spine";
import { BaseTexture } from "pixi.js";
import * as SpineRuntime from "@pixi-spine/runtime-4.1";
import * as UI from "./ui";

export function dragHandler(ev: Event) {
  ev.preventDefault();
}

export async function dropHandler(ev: DragEvent) {
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
            environmentData.fileName = file.name.split(".")[0];
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
    .catch(displayConsoleError);
  await promiseAtlas.then((r) => (rawAtlasData = r)).catch(displayConsoleError);
  await promiseImage.then((r) => (image = r)).catch(displayConsoleError);

  let spineAtlas = new TextureAtlas(rawAtlasData, (_, callback) => {
    callback(BaseTexture.from(image));
  });

  let spineAtlasLoader = new SpineRuntime.AtlasAttachmentLoader(spineAtlas);
  let spineJsonParser = new SpineRuntime.SkeletonJson(spineAtlasLoader);
  spineJsonParser.scale = 0.25;
  let spineData = spineJsonParser.readSkeletonData(rawSkeletonData);

  setActiveSpine(new Spine(spineData as ISkeletonData));

  UI.draw();

  UI.showErrorPanel("Can't open files");
}

const displayConsoleError = (error: string) => {
  console.error(error);
};
