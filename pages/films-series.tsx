import { ArrowRightIcon, FilmIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";

import { NextPageWithLayout } from "./_app";

import { assets, classNames } from "../app/helpers/utils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import SeriesStreamType from "../app/types/series/stream";
import Status from "../app/types/status";
import StreamType from "../app/types/stream";

import Layout, { Head } from "../components/frontend/navigation/layout";
import SeriesStream from "../components/frontend/ui/blocks/player/series/stream";
import VodStream from "../components/frontend/ui/blocks/player/vod/stream";
import PageError from "../components/frontend/ui/page/error";
import PageLoader from "../components/frontend/ui/page/loader";

import {
  selectPlayer,
  seriesInfo,
  seriesStreams,
  vodStreams,
} from "../features/player/playerSlice";
import ViewAll from "../components/frontend/ui/view-all";

const params = {
  link: "/films-series",
  title: "Films et séries | Net TV",
  description:
    "Net TV: TV, sports, séries, films en streaming en direct live | Net TV Cameroun.",
};

interface SectionProps {
  title: React.ReactNode;
  content: React.ReactNode;
  wrapped?: boolean;
  className?: string;
  href: string;
}

const Section = ({
  title,
  content,
  wrapped,
  className,
  href,
}: SectionProps) => (
  <section className={classNames(wrapped ? "" : "pt-8 pb-14", className || "")}>
    <div className="container flex items-center">
      <div className="relative pr-2.5 mr-2.5">
        <FilmIcon className="w-5 lg:w-7 text-green" />
        <div className="bg-white/20 w-1 lg:w-1.5 h-1 lg:h-1.5 rounded-full absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
      </div>
      <div>
        <h2 className="font-bold text-[25px]">{title}</h2>
      </div>
      <div className="ml-auto hidden lg:block">
        <Link href={href}>
          <a className="inline-flex items-center group">
            <div className="opacity-30 mr-2.5 group-hover:opacity-100 transition-all duration-200 text-sm lg:text-base">
              Voir liste complète
            </div>
            <div>
              <ArrowRightIcon className="w-3 lg:w-5 text-green" />
            </div>
          </a>
        </Link>
      </div>
    </div>

    <div className="container pt-6 whitespace-nowrap overflow-auto">
      {content}
    </div>

    <div className="mt-16 text-center lg:hidden">
      <ViewAll href={href}>Voir notre sélection</ViewAll>
    </div>
  </section>
);

const FilmsSeriesPage: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const { bouquets, series, vod } = useAppSelector(selectPlayer);

  const [lastSeries, setLastSeries] = useState<SeriesStreamType | null>(null);
  const [lastSeason, setLastSeason] = useState<number | null>(null);

  useEffect(() => {
    dispatch(seriesStreams());
    dispatch(vodStreams());
  }, []);

  useEffect(() => {
    if (series.streams.data) {
      const lastSeries = series.streams.data
        ? [...series.streams.data].sort(
            (a, b) => +a.releaseDate - +b.releaseDate
          )[1]
        : null;
      setLastSeries(lastSeries);
      if (series.info.status === Status.IDLE && lastSeries)
        dispatch(seriesInfo(lastSeries.id));
    }
  }, [series.streams.data]);

  useEffect(() => {
    if (series.info.data && lastSeason === null) {
      const lastSeason = Math.max(...series.info.data.map((e) => e.season_num));
      setLastSeason(lastSeason);
    }
  }, [series.info.data, lastSeason]);

  const loading =
    bouquets.status === Status.LOADING ||
    series.streams.status === Status.LOADING ||
    vod.streams.status === Status.LOADING;
  const failed =
    bouquets.status === Status.FAILED ||
    series.streams.status === Status.FAILED ||
    vod.streams.status === Status.FAILED;

  const renderVodStream = (vodStream: StreamType, index: number) => (
    <VodStream key={`vod-stream-${vodStream.added}-${index}`} {...vodStream} />
  );
  const renderSeriesStream = (
    seriesStream: SeriesStreamType,
    index: number
  ) => (
    <SeriesStream
      key={`series-stream-${seriesStream.id}-${index}`}
      {...seriesStream}
    />
  );

  const seriesStreamsContent = series.streams.data
    ?.filter((s, i) => i < 8)
    .map(renderSeriesStream);
  const vodStreamsContent = vod.streams.data
    ?.filter((s, i) => i < 8)
    .map(renderVodStream);

  const content = (
    <>
      {lastSeries ? (
        <div className="h-48 lg:h-[300px] relative overflow-hidden z-0 bg-black/60 flex items-center">
          <img
            src={assets(lastSeries.cover)}
            alt="Films & Séries - banner"
            className="absolute inset-0 w-full h-full -z-10 object-cover"
          />
          <div className="container">
            <div className="text-white">
              <div className="font-bold text-[35px] lg:text-[80px]">
                {lastSeries.title} {lastSeason}
              </div>
              <div className="mt-2 lg:mt-4 lg:text-xl lg:w-1/2">
                Vivez un moment d’intense divertissement avec une nouvelle
                saison de votre série préférée en famille.
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Section
        title="Films populaires"
        content={vodStreamsContent}
        href="/films"
        className="bg-secondary-100 text-secondary-600 lg:bg-transparent lg:text-inherit"
      />
      <div className="grid grid-cols-3">
        {(series.streams.data || [])
          .filter((s, i) => 8 <= i && i < 11)
          .map((s) => (
            <div
              key={"series-block-" + s.id}
              className="aspect-square lg:aspect-auto lg:h-[300px] relative after:transiion-all after:duration-200 after:absolute after:inset-0 after:bg-black/60 hover:after:bg-transparent"
            >
              <img
                src={assets(s.cover)}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
      </div>
      <Section
        title="Séries populaires"
        content={seriesStreamsContent}
        href="/series"
      />
    </>
  );

  return (
    <>
      <Head {...params} />
      {loading ? (
        <PageLoader />
      ) : failed ? (
        <PageError />
      ) : (
        <main className="text-white">{content}</main>
      )}
    </>
  );
};

FilmsSeriesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default FilmsSeriesPage;
