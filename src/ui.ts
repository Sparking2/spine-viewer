import { Application, Container, Graphics, Text } from "pixi.js";

export function draw(app: Application) {
  const width = app.view.width;
  const height = app.view.height;

  const text = new Text("SHAPES_01");
  app.stage.addChild(text);
  text.position.set(width * 0.025, height * 0.05);

  app.stage.addChild(
    drawAnimationsPanel(width, height, ["walking", "running", "dead"])
  );
}

function drawAnimationsPanel(
  width: number,
  height: number,
  animations: string[] = ["hello"]
): Container {
  let mainContainer = new Container();
  mainContainer.position.set(width * 0.73, 25);

  let areaWith = width * 0.25;
  let areaHeight = height - 50;

  let bg = new Graphics();
  bg.beginFill(0x000c66);
  bg.drawRect(0, 0, areaWith, areaHeight);
  bg.endFill();
  mainContainer.addChild(bg);

  const spacing = 10;
  const buttonAreaWidth = areaWith * 0.8;
  const buttonAreaHeight = areaHeight / animations.length + 1;
  const buttonLeftMargin = buttonAreaWidth * 0.125;

  for (let i = 0; i < animations.length; i++) {
    let buttonContainer = new Container();
    let buttonBg = new Graphics();
    buttonBg.beginFill(0x7ec8e3);
    buttonBg.drawRect(0, 0, buttonAreaWidth, buttonAreaHeight);
    buttonBg.endFill();
    buttonContainer.addChild(buttonBg);
    buttonContainer.position.set(
      buttonLeftMargin,
      (buttonAreaHeight + spacing) * i
    );

    const label = new Text(`${animations[i]}`);
    label.position.set(buttonAreaWidth * 0.1, buttonAreaHeight * 0.3);
    buttonContainer.addChild(label);

    mainContainer.addChild(buttonContainer);
  }
  return mainContainer;
}
