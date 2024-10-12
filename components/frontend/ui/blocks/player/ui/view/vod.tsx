import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

import { assets } from "../../../../../../../app/helpers/utils";
import { useAppSelector } from "../../../../../../../app/hooks";
import StreamType from "../../../../../../../app/types/stream";
import StreamCategoryType from "../../../../../../../app/types/stream_category";
import { selectAuth } from "../../../../../../../features/auth/authSlice";

import { selectPlayer } from "../../../../../../../features/player/playerSlice";
import Button from "./ui/button";

type VodViewProps = {
  category: StreamCategoryType;
  info: StreamType;
};

export default function VodView({ category, info }: VodViewProps) {
  const { data: account } = useAppSelector(selectAuth);
  const {
    vod: {
      streams: { data },
    },
  } = useAppSelector(selectPlayer);

  const [page, setPage] = useState(0);

  const available = data
    ? data.filter((s) =>
        account?.bouquet?.find((b) => b.bouquet_channels.includes(s.id))
      )
    : [];
  const similar =
    category && info
      ? available.filter(
          (s) => s.category_id === category.id && s.id !== info.id
        )
      : [];

  return (
    <>
      <div className="bg-primary-800/5 lg:bg-white lg:border-b border-secondary-600/20 lg:sticky top-0">
        <div className="h-[90px] lg:h-[135px] container flex items-center">
          <div>
            <div className="font-bold text-[25px]">
              Tous les films ({available.length})
            </div>
            <div className="text-sm">
              Bouquet(s) :{" "}
              <span className="text-green font-bold capitalize">
                {account?.bouquet
                  ?.map((b) => b.bouquet_name.toLowerCase())
                  .join(", ")}
              </span>
            </div>
          </div>

          <div className="ml-auto">
            <Button icon={MagnifyingGlassIcon} />
          </div>
        </div>
      </div>

      <div className="container flex pt-[22px] pb-6">
        <div className="pt-0.5">
          <div className="font-bold text-[25px] lg:text-xl">
            {info.stream_display_name}
          </div>

          <div className="mt-2 space-y-1 text-xs">
            <div>
              <span className="font-bold">Date de sortie :</span>{" "}
              {info.movie_propeties.releasedate}
            </div>
            <div>
              <span className="font-bold">Durée :</span>{" "}
              {Math.floor(info.movie_propeties.duration_secs / 60 / 60)}h
              {Math.round(info.movie_propeties.duration_secs / 60) % 60}
            </div>
            <div>
              <span className="font-bold">Catégorie :</span>{" "}
              <span className="capitalize">{info.movie_propeties.genre}</span>
            </div>
          </div>
        </div>

        <div className="ml-auto"></div>
      </div>

      <div className="bg-primary-800/5">
        <div className="container pt-[22px] pb-10 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="font-bold text-base">Synopsis</div>
            <div>
              <ExclamationCircleIcon className="w-5 text-green" />
            </div>
          </div>

          <div className="mt-4 lg:text-sm">{info.movie_propeties.plot}</div>

          <div className="my-3.5 h-0.5 bg-secondary-600/20" />

          <div>
            <span className="font-bold">Acteurs :</span>{" "}
            <span className="text-primary-800 capitalize">
              {info.movie_propeties.actors}
            </span>
          </div>
        </div>
      </div>

      <div className="container pb-[94px] lg:pb-[58px]">
        <div className="h-[130px] lg:h-[89px] flex items-center pt-0 lg:pt-8 justify-between">
          <div className="font-bold text-[25px] lg:text-xl">
            Films similaires
          </div>
          <div className="flex space-x-2">
            <Button
              direction
              icon={ArrowLeftIcon}
              onClick={page > 0 ? () => setPage((p) => p - 1) : undefined}
            />
            <Button
              direction
              icon={ArrowRightIcon}
              onClick={
                page < Math.ceil(similar.length / 2) - 1
                  ? () => setPage((p) => p + 1)
                  : undefined
              }
            />
          </div>
        </div>
        <div className="space-y-3">
          {similar
            .filter((s, i) => [page * 2, page * 2 + 1].includes(i))
            .map((s) => (
              <Link
                key={s.slug}
                href={`/films/${category?.slug}/${s.slug}`}
                shallow
              >
                <a className="rounded-[18px] lg:rounded-[14px] bg-secondary-200/70 p-2.5 lg:p-2 space-x-3.5 lg:space-x-3 flex items-center">
                  <img
                    src={assets(s.movie_propeties.movie_image)}
                    alt={s.stream_display_name}
                    className="w-[82px] lg:w-[62px] h-[92px] lg:h-[70px] flex-none rounded-[10px]"
                  />
                  <div className="flex-1 truncate text-base lg:text-xs">
                    <div className="text-lg lg:text-sm truncate font-bold">
                      {s.stream_display_name}
                    </div>
                    <div className="mt-3 lg:mt-2">
                      Date de sortie :{" "}
                      <span className="font-bold">
                        {s.movie_propeties.releasedate}
                      </span>
                    </div>
                    <div>
                      Durée :{" "}
                      <span className="font-bold">
                        {Math.floor(s.movie_propeties.duration_secs / 60 / 60)}h
                        {Math.round(s.movie_propeties.duration_secs / 60) % 60}{" "}
                        min
                      </span>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
