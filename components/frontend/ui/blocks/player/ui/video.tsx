import {
  ArrowLeftIcon,
  Bars3Icon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerPluginOptions } from "video.js";
import "video.js/dist/video-js.css";

import { assets, classNames } from "../../../../../../app/helpers/utils";
import { useAppSelector } from "../../../../../../app/hooks";
import SeriesEpisodeType from "../../../../../../app/types/series/episode";
import StreamType from "../../../../../../app/types/stream";
import StreamCategoryType from "../../../../../../app/types/stream_category";

import { selectAuth } from "../../../../../../features/auth/authSlice";

type VideoProps = {
  live?: boolean;
  info: StreamType | SeriesEpisodeType;
  category: StreamCategoryType;
  onEnded?: () => void;
  options: VideoJsPlayerPluginOptions;
  children?: ReactNode;
};

export default function Video({
  live,
  info,
  category,
  onEnded,
  options,
  children,
}: VideoProps) {
  const { back, push } = useRouter();

  const { data: account } = useAppSelector(selectAuth);
  const [addon, setAddon] = useState(false);

  const type = "stream_source" in info ? "stream" : "serie";
  const condition = !account?.bouquet?.find(
    (bouquet) =>
      (type === "stream" &&
        bouquet.bouquet_channels.find(
          (stream) => stream === (info as StreamType).id
        )) ||
      (type === "serie" &&
        bouquet.bouquet_series.find(
          (serie) => serie === (info as SeriesEpisodeType).series_id
        ))
  );

  useEffect(() => {
    if (condition) push("/bouquets");
  }, []);

  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<
    | (VideoJsPlayer & {
        landscapeFullscreen?: ({}) => void;
        rewindFastForward?: (player: VideoJsPlayer, rewind?: boolean) => void;
      })
    | null
  >(null);

  const name = capitalize(category.category_name.toLocaleLowerCase());

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current?.appendChild(videoElement);

      playerRef.current = videojs(videoElement, options);

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      require("@video-js-plugins/videojs-rewind-fast-forward");
      player.rewindFastForward!(player, true);

      require("videojs-landscape-fullscreen");
      player.landscapeFullscreen!({
        fullscreen: {
          enterOnRotate: true,
          exitOnRotate: true,
          alwaysInLandscapeMode: true,
          iOS: true,
        },
      });

      player.autoplay(options.autoplay);
      player.controls(options.controls);
      player.responsive(options.responsive);
      player.fluid(options.fluid);
      player.src(options.sources);
      onEnded && player.on("ended", onEnded);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <main>
      <div className="min-h-screen flex flex-wrap bg-secondary-900">
        <div className="flex-none w-full lg:flex-1 flex flex-col overflow-x-hidden">
          <div>
            <header className="container flex items-center h-[100px] lg:h-[133px]">
              <div className="mr-3 md:mr-10">
                <div
                  onClick={back}
                  className="cursor-pointer w-11 h-11 rounded-full flex items-center justify-center bg-white/30 text-white"
                >
                  <ArrowLeftIcon className="w-6" />
                </div>
              </div>
              {live ? (
                <img
                  src={assets(
                    ("stream_source" in info ? info : info.stream).stream_icon
                  )}
                  alt="Stream Icon"
                  className="h-12 object-center mr-4"
                />
              ) : null}
              <div className="flex-1 truncate mr-6">
                <div
                  className="text-xl font-bold text-white truncate capitalize"
                  title={
                    ("stream_source" in info ? info : info.stream)
                      .stream_display_name
                  }
                >
                  {
                    ("stream_source" in info ? info : info.stream)
                      .stream_display_name
                  }
                </div>
                <div className="text-xs md:text-sm">{name}</div>
              </div>
              <div className="ml-auto">
                {
                  <div className="flex items-center">
                    <HeartIcon className="w-6 text-white mr-0 lg:mr-14 cursor-pointer" />

                    <Bars3Icon
                      className="w-6 text-white/60 hidden lg:block cursor-pointer"
                      onClick={() => setAddon((a) => !a)}
                    />
                  </div>
                }
              </div>
            </header>
          </div>

          <div
            data-vjs-player
            className="flex-none lg:flex-1 h-[350px] lg:h-auto"
          >
            <div ref={videoRef} className="h-full flex flex-col" />
          </div>
        </div>

        <div
          className={classNames(
            "transition-all duration-200 w-full scale-x-100 opacity-100 absolute lg:static top-[450px] text-secondary-600 bg-white lg:h-screen lg:overflow-auto",
            addon
              ? "lg:w-80 lg:scale-x-100 lg:opacity-100"
              : "lg:w-0 lg:scale-x-0 lg:opacity-0"
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
