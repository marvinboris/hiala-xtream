import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ComponentProps } from 'react'

import BouquetType from "../../../../../../app/types/bouquet";

type BouquetProps = BouquetType & {
    favorite?: boolean
    price: number
}

const Li = (props: ComponentProps<'li'>) => <li className="flex items-center text-secondary-600 leading-none">
    <CheckCircleIcon className="w-4 md:w-5 flex-none text-green" />
    <span className="ml-2 md:ml-3 text-[9px] md:text-[11.3px]">{props.children}</span>
</li>

export default function Bouquet({ id, bouquet_name, bouquet_channels, bouquet_series, favorite, price }: BouquetProps) {
    return <div className="h-[285px] md:h-[365px]">
        <div className="w-full flex flex-col bg-white rounded-3xl shadow-2xl px-6 md:px-8 pb-5 md:pb-6 pt-7 md:pt-9 relative group hover:h-[285px] hover:md:h-[365px] hover:top-0 h-[246px] md:h-[316px] top-5 md:top-6 transition-all duration-200">
            <p className="font-display font-bold transition-all duration-200 group-hover:text-transparent group-hover:text-base group-hover:md:text-xl group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green group-hover:to-primary-800 group-hover:uppercase text-secondary-900 text-xs md:text-base capitalize">{bouquet_name.toLowerCase()}</p>
            <p className="font-display font-bold text-secondary-600 transition-all duration-200 group-hover:text-3xl group-hover:md:text-[40px] text-[22px] md:text-[28px]">{price} <span className="text-base text-secondary-400">XAF</span></p>
            <ul role="list" className="mt-4 flex flex-col gap-y-1 md:gap-y-1.5 text-sm">
                <Li>{bouquet_channels.length} chaînes TV <span className="ml-3 h-3.5 w-8 rounded-full bg-green text-white text-[8px] leading-none inline-flex items-center justify-center">Voir</span></Li>
                <Li>Accès films en illimité</Li>
                {bouquet_series.length > 0 ? <Li>{bouquet_series.length} séries en illimité</Li> : null}
                <Li>Connexion sur 5 appareils</Li>
                <Li>Service après vente</Li>
            </ul>

            <Link href={`/bouquets/${id}`}>
                <a className="flex items-center justify-center rounded-full leading-[38px] md:leading-[49px] font-bold text-[10px] md:text-xs text-white bg-gradient-to-r from-primary-800 to-teal mt-5 md:mt-7 opacity-0 group-hover:opacity-100 transition-all duration-200" aria-label={`Découvrir le bouquet ${bouquet_name}`}>Je m’abonne</a>
            </Link>
        </div>
    </div>
}