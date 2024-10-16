import {
  ArrowRightIcon,
  FilmIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ReactElement, useEffect } from "react";

import { NextPageWithLayout } from "./_app";

import { assets } from "../app/helpers/utils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import BouquetType from "../app/types/bouquet";
import SeriesStreamType from "../app/types/series/stream";
import Status from "../app/types/status";
import StreamType from "../app/types/stream";

import Layout, { Head } from "../components/frontend/navigation/layout";
import Bouquet from "../components/frontend/ui/blocks/player/bouquets/bouquet";
import LiveStream from "../components/frontend/ui/blocks/player/live/stream";
import SeriesStream from "../components/frontend/ui/blocks/player/series/stream";
import VodStream from "../components/frontend/ui/blocks/player/vod/stream";
import PageError from "../components/frontend/ui/page/error";
import PageLoader from "../components/frontend/ui/page/loader";
import Button from "../components/frontend/ui/button";
import ViewAll from "../components/frontend/ui/view-all";
import OwlCarousel from "../components/ui/owl-carousel";

import { selectAuth } from "../features/auth/authSlice";
import {
  bouquets as fetchBouquets,
  liveStreams,
  selectPlayer,
  seriesInfo,
  seriesStreams,
  vodStreams,
} from "../features/player/playerSlice";

const params = {
  link: "/",
  title: "Net TV",
  description:
    "Net TV: TV, sports, séries, films en streaming en direct live | Net TV Cameroun.",
};

interface OnlineSectionProps {
  title: React.ReactNode;
  content: React.ReactNode;
  wrapped?: boolean;
  href: string;
}

const Section = ({ title, content, wrapped, href }: OnlineSectionProps) => (
  <section className={wrapped ? "" : "py-5"}>
    <div className="container-fluid flex items-center">
      <div className="relative pr-2.5 mr-2.5">
        <FilmIcon className="w-5 lg:w-7 text-primary-800" />
        <div className="bg-white/20 w-1 lg:w-1.5 h-1 lg:h-1.5 rounded-full absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
      </div>
      <div>
        <h2 className="text-white font-bold text-xl lg:text-[30px]">{title}</h2>
      </div>
      <div className="ml-auto">
        <Link href={href}>
          <a className="inline-flex items-center group">
            <div className="text-white/30 mr-2.5 group-hover:text-white transition-all duration-200 text-sm lg:text-base">
              View All
            </div>
            <div className="mr-1.5">
              <div className="rounded-full w-1 lg:w-1.5 h-1 lg:h-1.5 bg-white/40 group-hover:bg-white transition-all duration-200" />
            </div>
            <div>
              <ArrowRightIcon className="w-3 lg:w-5 text-white" />
            </div>
          </a>
        </Link>
      </div>
    </div>

    <div className="carousel">{content}</div>
  </section>
);

const HomePage: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const { data: account } = useAppSelector(selectAuth);
  const { bouquets, live, series, vod } = useAppSelector(selectPlayer);

  useEffect(() => {
    if (!account) dispatch(fetchBouquets());
    dispatch(liveStreams());
    dispatch(seriesStreams());
    dispatch(vodStreams());
  }, [account]);

  useEffect(() => {
    if (series.streams.data) {
      const lastSeries = series.streams.data
        ? [...series.streams.data].sort(
            (a, b) => +a.releaseDate - +b.releaseDate
          )[0]
        : null;
      if (!account && series.info.status === Status.IDLE && lastSeries)
        dispatch(seriesInfo(lastSeries.id));
    }
  }, [series.streams.data]);

  const loading =
    bouquets.status === Status.LOADING ||
    (!account && series.info.status === Status.LOADING) ||
    series.streams.status === Status.LOADING ||
    vod.streams.status === Status.LOADING;
  const failed =
    bouquets.status === Status.FAILED ||
    (!account && series.info.status === Status.FAILED) ||
    series.streams.status === Status.FAILED ||
    vod.streams.status === Status.FAILED;

  let content;
  if (account) {
    const renderLiveStream = (liveStream: StreamType, index: number) => (
      <div
        key={`live-stream-${liveStream.added}-${index}`}
        className="inline-block w-1/3 sm:w-1/4 md:w-1/5 lg:1/6 xl:w-[12.5%] px-1 lg:px-2"
      >
        <LiveStream {...liveStream} />
      </div>
    );
    const renderVodStream = (vodStream: StreamType, index: number) => (
      <VodStream
        key={`vod-stream-${vodStream.added}-${index}`}
        {...vodStream}
      />
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

    const liveStreamsContent = live.streams.data?.map(renderLiveStream);
    const seriesStreamsContent = series.streams.data?.map(renderSeriesStream);
    const vodStreamsContent = vod.streams.data?.map(renderVodStream);

    content = (
      <>
        <Section
          title="Activités récentes"
          content={vodStreamsContent}
          href="/films"
        />
        <div className="container-fluid py-5">
          <div className="rounded-[25px] bg-secondary-800 py-6">
            <Section
              wrapped
              title="Chaînes populaires"
              content={liveStreamsContent}
              href="/chaines"
            />
          </div>
        </div>
        <Section
          title="Films les mieux notés"
          content={vodStreamsContent}
          href="/films"
        />
        <Section
          title="Séries les mieux notées"
          content={seriesStreamsContent}
          href="/series"
        />
        <Section
          title="Films populaires"
          content={vodStreamsContent}
          href="/films"
        />
        <Section
          title="Séries populaires"
          content={seriesStreamsContent}
          href="/series"
        />
      </>
    );
  } else {
    const lastSeries = series.streams.data
      ? [...series.streams.data].sort(
          (a, b) => +a.releaseDate - +b.releaseDate
        )[0]
      : null;
    const lastSeason = series.info.data
      ? Math.max(...series.info.data.map((e) => e.season_num))
      : null;
    const maxBouquetNumber =
      bouquets.data &&
      "length" in bouquets.data &&
      Math.max(
        ...bouquets.data.map((bouquet) => bouquet.bouquet_channels.length)
      );
    const bouquetsContent =
      bouquets.data &&
      "length" in bouquets.data &&
      bouquets.data.map((bouquet: BouquetType, index: number) => {
        const bouquet_name = bouquet.bouquet_name.toLocaleLowerCase();
        return (
          <div
            key={`bouquet-${bouquet.id}-${index}`}
            className="inline-block w-[220px] md:w-auto"
          >
            <Bouquet
              {...bouquet}
              favorite={maxBouquetNumber === bouquet.bouquet_channels.length}
              price={
                bouquet_name === "passion"
                  ? 3000
                  : bouquet_name === "magic"
                  ? 5000
                  : bouquet_name === "charme"
                  ? 2000
                  : bouquet_name === "canal+"
                  ? 12000
                  : 2
              }
            />
          </div>
        );
      });

    content = lastSeries ? (
      <>
        <div className="min-h-[calc(100vh_-_112px)] md:min-h-[calc(100vh_-_120px)] md:flex items-center relative overflow-hidden">
          <img
            src={assets(lastSeries.cover_big)}
            alt="BG Home"
            className="image-cover absolute inset-0 -z-30"
          />

          <div className="bg-black/40 absolute inset-0 -z-20" />

          <img
            src="/images/Mac Studio.png"
            alt="Mac Studio"
            className="hidden md:block absolute -bottom-7 -right-7 -z-10"
          />

          <div className="container pt-16 md:pt-0 pb-12 md:pb-0 text-white">
            <div className="w-full md:w-1/2">
              <div className="bg-white/10 rounded-[10px] font-bold text-lg w-[124px] md:w-[179px] h-[45px] md:h-[58px] flex items-center justify-center">
                Saison {lastSeason}
              </div>

              <div className="mt-1.5 md:mt-4 font-bold text-[40px] md:text-[70px] md:leading-none">
                {lastSeries.title}
                <br />
                Saison {lastSeason}
              </div>

              <div className="mt-1.5 md:text-xl">
                Vivez un moment d’intense divertissement avec une nouvelle
                saison de votre série préférée en famille.
              </div>
              <div className="mt-12 md:hidden">
                <img
                  src="/images/Apple iMac.png"
                  alt="Apple iMac"
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-12 md:mt-16 text-center md:text-left">
                <Button icon={PlayCircleIcon}>Regarder</Button>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-secondary-700 py-16 md:pt-[112px] md:pb-0 text-white relative z-0 overflow-hidden">
          <img
            src="/images/dots.svg"
            alt="Dots"
            className="absolute top-[87px] left-0 -translate-x-1/2 hidden md:block -z-10"
          />

          <div className="container md:flex items-center">
            <div className="w-full md:w-1/2">
              <div className="text-[25px] md:text-[45px] font-bold">
                Emportez vos films préférés
              </div>

              <div className="mt-4">
                Nous mettons à votre disposition une sélection de films HD pour
                une expérience au-dessus de vos attentes.
              </div>
            </div>

            <div className="hidden md:block ml-auto">
              <ViewAll href="/films">Voir notre sélection</ViewAll>
            </div>
          </div>

          <div className="mt-14">
            <OwlCarousel
              className="home-media-carousel films"
              loop
              responsive={{
                0: { items: 2, center: true },
                640: { items: 3 },
                768: { items: 4, center: false },
              }}
            >
              {[...(vod.streams.data || [])]
                .sort(
                  (a, b) =>
                    +a.movie_propeties.releasedate -
                    +b.movie_propeties.releasedate
                )
                .map((v) => (
                  <img
                    key={`vod-img-${v.id}`}
                    src={assets(v.movie_propeties.cover_big)}
                    alt={v.stream_display_name}
                    className="aspect-[260/285] object-cover bg-white"
                  />
                ))}
            </OwlCarousel>
          </div>

          <div className="mt-4 text-center md:hidden">
            <ViewAll href="/films">Voir notre sélection</ViewAll>
          </div>
        </section>

        <section className="bg-secondary-100 py-16 md:pt-[112px] text-secondary-600">
          <div className="container grid md:grid-cols-2">
            <div className="hidden md:block">
              <img
                src="/images/Group 1701.png"
                alt="Group 1701"
                className="w-full"
              />
            </div>

            <div>
              <div className="text-[25px] md:text-[38px] md:text-secondary-800 font-bold">
                Vos meilleurs films & séries sur vos différents appareils
                mobiles
              </div>

              <div className="mt-4">
                Vous avez déjà voulu visionner de partout sans interruption ?{" "}
                <strong>Net TV</strong> est votre destination finale.
                Disponible pour mobiles, tablettes, PC, nous nous assurons de
                vous offrir la meilleure expérience surpassant vos attentes.
              </div>

              <div className="mt-6 md:hidden">
                <img
                  src="/images/Group 1701.png"
                  alt="Group 1701"
                  className="w-full"
                />
              </div>

              <div className="mt-4 md:mt-20 text-center md:text-left">
                <Link href="/bouquets">
                  <a className="text-white">
                    <Button icon={ArrowRightIcon}>Je m'abonne</Button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary-700 py-16 md:pt-[112px] md:pb-20 text-white relative z-0 overflow-hidden">
          <img
            src="/images/dots.svg"
            alt="Dots"
            className="absolute top-[87px] left-0 -translate-x-1/2 hidden md:block -z-10"
          />

          <div className="container md:flex items-center">
            <div className="w-full md:w-1/2">
              <div className="text-[25px] md:text-[45px] font-bold">
                Les meilleures séries{" "}
              </div>
              <div className="mt-4">
                Restez à jour sur les récentes séries. Nous vous informons sur
                les nouvelles séries disponibles.
              </div>
            </div>
            <div className="hidden md:block ml-auto">
              <ViewAll href="/series">Voir notre sélection</ViewAll>
            </div>
          </div>
          <div className="mt-14">
            <OwlCarousel
              className="home-media-carousel"
              center
              loop
              responsive={{
                0: { items: 2 },
                640: { items: 3 },
                768: { items: 4 },
                1024: { items: 5 },
              }}
            >
              {[...(series.streams.data || [])]
                .sort((a, b) => +a.releaseDate - +b.releaseDate)
                .map((v) => (
                  <img
                    key={`series-img-${v.id}`}
                    src={assets(v.cover)}
                    alt={v.title}
                    className="aspect-[260/285] object-cover bg-white"
                  />
                ))}
            </OwlCarousel>
          </div>
          <div className="mt-4 text-center md:hidden">
            <ViewAll href="/series">Voir notre sélection</ViewAll>
          </div>
        </section>

        <section className="bg-secondary-100 py-16 md:pt-[112px] text-secondary-600 relative overflow-hidden z-0">
          <div className="md:hidden w-[174px] h-[174px] rounded-full bg-gradient-to-b from-green/10 to-transparent absolute top-12 left-0 -translate-x-1/2 p-2.5 -z-10">
            <div className="rounded-full w-full h-full bg-secondary-100" />
          </div>

          <div className="md:hidden w-[174px] h-[174px] rounded-full bg-gradient-to-b from-green/10 to-transparent absolute bottom-4 right-0 translate-x-1/2 p-2.5 -z-10">
            <div className="rounded-full w-full h-full bg-secondary-100" />
          </div>

          <img
            src="/images/curvy-arrow.svg"
            alt="Curvy arrow"
            className="hidden md:block absolute top-78px right-0 translate-x-1/3 -z-10"
          />

          <div className="hidden md:block w-[540px] h-[540px] -z-10 rounded-full bg-gradient-to-b from-green/10 to-transparent absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 p-[50px]">
            <div className="rounded-full w-full h-full bg-secondary-100" />
          </div>

          <div className="hidden md:block w-[540px] h-[540px] -z-10 rounded-full bg-gradient-to-b from-green/10 to-transparent absolute top-[87px] left-0 -translate-x-1/2 p-[50px]">
            <div className="rounded-full w-full h-full bg-secondary-100" />
          </div>

          <div className="container text-center">
            <div className="text-[25px] md:text-[45px] font-bold">
              Nos bouquets
            </div>
            <div className="mt-4">
              Nous vous proposons un service de qualité à un prix défiant toute
              concurrence.
            </div>
          </div>
          <div className="md:hidden carousel bouquets space-x-5">
            {bouquetsContent}
          </div>
          <div className="container hidden mt-[92px] md:grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bouquetsContent}
          </div>
          <div className="text-center md:hidden">
            <ViewAll href="/bouquets" green>
              Voir nos bouquets
            </ViewAll>
          </div>
        </section>
      </>
    ) : null;
  }

  return (
    <>
      <Head {...params} />
      {loading ? (
        <PageLoader />
      ) : failed ? (
        <PageError />
      ) : (
        <main>{content}</main>
      )}
    </>
  );
};

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout white>{page}</Layout>;
};

export default HomePage;
