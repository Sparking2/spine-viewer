import { environmentData } from "./dataContainer";
import * as UI from "./ui";

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
