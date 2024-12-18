import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { VideoJsPlayerPluginOptions } from "video.js";
import "video.js/dist/video-js.css";

import { NextPageWithLayout } from "../../_app";

import { useCategoriesContext } from "../../../app/contexts/categories";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import H265Options from "../../../app/types/h265/options";
import Status from "../../../app/types/status";
import StreamType from "../../../app/types/stream";
import StreamCategoryType from "../../../app/types/stream_category";

import Layout, { Head } from "../../../components/frontend/navigation/layout";
import Video from "../../../components/frontend/ui/blocks/player/ui/video";
import LiveView from "../../../components/frontend/ui/blocks/player/ui/view/live";
import PageError from "../../../components/frontend/ui/page/error";
import PageLoader from "../../../components/frontend/ui/page/loader";

import {
  liveStreams as streams,
  selectPlayer,
} from "../../../features/player/playerSlice";

const LiveStreamPage: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const {
    live: {
      streams: { data, status },
    },
  } = useAppSelector(selectPlayer);
  const { liveCategories: categories } = useCategoriesContext();
  const {
    query: { category: categorySlug, slug },
  } = useRouter();

  const [category, setCategory] = useState<StreamCategoryType | null>(null);
  const [info, setInfo] = useState<StreamType | null>(null);
  const [options, setOptions] = useState<VideoJsPlayerPluginOptions | null>(
    null
  );

  const params = {
    link: `/chaines/${categorySlug}/${slug}`,
    title: `${info ? `${info.stream_display_name} | ` : ""}Chaînes | ${
      category
        ? `${capitalize(category.category_name.toLocaleLowerCase())} |`
        : ""
    } Net TV`,
    description:
      "Net TV: TV, sports, séries, films en streaming en direct live | Net TV Cameroun.",
  };

  useEffect(() => {
    dispatch(streams());
  }, []);

  useEffect(() => {
    const category = categories?.find(
      (category) => category.slug === categorySlug
    )!;
    setCategory(category);
  }, [categorySlug]);

  useEffect(() => {
    if (data) {
      const info = data.find((stream) => stream.slug === slug)!;
      setInfo(info);

      const sources = info.stream_source.map((src) => ({
        src,
        type: "application/x-mpegURL",
      }));

      const options: VideoJsPlayerPluginOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources,
        mpegtsjs: {
          mediaDataSource: {
            isLive: true,
            cors: false,
            withCredentials: false,
          },
        },
      };

      setOptions(options);
    }
  }, [data, slug]);

  return (
    <>
      <Head {...params} />
      {status === Status.LOADING ? (
        <PageLoader />
      ) : status === Status.FAILED ? (
        <PageError />
      ) : info && category && options ? (
        <Video live category={category} options={options} info={info}>
          <LiveView category={category} info={info} />
        </Video>
      ) : null}
    </>
  );
};

LiveStreamPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout videoPage>{page}</Layout>;
};

export default LiveStreamPage;
