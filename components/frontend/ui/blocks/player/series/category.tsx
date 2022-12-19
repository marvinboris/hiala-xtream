import Link from "next/link";
import slugify from 'slugify'

import StreamCategoryType from "../../../../../../app/types/stream_category";

export default function SeriesCategory({ category_name }: StreamCategoryType) {
    return <Link href={`/series/${slugify(category_name, { lower: true })}`}>
        <a className="block">
            <div className="bg-primary-600 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-[14.285714%] relative before:block before:pt-[75%] mx-2 bg-opacity-75 cursor-pointer transition-all duration-200 hover:bg-opacity-90 hover:shadow-md text-center rounded-lg text-white font-extrabold uppercase inline-flex items-center justify-center text-2xl h-32 px-3">
                <div className="w-full absolute inset-0">{category_name}</div>
            </div>
        </a>
    </Link>
}