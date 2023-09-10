export default interface H265Options {
  player: string;
  width: number | string;
  height: number | string;
  token: string | undefined;
  extInfo: {
    probeSize: number;
    ignoreAudio: number;
    coreProbePart: number;
    autoPlay: boolean;
    cacheLength: number;
    rawFps: number;
  };
}
