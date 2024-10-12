import { TvIcon } from "@heroicons/react/24/outline";
import { ReactElement, useState, useEffect } from "react";

import { NextPageWithLayout } from "../_app";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Status from "../../app/types/status";
import StreamType from "../../app/types/stream";

import Layout, { Head } from "../../components/frontend/navigation/layout";
import LiveStream from "../../components/frontend/ui/blocks/player/live/stream";
import PageError from "../../components/frontend/ui/page/error";
import PageLoader from "../../components/frontend/ui/page/loader";
import PageTitle from "../../components/frontend/ui/page/title";

import { liveStreams, selectPlayer } from "../../features/player/playerSlice";
import { useCategoriesContext } from "../../app/contexts/categories";

const params = {
  link: "/chaines",
  title: "Chaînes | Net TV",
  description:
    "Net TV: TV, sports, séries, films en streaming en direct live | Net TV Cameroun.",
};

const renderLiveStream = (liveStream: StreamType, index: number) => (
  <LiveStream
    key={`liveStream-${liveStream.stream_display_name}-${index}`}
    {...liveStream}
  />
);

const LivesPage: NextPageWithLayout = () => {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(0);

  const dispatch = useAppDispatch();
  const {
    live: {
      streams: { data, status },
    },
  } = useAppSelector(selectPlayer);
  const { liveCategories } = useCategoriesContext();

  const liveStreamsContent = data
    ?.filter((stream) => categoryId === 0 || stream.category_id == categoryId)
    .filter((stream) =>
      stream.stream_display_name.toLowerCase().includes(search.toLowerCase())
    )
    .map(renderLiveStream);

  useEffect(() => {
    dispatch(liveStreams());
  }, []);

  return (
    <>
      <Head {...params} />
      {status === Status.LOADING ? (
        <PageLoader />
      ) : (
        <main>
          <PageTitle
            icon={TvIcon}
            title="Chaînes"
            subtitle="Retrouvez toutes vos chaînes préférées."
            search={search}
            setSearch={setSearch}
            placeholder="Rechercher une chaîne..."
            categories={liveCategories!}
            category_id={categoryId}
            selectCategory={setCategoryId}
          />

          {status === Status.FAILED ? (
            <PageError />
          ) : (
            <section id="lives" aria-label="Lives" className="landing-layer">
              <div className="container">
                <div className="px-5 grid gap-x-1 gap-y-6 grid-cols-3 md:gap-x-4 md:grid-cols-5 lg:gap-y-8 lg:grid-cols-6 xl:grid-cols-8">
                  {liveStreamsContent}
                </div>
              </div>
            </section>
          )}
        </main>
      )}
    </>
  );
};

LivesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LivesPage;
