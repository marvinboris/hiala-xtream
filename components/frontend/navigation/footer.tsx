import Link from "next/link"

import StreamCategoryType from "../../../app/types/stream_category"

interface FooterProps {
    liveCategories: StreamCategoryType[]
    seriesCategories: StreamCategoryType[]
}

export default function Footer({ liveCategories = [], seriesCategories = [] }: FooterProps) {
    return <footer className="border-t border-secondary-100 dark:border-secondary-200/20 text-sm bg-secondary-50 dark:bg-black">
        <div className="container py-4 md:py-8 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <div className="mb-8 xl:mb-0">
                <div className="font-semibold text-black dark:text-white pb-2 border-b border-secondary-100 dark:border-secondary-200/20 mb-4">Programmes</div>
                <div className="grid gap-2 grid-cols-2">
                    {liveCategories.map(category => <div key={`footer-live-categories-${category.id}`} className="text-xs">
                        <Link href={`/chaines/${category.slug}`}>
                            <a className="capitalize">{category.category_name}</a>
                        </Link>
                    </div>)}
                </div>
            </div>

            <div className="mb-8 xl:mb-0">
                <div className="font-semibold text-black dark:text-white pb-2 border-b border-secondary-100 dark:border-secondary-200/20 mb-4">Séries</div>
                <div className="grid gap-2 grid-cols-2">
                    {seriesCategories.map(category => <div key={`footer-series-categories-${category.id}`} className="text-xs">
                        <Link href={`/series/${category.slug}`}>
                            <a className="capitalize">{category.category_name}</a>
                        </Link>
                    </div>)}
                </div>
            </div>

            <div>© {new Date().getFullYear()} Copyright - <span className="font-semibold">Hiala TV</span></div>
        </div>
    </footer>
}