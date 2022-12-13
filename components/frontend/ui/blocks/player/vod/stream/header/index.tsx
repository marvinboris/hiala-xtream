import { useCategoriesContext } from "../../../../../../../../app/contexts/categories";
import StreamType from "../../../../../../../../app/types/stream";
import View from "../../../ui/view";

export default function VodStreamHeader(props: StreamType) {
    const { vodCategories } = useCategoriesContext()
    const category = vodCategories?.find(s => s.id === props.category_id)

    return !category ? <></> : <div className="inline-block relative rounded-lg w-full md:w-6/12 px-[2.5px] md:px-[5px]">
        <View stream={props} action={<div className="bg-secondary-900 text-transparent ratio-4by3 cursor-pointer">
            <img src={props.movie_propeties.cover_big} alt={props.stream_display_name} className="image-cover absolute inset-0" />
        </div>} />
    </div>
}