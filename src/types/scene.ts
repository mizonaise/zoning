export interface SceneData {
  base: string;
  door: Record<string, string>;
  handle: Record<string, string>;
}

export interface ConfigData {
  [key: string]: SceneData;
}

export interface Options {
  door: string;
  handle: string;
}

export interface ConfiguratorPanelProps {
  options: Options;
  setOptions: React.Dispatch<React.SetStateAction<Options>>;
  configData: SceneData;
}

export interface StylerCanvasProps {
  layers: string[];
}
