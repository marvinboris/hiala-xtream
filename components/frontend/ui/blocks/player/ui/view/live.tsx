import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { useCategoriesContext } from "../../../../../../../app/contexts/categories";

import { assets } from "../../../../../../../app/helpers/utils";
import { useAppSelector } from "../../../../../../../app/hooks";
import StreamType from "../../../../../../../app/types/stream";
import StreamCategoryType from "../../../../../../../app/types/stream_category";
import { selectAuth } from "../../../../../../../features/auth/authSlice";

import { selectPlayer } from "../../../../../../../features/player/playerSlice";
import Button from "./ui/button";

type LiveViewProps = {
  category: StreamCategoryType;
  info: StreamType;
};

export default function LiveView({ category, info }: LiveViewProps) {
  const { data: account } = useAppSelector(selectAuth);
  const {
    live: {
      streams: { data },
    },
  } = useAppSelector(selectPlayer);
  const { liveCategories: categories } = useCategoriesContext();

  const [page, setPage] = useState(0);

  const available = data
    ? data.filter((s) =>
        account?.bouquet?.find((b) => b.bouquet_channels.includes(s.id))
      )
    : [];
  const similar = info ? available.filter((s) => s.id !== info.id) : [];

  return (
    <>
      <div className="bg-primary-800/5 lg:bg-white lg:border-b border-secondary-600/20 lg:sticky top-0">
        <div className="h-[90px] lg:h-[135px] container flex items-center">
          <div>
            <div className="font-bold text-[25px]">
              Chaînes TV ({available.length})
            </div>
            <div className="text-sm">
              Bouquet(s) :{" "}
              <span className="text-green font-bold capitalize">
                {account?.bouquet
                  ? account.bouquet
                      .map((b) => b.bouquet_name.toLowerCase())
                      .join(", ")
                  : null}
              </span>
            </div>
          </div>

          <div className="ml-auto">
            <Button icon={MagnifyingGlassIcon} />
          </div>
        </div>
      </div>

      <div className="container pt-8 lg:pt-[22px] pb-[94px] lg:pb-[58px] overflow-auto">
        {/* <div className="h-[130px] lg:h-[89px] flex items-center pt-0 lg:pt-8 justify-between">
                <div className="font-bold text-[25px] lg:text-xl">Films similaires</div>
                <div className="flex space-x-2">
                    <Button direction icon={ArrowLeftIcon} onClick={page > 0 ? () => setPage(p => p - 1) : undefined} />
                    <Button direction icon={ArrowRightIcon} onClick={page < Math.ceil(similar.length / 2) - 1 ? () => setPage(p => p + 1) : undefined} />
                </div>
            </div> */}
        <div className="grid gap-x-3.5 gap-y-2 grid-flow-col grid-rows-6 pb-4">
          {similar.map((s) => (
            <Link
              key={s.slug + "-" + s.id}
              href={`/chaines/${category?.slug}/${s.slug}`}
              shallow
            >
              <a className="min-w-[237px] rounded-[14px] bg-secondary-200/70 p-2 space-x-3 flex">
                <img
                  src={assets(s.stream_icon)}
                  alt={s.stream_display_name}
                  className="w-[62px] h-[70px] flex-none rounded-[10px] bg-white p-2"
                />
                <div className="flex-1 truncate text-xs pt-2">
                  <div className="text-sm truncate font-bold capitalize">
                    {s.stream_display_name}
                  </div>
                  <div className="capitalize">
                    {categories
                      ?.find((c) => c.id === s.category_id)
                      ?.category_name.toLowerCase()}
                  </div>
                  <div className="mt-1">
                    <span className="rounded-full leading-none px-3 py-0.5 text-xs text-white bg-red-600">
                      En direct
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
