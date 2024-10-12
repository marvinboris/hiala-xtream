import { FilmIcon } from "@heroicons/react/24/outline";
import { ReactElement, useState, useEffect } from "react";

import { NextPageWithLayout } from "../_app";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Status from "../../app/types/status";
import StreamType from "../../app/types/stream";

import Layout, { Head } from "../../components/frontend/navigation/layout";
import VodStream from "../../components/frontend/ui/blocks/player/vod/stream";
import PageError from "../../components/frontend/ui/page/error";
import PageLoader from "../../components/frontend/ui/page/loader";
import PageTitle from "../../components/frontend/ui/page/title";

import { vodStreams, selectPlayer } from "../../features/player/playerSlice";
import { useCategoriesContext } from "../../app/contexts/categories";

const params = {
  link: "/films",
  title: "Films | Net TV",
  description:
    "Net TV: TV, sports, séries, films en streaming en direct live | Net TV Cameroun.",
};

const renderVodStream = (vodStream: StreamType, index: number) => (
  <VodStream
    key={`vodStream-${vodStream.stream_display_name}-${index}`}
    {...vodStream}
  />
);

const VodsPage: NextPageWithLayout = () => {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(0);

  const dispatch = useAppDispatch();
  const {
    vod: {
      streams: { data, status },
    },
  } = useAppSelector(selectPlayer);
  const { vodCategories } = useCategoriesContext();

  const vodStreamsContent = data
    ?.filter((stream) => categoryId === 0 || stream.category_id == categoryId)
    .filter((stream) =>
      stream.stream_display_name.toLowerCase().includes(search.toLowerCase())
    )
    .map(renderVodStream);

  useEffect(() => {
    dispatch(vodStreams());
  }, []);

  return (
    <>
      <Head {...params} />
      {status === Status.LOADING ? (
        <PageLoader />
      ) : (
        <main>
          <PageTitle
            icon={FilmIcon}
            title="Films"
            subtitle="Retrouvez tous vos films préférés."
            search={search}
            setSearch={setSearch}
            placeholder="Rechercher un film..."
            categories={vodCategories!}
            category_id={categoryId}
            selectCategory={setCategoryId}
          />

          {status === Status.FAILED ? (
            <PageError />
          ) : (
            <section id="vods" aria-label="Vods" className="landing-layer">
              <div className="container">{vodStreamsContent}</div>
            </section>
          )}
        </main>
      )}
    </>
  );
};

VodsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default VodsPage;
