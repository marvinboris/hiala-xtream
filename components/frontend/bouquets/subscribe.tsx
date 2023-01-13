import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { classNames } from '../../../app/helpers/utils'
import MerchantPayment from '../../../app/types/payment/om/merchant-payment'
import Button from '../../ui/button'

const methods = [
    {
        name: 'Paiement mobile / par carte',
        description: 'OM / MoMo / VISA / MasterCard / PayPal',
        ref: 'paymooney'
    },
    {
        name: 'Paiement mobile - Orange',
        description: 'Orange Money',
        ref: 'om'
    },
]

interface BouquetSubscribeProps {
    amount: number
    name: string
    id: number
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function BouquetSubscribe({ amount, name, id }: BouquetSubscribeProps) {
    const { basePath } = useRouter()

    const [selected, setSelected] = useState(methods[0])
    const [loading, setLoading] = useState(false)

    const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
    const [paymentStatus, setPaymentStatus] = useState<MerchantPayment["data"]["status"] | null>(null)

    const [phone, setPhone] = useState('')

    const handleSubmit = async () => {
        if (loading) return
        if (selected.ref === 'paymooney') {
            setLoading(true)
            const res = await axios.post<
                { response: 'success', payment_url: string } |
                { response: 'error', error_code: number, message: string }
            >('/api/payment/paymooney', { amount, name, id, basePath })
            setLoading(false)
            if (res.data.response === 'success') setPaymentUrl(res.data.payment_url)
        } else if (selected.ref === 'om') {
            setLoading(true)
            const res = await axios.post<MerchantPayment>('/api/payment/om', { amount, name, id, basePath, phone })
            setLoading(false)
            setPaymentStatus(res.data.data.status)
            do {
                const checkRes = await axios.post<MerchantPayment>('/api/payment/om/check', { payToken: res.data.data.payToken })
                setPaymentStatus(checkRes.data.data.status)
                await sleep(5000)
            } while (paymentStatus === "PENDING");
        }
    }

    return (
        <div className="w-full px-4 py-16 relative z-0">
            {paymentUrl || paymentStatus ? <div className="absolute inset-0 bg-black/40 backdrop-filter backdrop-blur-sm flex flex-col items-center justify-center z-40">
                <div className='text-white'>{paymentStatus === 'SUCCESSFULL' ? "Paiement validé" :
                    paymentStatus === 'CANCELLED' ? "Paiement annulé" :
                        "Paiement en attente de validation"}</div>

                <div className="mt-4">
                    {paymentStatus === 'SUCCESSFULL' ? <CheckCircleIcon className='text-primary-600 w-20' /> :
                        paymentStatus === 'CANCELLED' ? <ExclamationCircleIcon className='text-red-600 w-20' /> :
                            <div className='border-[5px] border-t-transparent border-sky-600 rounded-full animate-spin w-20 h-20' />}
                </div>
            </div> : null}

            <div className="mx-auto w-full max-w-md relative z-0">
                <div className="relative z-0">
                    <RadioGroup value={selected} onChange={setSelected}>
                        <RadioGroup.Label className="sr-only">Méthode de paiement</RadioGroup.Label>
                        <div className="space-y-2">
                            {methods.map((method) => (
                                <RadioGroup.Option
                                    key={method.name}
                                    value={method}
                                    className={({ active, checked }) =>
                                        `${active ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-300' : ''} ${checked ? 'bg-primary-900 bg-opacity-75 text-white' : 'bg-white'} relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                                    }
                                >
                                    {({ active, checked }) => (
                                        <>
                                            <div className="flex w-full items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="text-sm">
                                                        <RadioGroup.Label
                                                            as="p"
                                                            className={`font-medium  ${checked ? 'text-white' : 'text-secondary-900'
                                                                }`}
                                                        >
                                                            {method.name}
                                                        </RadioGroup.Label>
                                                        <RadioGroup.Description
                                                            as="span"
                                                            className={`inline ${checked ? 'text-primary-100' : 'text-secondary-500'
                                                                }`}
                                                        >
                                                            <span>
                                                                {method.description}
                                                            </span>
                                                        </RadioGroup.Description>
                                                    </div>
                                                </div>
                                                {checked && (
                                                    <div className="shrink-0 text-white">
                                                        <CheckIcon className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </RadioGroup.Option>
                            ))}
                        </div>
                    </RadioGroup>
                </div>

                {selected.ref === 'om' ? <div className='mt-4'>
                    <input placeholder='Orange phone number' disabled={loading} className='rounded-lg bg-secondary-100 outline-none py-3 px-4 text-sm block w-full' onChange={e => setPhone(e.target.value)} value={phone} />
                </div> : null}

                <div className={classNames(paymentUrl ? "opacity-100 scale-100" : "opacity-0 scale-0", "fixed inset-0 z-50 items-center justify-center flex flex-col transition-all duration-200")}>
                    <div onClick={() => setPaymentUrl(null)} className='fixed z-0 top-0 left-0 w-screen h-screen bg-black/30' />
                    <div className="relative z-10">
                        <div className="container">
                            <iframe src={paymentUrl || ''} className="max-w-sm w-full min-h-[600px]" />
                        </div>
                    </div>
                </div>
                <Button onClick={handleSubmit} className="mt-5" color='primary'>{loading ? <div className='w-5 h-5 rounded-full border-t-transparent border border-white animate-spin' /> : "Continuer"}</Button>
            </div>
        </div>
    )
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
            <path
                d="M7 13l3 3 7-7"
                stroke="#fff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
