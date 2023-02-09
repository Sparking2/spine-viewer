import { Container, Graphics, Text } from "pixi.js";
import { environmentData } from "./dataContainer";
import { pixiApp } from "./main";

let uiContainer: null | Container = null;

export function draw() {
  const width = pixiApp.view.width;
  const height = pixiApp.view.height;

  if (uiContainer !== null) {
    uiContainer.removeChildren();
  } else {
    uiContainer = new Container();
    pixiApp.stage.addChild(uiContainer);
  }

  uiContainer.addChild(drawFileName(width, height, environmentData.fileName));

  const changeAnimFunc = environmentData.actions.get("changeAnimation");
  if (changeAnimFunc != undefined)
    uiContainer.addChild(
      drawAnimationsPanel(
        width,
        height,
        environmentData.animations,
        changeAnimFunc
      )
    );

  uiContainer.addChild(drawSkinsPanel(width, height, environmentData.skins));

  const playFunc = environmentData.actions.get("play");
  if (playFunc != undefined)
    uiContainer.addChild(drawPlayButton(width, height, playFunc));
}

function drawPlayButton(
  width: number,
  height: number,
  callback: Function
): Container {
  let mainContainer = new Container();
  let bg = new Graphics();
  bg.beginFill(0xffff00);
  bg.drawRect(0, 0, width * 0.25, height * 0.1);
  bg.endFill();
  mainContainer.addChild(bg);
  let msg = environmentData.isAnimationPlaying ? "PAUSE" : "PLAY";
  let label = new Text(msg);
  label.position.set(mainContainer.width * 0.1, mainContainer.height * 0.2);
  mainContainer.addChild(label);
  mainContainer.position.set(width * 0.725, height - 100);

  mainContainer.interactive = true;
  mainContainer.on("mousedown", () => {
    callback();
  });

  return mainContainer;
}

function drawAnimationsPanel(
  width: number,
  height: number,
  animations: string[] = [],
  callback: Function
): Container {
  let mainContainer = new Container();
  mainContainer.position.set(width * 0.73, 50);

  let areaWith = width * 0.25;
  let areaHeight = height - 200;

  let bg = new Graphics();
  bg.beginFill(0x000c66);
  bg.drawRect(0, 0, areaWith, areaHeight);
  bg.endFill();
  mainContainer.addChild(bg);

  const tempAreaHeight = areaHeight / animations.length + 1;
  const spacing = tempAreaHeight / animations.length;

  const buttonAreaWidth = areaWith * 0.8;
  const buttonAreaHeight =
    (areaHeight - spacing * animations.length) / animations.length;

  const buttonLeftMargin = buttonAreaWidth * 0.125;

  for (let i = 0; i < animations.length; i++) {
    let buttonContainer = new Container();
    let buttonBg = new Graphics();

    let color = environmentData.activeAnimationIndex == i ? 0x162226 : 0x7ec8e3;

    buttonBg.beginFill(color);
    buttonBg.drawRect(0, 0, buttonAreaWidth, buttonAreaHeight);
    buttonBg.endFill();
    buttonContainer.addChild(buttonBg);
    buttonContainer.position.set(
      buttonLeftMargin,
      (buttonAreaHeight + spacing) * i
    );

    const label = new Text(`${animations[i]}`);
    label.position.set(buttonAreaWidth * 0.1, buttonAreaHeight * 0.15);
    buttonContainer.addChild(label);

    buttonContainer.interactive = true;
    buttonContainer.on("mousedown", () => {
      callback(i);
    });

    mainContainer.addChild(buttonContainer);
  }
  return mainContainer;
}

function drawFileName(width: number, height: number, name: string) {
  const text = new Text(name);
  text.position.set(width * 0.025, height * 0.05);
  return text;
}

function drawSkinsPanel(
  width: number,
  height: number,
  skins: string[] = ["default", "test", "test2", "test5"]
): Container {
  let mainContainer = new Container();
  mainContainer.position.set(width * 0.025, height * 0.75);
  let areaWith = width * 0.6;
  let areaHeight = height * 0.2;
  let bg = new Graphics();
  bg.beginFill(0x000c66);
  bg.drawRect(0, 0, areaWith, areaHeight);
  bg.endFill();
  mainContainer.addChild(bg);

  const spacing = 5;
  const remainingWidth = areaWith - (spacing * skins.length + 1);
  const buttonAreaHeight = areaHeight * 0.5;
  const buttonAreaWidth = remainingWidth / skins.length;

  let buttonContainer = new Container();
  mainContainer.addChild(buttonContainer);

  for (let i = 0; i < skins.length; i++) {
    let buttonContainer = new Container();
    let buttonBg = new Graphics();
    buttonBg.beginFill(0x7ec8e3);
    buttonBg.drawRect(0, 0, buttonAreaWidth, buttonAreaHeight);
    buttonBg.endFill();
    buttonContainer.addChild(buttonBg);
    buttonContainer.position.set(
      (buttonAreaWidth + spacing) * i,
      areaHeight * 0.25
    );

    const label = new Text(`${skins[i]}`);
    label.position.set(buttonAreaWidth * 0.1, buttonAreaHeight * 0.3);
    buttonContainer.addChild(label);

    mainContainer.addChild(buttonContainer);
  }

  return mainContainer;
}
