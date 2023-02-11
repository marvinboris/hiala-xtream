import { ChangeEvent, useState } from 'react'
import { useEffect, useRef } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'

import type { AppDispatch, AppState } from './store'

export const useForm =
  <TContent>(defaultValues: TContent) =>
    (handler: (content: TContent) => void) =>
      async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.persist()

        const form = event.target as HTMLFormElement
        const elements = Array.from(form.elements) as HTMLInputElement[]
        const data = elements
          .filter((element) => element.hasAttribute('name'))
          .reduce(
            (object, element) => ({
              ...object,
              [`${element.getAttribute('name')}`]: element.value,
            }),
            defaultValues
          )
        await handler(data)
        form.reset()
      }

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function>()
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  useEffect(() => {
    const handler = (...args: any) => savedCallback.current?.(...args)

    if (delay !== null) {
      const id = setInterval(handler, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export const usePlayer = (options: VideoJsPlayerOptions) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [player, setPlayer] = useState<VideoJsPlayer & {
    landscapeFullscreen?: ({ }) => void
  } | null>(null);

  useEffect(() => {
    const vjsPlayer = videojs(videoRef.current!, options);
    setPlayer(vjsPlayer);

    return () => {
      console.log('Disposing')
      if (player !== null) {
        player.dispose();
        player.pause()
        player.reset()
      }
    };
  }, []);
  useEffect(() => {
    if (player !== null) {
      require('videojs-landscape-fullscreen')
      player.landscapeFullscreen!({
        fullscreen: {
          enterOnRotate: true,
          exitOnRotate: true,
          alwaysInLandscapeMode: true,
          iOS: true
        }
      })
      player.autoplay(options.autoplay!)
      player.controls(options.controls!)
      player.fluid(options.fluid!)
      player.responsive(options.responsive!)
      player.src(options.sources!)
    }
  }, [options.src]);

  return videoRef;
};

export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{ width: number | undefined, height: number | undefined }>({
    width: undefined,
    height: undefined,
  });

  // Handler to call on window resize
  const handleResize = () => {
    // Set window width/height to state
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector