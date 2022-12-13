import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { classNames } from "../../../../../../../app/helpers/utils";
import BouquetType from "../../../../../../../app/types/bouquet";

type BouquetProps = BouquetType & {
    favorite?: boolean
}

export default function Bouquet({ id, bouquet_name, bouquet_channels, bouquet_series, favorite }: BouquetProps) {
    return <section className={classNames(favorite ? "flex flex-col rounded-3xl px-6 sm:px-8 order-first bg-blue-600 py-8 lg:order-none" : "flex flex-col rounded-3xl px-6 sm:px-8 lg:py-8")}>
        <p className="order-first font-display text-5xl tracking-tight text-white">{bouquet_name}</p>
        {/* <h3 className="mt-4 font-display text-lg text-white">{bouquet_name}</h3> */}
        {/* <p className="order-first font-display text-5xl font-light tracking-tight text-white">$9</p> */}
        {/* <p className={classNames("mt-4 text-base", favorite ? "text-white" : "text-secondary-400")}>{bouquet_channels.length} chaînes, radios et services.</p> */}
        <ul role="list" className="order-last mt-4 flex flex-col gap-y-3 text-sm text-secondary-200">
            <li className="flex">
                <CheckCircleIcon className="h-6 w-6 flex-none text-white" />
                <span className="ml-4">{bouquet_channels.length} chaînes et radios.</span>
            </li>
            {bouquet_series.length > 0 && <li className="flex">
                <CheckCircleIcon className="h-6 w-6 flex-none text-white" />
                <span className="ml-4">{bouquet_series.length} séries.</span>
            </li>}
        </ul>

        <Link href={`/bouquets/${id}`}>
            <a className={classNames(favorite ? "group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-white text-secondary-900 hover:bg-blue-50 active:bg-blue-200 active:text-secondary-600 focus-visible:outline-white mt-4" : "group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none ring-secondary-700 text-white hover:ring-secondary-500 active:ring-secondary-700 active:text-secondary-400 focus-visible:outline-white mt-4")} aria-label={`Découvrir le bouquet ${bouquet_name}`}>Découvrir</a>
        </Link>
    </section>
}