import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { ReactElement, useState, useEffect } from "react";

import { NextPageWithLayout } from "../_app";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Status from "../../app/types/status";
import SeriesStreamType from "../../app/types/series/stream";

import Layout, { Head } from "../../components/frontend/navigation/layout";
import SeriesStream from "../../components/frontend/ui/blocks/player/series/stream";
import PageError from "../../components/frontend/ui/page/error";
import PageLoader from "../../components/frontend/ui/page/loader";
import PageTitle from "../../components/frontend/ui/page/title";

import { seriesStreams, selectPlayer } from "../../features/player/playerSlice";
import { useCategoriesContext } from "../../app/contexts/categories";

const params = {
  link: "/series",
  title: "Séries | Hiala TV",
  description:
    "Hiala TV: TV, sports, séries, films en streaming en direct live | Hiala TV Cameroun.",
};

const renderSeriesStream = (seriesStream: SeriesStreamType, index: number) => (
  <SeriesStream
    key={`seriesStream-${seriesStream.title}-${index}`}
    {...seriesStream}
  />
);

const SeriesPage: NextPageWithLayout = () => {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(0);

  const dispatch = useAppDispatch();
  const {
    series: {
      streams: { data, status },
    },
  } = useAppSelector(selectPlayer);
  const { seriesCategories } = useCategoriesContext();

  const seriesStreamsContent = data
    ?.filter((stream) => categoryId === 0 || stream.category_id == categoryId)
    .filter((stream) =>
      stream.title.toLowerCase().includes(search.toLowerCase())
    )
    .map(renderSeriesStream);

  useEffect(() => {
    dispatch(seriesStreams());
  }, []);

  return (
    <>
      <Head {...params} />
      {status === Status.LOADING ? (
        <PageLoader />
      ) : (
        <main>
          <PageTitle
            icon={VideoCameraIcon}
            title="Séries"
            subtitle="Retrouvez toutes vos séries préférées."
            search={search}
            setSearch={setSearch}
            placeholder="Rechercher une série..."
            categories={seriesCategories!}
            category_id={categoryId}
            selectCategory={setCategoryId}
          />

          {status === Status.FAILED ? (
            <PageError />
          ) : (
            <section id="series" aria-label="Seriess" className="landing-layer">
              <div className="container">{seriesStreamsContent}</div>
            </section>
          )}
        </main>
      )}
    </>
  );
};

SeriesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SeriesPage;
