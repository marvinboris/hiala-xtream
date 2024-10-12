import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import "video.js/dist/video-js.css";

import { NextPageWithLayout } from "../../../_app";

import { useCategoriesContext } from "../../../../app/contexts/categories";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import SeriesEpisodeType from "../../../../app/types/series/episode";
import SeriesStreamType from "../../../../app/types/series/stream";
import Status from "../../../../app/types/status";
import StreamCategoryType from "../../../../app/types/stream_category";

import Layout, {
  Head,
} from "../../../../components/frontend/navigation/layout";
import Video from "../../../../components/frontend/ui/blocks/player/ui/video";
import SerieView from "../../../../components/frontend/ui/blocks/player/ui/view/serie";
import PageError from "../../../../components/frontend/ui/page/error";
import PageLoader from "../../../../components/frontend/ui/page/loader";

import {
  seriesInfo,
  selectPlayer,
  seriesStreams,
} from "../../../../features/player/playerSlice";
import { VideoJsPlayerPluginOptions } from "video.js";

const SeriesEpisodeStreamPage: NextPageWithLayout = () => {
  const { seriesCategories: categories } = useCategoriesContext();
  const {
    query: { category: categorySlug, series: seriesSlug, slug: episodeSlug },
    push,
  } = useRouter();

  const [category, setCategory] = useState<StreamCategoryType | null>(null);
  const [series, setSeries] = useState<SeriesStreamType | null>(null);
  const [info, setInfo] = useState<SeriesEpisodeType | null>(null);
  const [options, setOptions] = useState<VideoJsPlayerPluginOptions | null>(
    null
  );

  const dispatch = useAppDispatch();
  const {
    series: {
      streams,
      info: { data, status },
    },
  } = useAppSelector(selectPlayer);

  const params = {
    link: `/series/${categorySlug}/${seriesSlug}/${episodeSlug}`,
    title: `${info ? `${info.stream.stream_display_name} | ` : ""}${
      series ? series.title : ""
    } | Séries | ${
      category
        ? `${capitalize(category.category_name.toLocaleLowerCase())} |`
        : ""
    } | Net TV`,
    description:
      "Net TV: TV, sports, séries, films en streaming en direct live | Net TV Cameroun.",
  };

  useEffect(() => {
    dispatch(seriesStreams());
  }, []);

  useEffect(() => {
    const category = categories?.find(
      (category) => category.slug === categorySlug
    )!;
    setCategory(category);
  }, [categorySlug]);

  useEffect(() => {
    if (streams.data) {
      const series = streams.data.find((series) => series.slug === seriesSlug)!;
      setSeries(series);
      dispatch(seriesInfo(series.id));
    }
  }, [streams.data, seriesSlug]);

  useEffect(() => {
    if (data) {
      const info = data?.find(
        (episode) => episode.stream.slug === episodeSlug
      )!;
      setInfo(info);

      const sources = info.stream.stream_source.map((src) => ({
        src,
        type: "video/webm",
      }));

      const options: VideoJsPlayerPluginOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources,
      };
      setOptions(options);
    }
  }, [data, episodeSlug]);

  return (
    <>
      <Head {...params} />
      {status === Status.LOADING ? (
        <PageLoader />
      ) : status === Status.FAILED ? (
        <PageError />
      ) : info && category && data && options ? (
        <Video
          category={category}
          info={info}
          options={options}
          onEnded={() => {
            const episode = data?.find(
              (episode) =>
                episode.sort === info.sort + 1 &&
                episode.season_num === info.season_num
            );
            if (episode)
              push(
                `/series/${categorySlug}/${seriesSlug}/${episode.stream.slug}`,
                undefined,
                { shallow: true }
              );
            else {
              const episode = data?.find(
                (episode) =>
                  episode.sort === 1 &&
                  episode.season_num === info.season_num + 1
              );
              if (episode)
                push(
                  `/series/${categorySlug}/${seriesSlug}/${episode.stream.slug}`,
                  undefined,
                  { shallow: true }
                );
            }
          }}
        >
          <SerieView info={info} />
        </Video>
      ) : null}
    </>
  );
};

SeriesEpisodeStreamPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout videoPage>{page}</Layout>;
};

export default SeriesEpisodeStreamPage;
