import { useEffect } from "react";

const cache = {} as { [k: string]: HTMLAudioElement };

type AudioPlayerProps = {
  mute?: boolean;
  file: string | undefined;
  deps: any[];
};

export function useSound(file: string | undefined, deps: any[]) {
  useEffect(() => {
    if (file) {
      try {
        cache[file] = cache[file] || new Audio(`/${file}.mp3`);
        cache[file].play();
      } catch (e) {
        console.error(e);
      }
    }
  }, deps);
}

export function AudioPlayer({ mute, file, deps }: AudioPlayerProps) {
  useSound(mute ? file : undefined, deps);

  return null;
}

export function FakeAudioPlayer({ mute, file, deps }: AudioPlayerProps) {
  return <div>{file}</div>;
}
