export interface SpineData {
  fileName: string;
  animations: string[];
  activeAnimationIndex: number;
  skins: string[];
  actions: Map<string, Function>;
  isAnimationPlaying: boolean;
}
