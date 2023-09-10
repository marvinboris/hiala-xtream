export default interface H265Player {
  onLoadFinish: () => void;
  onReadyShowDone: () => void;
  setVoice: (voice: number) => void;
  mediaInfo: () => {
    meta: {
      isHEVC: boolean;
    };
  };
  do: () => void;
  seek: (time: number) => void;
  fullScreen: () => void;
  release: () => void;
  isPlaying: () => boolean;
  pause: () => void;
  play: () => void;
}
