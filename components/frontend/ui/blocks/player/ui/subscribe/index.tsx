import Link from "next/link";

import { useAppSelector } from "../../../../../../../app/hooks";
import { selectAuth } from "../../../../../../../features/auth/authSlice";

type SubscribeProps = {
    type: 'stream' | 'serie'
    id: number
}

export default function Subscribe({ type, id }: SubscribeProps) {
    const { data: account } = useAppSelector(selectAuth)

    const condition = account === null || !account.bouquet || !account.bouquet.find(bouquet => (type === 'stream' && bouquet.bouquet_channels.find(stream => stream === id)) || (type === 'serie' && bouquet.bouquet_series.find(serie => serie === id)))

    return condition ? <div>
        <a className="absolute py-0.5 px-1.5 top-[5px] right-[5px] bg-primary-600 rounded-sm text-white text-sm z-10">S'abonner</a>
    </div> : <></>
}