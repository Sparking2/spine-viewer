import {
  BitmapFont,
  BitmapText,
  Container,
  Graphics,
  Text,
  Ticker,
} from "pixi.js";
import { environmentData } from "./dataContainer";
import { pixiApp, view } from "./main";
import { onDragEnd, onDragMove, onDragStart } from "./ui-interactions";
import { buttonBGNormal, buttonBGSelected, panelBG } from "./colors";

let uiContainer: Container | null = null;
let fpsLabel: BitmapText | null = null;

export function init() {
  BitmapFont.from(
    "TmpFont",
    {
      fill: "#333333",
      fontSize: 16,
      fontWeight: "bold",
    },
    {
      chars: [["a", "z"], ["0", "9"], ["A", "Z"], ".,:?><"],
    }
  );
  fpsLabel = new BitmapText("FPS: 0", { fontName: "TmpFont" });
  pixiApp.stage.addChild(fpsLabel);
  fpsLabel.position.set(view.width * 0.825, view.height * 0.05);
}

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

  uiContainer.addChild(drawSlider());
}

function drawPlayButton(
  width: number,
  height: number,
  callback: Function
): Container {
  let mainContainer = new Container();
  let bg = new Graphics();
  bg.beginFill(
    environmentData.isAnimationPlaying ? buttonBGSelected : buttonBGNormal
  );
  bg.drawRect(0, 0, width * 0.25, height * 0.2);
  bg.endFill();
  mainContainer.addChild(bg);
  let msg = environmentData.isAnimationPlaying ? "PAUSE" : "PLAY";
  let label = new Text(msg);
  label.anchor.set(0.5, 0.5);
  label.position.set(mainContainer.width * 0.5, mainContainer.height * 0.5);
  mainContainer.addChild(label);
  mainContainer.position.set(width * 0.73, height * 0.75);

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
  bg.beginFill(panelBG);
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

    let color =
      environmentData.activeAnimationIndex == i
        ? buttonBGSelected
        : buttonBGNormal;

    buttonBg.beginFill(color);
    buttonBg.drawRect(0, 0, buttonAreaWidth, buttonAreaHeight);
    buttonBg.endFill();
    buttonContainer.addChild(buttonBg);
    buttonContainer.position.set(
      buttonLeftMargin,
      (buttonAreaHeight + spacing) * i
    );

    const label = new Text(`${animations[i]}`);
    label.anchor.set(0.5, 0.5);
    label.position.set(buttonAreaWidth * 0.5, buttonAreaHeight * 0.5);
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
  let areaWith = width * 0.69;
  let areaHeight = height * 0.2;
  let bg = new Graphics();
  bg.beginFill(panelBG);
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
    let color =
      environmentData.activeSkinIndex == i ? buttonBGSelected : buttonBGNormal;
    buttonBg.beginFill(color);
    buttonBg.drawRect(0, 0, buttonAreaWidth, buttonAreaHeight);
    buttonBg.endFill();
    buttonContainer.addChild(buttonBg);
    buttonContainer.position.set(
      (buttonAreaWidth + spacing) * i,
      areaHeight * 0.25
    );
    const label = new Text(`${skins[i]}`);
    label.anchor.set(0.5, 0.5);
    label.position.set(buttonAreaWidth * 0.5, buttonAreaHeight * 0.5);
    buttonContainer.addChild(label);

    mainContainer.addChild(buttonContainer);
  }

  return mainContainer;
}

export function showErrorPanel(msg: string) {
  const mainContainer = new Container();

  const bg = new Graphics();
  bg.beginFill(0xffffff);
  bg.drawRect(0, 0, view.width * 0.5, view.height * 0.5);
  bg.endFill();
  mainContainer.addChild(bg);
  bg.position.set(view.width * 0.25, view.height * 0.25);

  const txt = new Text(msg);
  mainContainer.addChild(txt);
  txt.position.set(mainContainer.width * 0.5, mainContainer.height * 0.5);

  const closeButton = new Graphics();
  closeButton.beginFill(0x00ffff);
  closeButton.drawRect(
    0,
    0,
    mainContainer.width * 0.25,
    mainContainer.height * 0.25
  );
  closeButton.endFill();
  closeButton.position.set(
    mainContainer.width * 0.9,
    mainContainer.height * 1.1
  );
  closeButton.interactive = true;
  closeButton.on("click", () => {
    mainContainer.destroy();
  });
  const closeLabel = new Text("Close");
  closeLabel.position.set(20, 10);
  closeButton.addChild(closeLabel);
  mainContainer.addChild(closeButton);

  pixiApp.stage.addChild(mainContainer);
}

export function drawSlider() {
  let mainContainer = new Container();

  let bg = new Graphics();
  bg.beginFill(panelBG);
  bg.drawRect(0, 0, view.width * 0.45, view.height * 0.02);
  bg.endFill();
  mainContainer.addChild(bg);

  mainContainer.pivot.set(mainContainer.width / 2, 0);
  mainContainer.position.set(view.width / 2, 10);

  let sliderKnob = new Graphics();
  sliderKnob.beginFill(buttonBGSelected);
  sliderKnob.drawCircle(0, 0, view.height * 0.021);
  sliderKnob.endFill();
  sliderKnob.position.set(mainContainer.width / 2, mainContainer.height / 2);
  sliderKnob.interactive = true;
  sliderKnob
    .on("mousedown", onDragStart)
    .on("mouseup", onDragEnd)
    .on("mousemove", onDragMove);
  mainContainer.addChild(sliderKnob);

  return mainContainer;
}

export function drawFPS(_: number) {
  if (fpsLabel === null) return;
  fpsLabel.text = `FPS: ${Math.trunc(Ticker.shared.FPS)}`;
}
