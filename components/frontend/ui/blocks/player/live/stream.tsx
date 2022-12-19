import Link from "next/link";
import slugify from "slugify";

import { useCategoriesContext } from "../../../../../../app/contexts/categories";
import StreamType from "../../../../../../app/types/stream";

import Subscribe from "../ui/subscribe";

export default function LiveStream({ category_id, stream_display_name, stream_icon, id }: StreamType) {
    const { liveCategories } = useCategoriesContext()
    const c = liveCategories?.find(l => l.id === category_id)

    return c ? <div>
        <Link href={`/chaines/${slugify(c.category_name, { lower: true })}/${slugify(stream_display_name, { lower: true })}`}>
            <a className="block relative p-2 lg:p-4 rounded-[20px] bg-white hover:bg-secondary-100 cursor-pointer space-y-2 lg:space-y-4 transition-all duration-200">
                <div className="aspect-square rounded-2xl relative p-4 flex items-center justify-center overflow-hidden z-0">
                    <img src={`/api/assets?src=${stream_icon}`} alt={stream_display_name} className="w-full h-full object-contain" />
                    <img src={`/api/assets?src=${stream_icon}`} alt={stream_display_name} className="w-full h-full object-cover absolute inset-0 -z-10 blur-3xl scale-150" />
                </div>
                <Subscribe type="stream" id={id} />
                <div className="text-secondary-600 truncate text-center text-sm lg:text-base capitalize">{stream_display_name}</div>
            </a>
        </Link>
    </div> : null
}