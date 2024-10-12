import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { VideoJsPlayerPluginOptions } from "video.js";
import "video.js/dist/video-js.css";

import { NextPageWithLayout } from "../../_app";

import { useCategoriesContext } from "../../../app/contexts/categories";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Status from "../../../app/types/status";
import StreamType from "../../../app/types/stream";
import StreamCategoryType from "../../../app/types/stream_category";

import Layout, { Head } from "../../../components/frontend/navigation/layout";
import Video from "../../../components/frontend/ui/blocks/player/ui/video";
import VodView from "../../../components/frontend/ui/blocks/player/ui/view/vod";
import PageError from "../../../components/frontend/ui/page/error";
import PageLoader from "../../../components/frontend/ui/page/loader";

import {
  vodStreams as streams,
  selectPlayer,
} from "../../../features/player/playerSlice";

const VodStreamPage: NextPageWithLayout = () => {
  const { vodCategories: categories } = useCategoriesContext();
  const {
    query: { category: categorySlug, slug },
  } = useRouter();

  const dispatch = useAppDispatch();
  const {
    vod: {
      streams: { data, status },
    },
  } = useAppSelector(selectPlayer);

  const [category, setCategory] = useState<StreamCategoryType | null>(null);
  const [info, setInfo] = useState<StreamType | null>(null);
  const [options, setOptions] = useState<VideoJsPlayerPluginOptions | null>(
    null
  );

  const params = {
    link: `/films/${categorySlug}/${slug}`,
    title: `${info ? `${info.stream_display_name} | ` : ""}Films | ${
      category
        ? `${capitalize(category.category_name.toLocaleLowerCase())} |`
        : ""
    } Hiala TV`,
    description:
      "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun.",
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
  }, [data, slug]);

  return (
    <>
      <Head {...params} />
      {status === Status.LOADING ? (
        <PageLoader />
      ) : status === Status.FAILED ? (
        <PageError />
      ) : info && category && options ? (
        <Video category={category} info={info} options={options}>
          <VodView category={category} info={info} />
        </Video>
      ) : null}
    </>
  );
};

VodStreamPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout videoPage>{page}</Layout>;
};

export default VodStreamPage;
