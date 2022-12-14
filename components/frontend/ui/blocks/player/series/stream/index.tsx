import { useCategoriesContext } from "../../../../../../../app/contexts/categories";
import SeriesStreamType from "../../../../../../../app/types/series/stream";
import Subscribe from "../../ui/subscribe";
import View from "../../ui/view";

export default function SeriesStream(props: SeriesStreamType) {
    const { seriesCategories } = useCategoriesContext()
    const category = seriesCategories?.find(s => s.id === +props.category_id)

    return !category ? <></> : <div className="inline-block whitespace-normal w-1/2 md:w-1/3 lg:w-1/4 xl:w-[12.5%] px-[2.5px] md:px-2 align-top">
        <View stream={props} action={<div className="cursor-pointer group">
            <div className="aspect-[3/5] rounded-2xl overflow-hidden relative bg-black transition-all duration-200 group-hover:shadow-md">
                <img src={`/api/assets?src=${props.cover}`} alt={props.title} className="image-cover absolute inset-0 z-0" />
                <Subscribe type="serie" id={props.id} />
            </div>
        </div>} />
    </div>
}