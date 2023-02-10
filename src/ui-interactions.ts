import { environmentData, updateAnimationSpeed } from "./dataContainer";
import * as UI from "./ui";
import { FederatedMouseEvent, Graphics } from "pixi.js";
import { view } from "./main";

export const playButtonClicked = () => {
  if (environmentData.activeSpine === null) return;
  environmentData.isAnimationPlaying = !environmentData.isAnimationPlaying;
  environmentData.activeSpine.state.timeScale =
    environmentData.isAnimationPlaying ? 1.0 : 0.0;
  UI.draw();
};

export const animationButtonClicked = (index: number) => {
  if (environmentData.activeSpine === null) return;

  environmentData.activeAnimationIndex = index;

  environmentData.activeSpine.state.clearTracks();
  environmentData.activeSpine.state.setAnimation(
    index,
    environmentData.animations[index],
    true
  );
  UI.draw();
};

export const clickedSkinButton = (index: number) => {
  if (environmentData.activeSpine === null) return;
  environmentData.activeSkinIndex = index;
  environmentData.activeSpine.skeleton.skin =
    environmentData.activeSpine.spineData.skins[index];
};

export function onDragStart(event: FederatedMouseEvent) {
  let target: any = event.currentTarget;
  target.dragging = true;
  target = event.currentTarget as Graphics;
  target.alpha = 0.5;
}
export function onDragEnd(event: FederatedMouseEvent) {
  let target: any = event.currentTarget;
  target.dragging = false;
  target = event.currentTarget as Graphics;
  target.alpha = 1;
}
export function onDragMove(event: FederatedMouseEvent) {
  let target: any = event.currentTarget;
  if (!target.dragging) return;
  let parentWidth = view.width * 0.5;

  target = event.currentTarget as Graphics;
  let curPos = target.position;
  curPos.x += event.movementX;

  if (curPos.x < 1) curPos.x = 1;
  if (curPos.x > parentWidth) curPos.x = parentWidth;

  target.position.set(curPos.x, curPos.y);

  let percentage = curPos.x / parentWidth;
  let speed: number = percentage * 2;
  updateAnimationSpeed(speed);
}
