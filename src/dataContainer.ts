import {
  animationButtonClicked,
  clickedSkinButton,
  playButtonClicked,
} from "./ui-interactions";
import { Spine } from "pixi-spine";
import { pixiApp, view } from "./main";

export interface EnvironmentData {
  fileName: string;
  animations: string[];
  activeAnimationIndex: number;
  skins: string[];
  activeSkinIndex: number;
  actions: Map<string, Function>;
  isAnimationPlaying: boolean;
  activeSpine: Spine | null;
}

export let environmentData: EnvironmentData = {
  fileName: "",
  animations: [],
  activeAnimationIndex: 0,
  skins: [],
  activeSkinIndex: 0,
  isAnimationPlaying: true,
  actions: new Map([
    ["play", playButtonClicked],
    ["changeAnimation", animationButtonClicked],
    ["changeSkin", clickedSkinButton],
  ]),
  activeSpine: null,
};

export const setActiveSpine = (x: Spine) => {
  // Set new ActiveSpine
  if (environmentData.activeSpine != null)
    environmentData.activeSpine.destroy();
  environmentData.activeSpine = x;
  // Set animations Array
  environmentData.animations =
    environmentData.activeSpine.spineData.animations.map((x) => x.name);
  // Set skins Array
  environmentData.skins = environmentData.activeSpine.spineData.skins.map(
    (x) => x.name
  );
  // Set initial animation
  environmentData.activeAnimationIndex = 0;
  // Set active animation
  environmentData.activeSpine.state.setAnimation(
    0,
    environmentData.animations[0],
    true
  );

  // add active spine to stage
  pixiApp.stage.addChild(environmentData.activeSpine);
  // position element in a nice place
  environmentData.activeSpine.position.set(
    view.width * 0.25,
    view.height * 0.5
  );
};

export const updateAnimationSpeed = (speed: number) => {
  if (!environmentData.activeSpine) return;
  environmentData.activeSpine.state.timeScale = speed;
};
