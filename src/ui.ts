import { Application, Container, Graphics, Text } from "pixi.js";

export function draw(app: Application) {
  const width = app.view.width;
  const height = app.view.height;

  const text = new Text("SHAPES_01");
  app.stage.addChild(text);
  text.position.set(width * 0.025, height * 0.05);

  let animationsContainer = new Container();
  app.stage.addChild(animationsContainer);
  animationsContainer.position.set(width * 0.73, 25);

  let animationsContainerWith = width * 0.25;
  let animationsContainerHeight = height - 50;

  let bg = new Graphics();
  animationsContainer.addChild(bg);
  bg.beginFill(0x000c66);
  bg.drawRect(0, 0, animationsContainerWith, animationsContainerHeight);
  bg.endFill();

  animationsContainer.addChild(bg);

  let spacing = animationsContainerHeight / 5;

  for (let i = 0; i < 4; i++) {
    let buttonContainer = new Container();
    let button = new Graphics();
    buttonContainer.addChild(button);
    button.beginFill(0x7ec8e3);
    button.drawRect(
      animationsContainerWith * 0.1,
      spacing * i,
      animationsContainerWith * 0.8,
      animationsContainerHeight / 6
    );
    let label = new Text(`animation_${i}`);
    buttonContainer.addChild(label);
    label.position.set(0, buttonContainer.height / 2);
    button.endFill();

    animationsContainer.addChild(buttonContainer);
  }
}
