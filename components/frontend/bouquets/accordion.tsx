import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import StreamType from '../../../app/types/stream'
import StreamCategoryType from '../../../app/types/stream_category'

type CategoryType = StreamCategoryType & {
    channels: StreamType[]
}

interface BouquetAccordionProps {
    categories: CategoryType[]
}

export default function BouquetAccordion({ categories }: BouquetAccordionProps) {
    const categoriesContent = categories.map(category => {
        const channelsContent = category.channels.filter(channel => channel.category_id === category.id).map(channel => <div key={`channel-${channel.id}`} className='rounded-sm bg-secondary-900 shadow-sm flex items-center space-x-2 p-2'>
            <div><img src={channel.stream_icon} alt={channel.stream_display_name} className="w-10 h-10 object-contain" /></div>

            <div>{channel.stream_display_name}</div>
        </div>)

        return <Disclosure key={`bouquet-accordio-category-${category.id}`}>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
                        <span>{category.category_name}</span>
                        <ChevronUpIcon
                            className={`${open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-primary-500`}
                        />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                        <div className='grid grid-cols-4 gap-4'>{channelsContent}</div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    })

    return (
        <div className="w-full px-4 pt-16">
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 space-y-2">
                {categoriesContent}
            </div>
        </div>
    )
}
