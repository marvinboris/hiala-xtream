import React from 'react'

interface PageTitleProps {
    title: React.ReactNode
    subtitle: React.ReactNode
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element
    children: React.ReactNode
}

export default function PageTitle({ title, subtitle, icon: Icon, children }: PageTitleProps) {
    return <header className="container">
        <div className="bg-secondary-800 py-6 pl-9 pr-12 flex items-center rounded-[30px]">
            <div className="text-white opacity-30 relative pr-[22px] mr-[22px]">
                <Icon className="w-[52px]" />
                <div className='bg-white w-2.5 h-2.5 rounded-full absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2' />
            </div>
            
            <div>
                <h1 className="text-white font-bold text-[30px]">{title}</h1>
                <p className="text-xl text-lime-500">{subtitle}</p>
            </div>

            <div className="ml-auto">
                {children}
            </div>
        </div>
    </header>
}