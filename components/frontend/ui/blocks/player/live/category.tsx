import Link from "next/link";

import StreamCategoryType from "../../../../../../app/types/stream_category";

export default function LiveCategory({ id, category_name, slug }: StreamCategoryType) {
    const data: { color: string, photo: string }[] = [
        { color: 'blue', photo: 'edouard-tamba-MdNOvU9uFuo-unsplash.jpg' },
        { color: 'green', photo: 'geran-de-klerk-wYy3rvvgjAU-unsplash.jpg' },
        { color: 'red', photo: 'absolutvision-WYd_PkCa1BY-unsplash.jpg' },
        { color: 'yellow', photo: 'sandro-schuh-HgwY_YQ1m0w-unsplash.jpg' },
        { color: 'sky', photo: 'felix-mooneeram-evlkOfkQ5rE-unsplash.jpg' },
        { color: 'orange', photo: 'yohann-libot-oq-RPv_d5f4-unsplash.jpg' },
        { color: 'indigo', photo: 'jonas-von-werne-8VcWVVsrPBk-unsplash.jpg' },
        { color: 'lime', photo: 'marek-piwnicki-yexA3NCtIJ0-unsplash.jpg' },
        { color: 'cyan', photo: 'matt-botsford-OKLqGsCT8qs-unsplash.jpg' },
        { color: 'fuchsia', photo: 'justin-lim-tloFnD-7EpI-unsplash.jpg' },
        { color: 'pink', photo: 'dim-hou-BjD3KhnTIkg-unsplash.jpg' },
    ]
    const { photo } = data[(id - 1) % data.length]

    return <div className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-[14.285714%] px-[2.5px] md:px-[5px] inline-block">
        <Link href={`/chaines/${slug}`}>
            <a className={`block transition-all duration-200 hover:shadow-md ratio-4by3`}>
                <img src={`/images/live-categories/${photo}`} alt={category_name} className="image-cover absolute inset-0 z-0" />
                <div className="text-xs md:text-sm xl:text-base absolute inset-0 z-10 text-secondary-200 bg-secondary-900/50 font-extrabold flex items-center justify-center">{category_name}</div>
            </a>
        </Link>
    </div >
}