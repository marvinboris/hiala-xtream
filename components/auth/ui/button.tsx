import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { ComponentProps } from 'react'

import Status from "../../../app/types/status"

type ButtonProps = ComponentProps<'button'> & { status: Status }

export default function Button({ status, children }: ButtonProps) {
    return <button className="group inline-flex leading-none items-center justify-center rounded-full h-[60px] font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-r from-primary-800 to-teal text-white hover:text-slate-100 hover:bg-primary-500 active:bg-primary-800 active:text-primary-100 focus-visible:outline-primary-800 w-full" type="submit">
        {status === Status.LOADING ?
            <span>
                <div className="inline-block w-4 h-4 border border-t-transparent border-white rounded-full animate-spin" />
            </span> :
            <span className='inline-flex items-center space-x-1'>
                <div>{children}</div>
                <ArrowRightIcon className='w-6 opacity-40' />
                <div className='w-2 h-2 rounded-full bg-white/40' />
            </span>}
    </button>
}