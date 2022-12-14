import { useCategoriesContext } from "../../../../../../../app/contexts/categories";
import StreamType from "../../../../../../../app/types/stream";
import VodStreamType from "../../../../../../../app/types/vod/stream";
import Subscribe from "../../ui/subscribe";
import View from "../../ui/view";

export default function VodStream(props: StreamType) {
    const { vodCategories } = useCategoriesContext()
    const category = vodCategories?.find(s => s.id === props.category_id)

    return !category ? <></> : <div className="inline-block whitespace-normal w-1/2 md:w-1/3 lg:w-1/4 xl:w-[12.5%] px-[2.5px] md:px-2 align-top">
        <View stream={props} action={<div className="cursor-pointer group">
            <div className="aspect-[3/5] bg-black rounded-2xl overflow-hidden transition-all duration-200 group-hover:shadow-md relative">
                <img src={`/api/assets?src=${props.movie_propeties.cover_big}`} alt={props.stream_display_name} className="image-cover absolute inset-0 z-0" />
                <Subscribe type="stream" id={props.id} />
            </div>
        </div>} />
    </div>
}