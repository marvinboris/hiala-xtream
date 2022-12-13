// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../../../app/helpers/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<
        { response: 'success', payment_url: string } |
        { response: 'error', error_code: number, message: string } |
        { error: string }
    >
) {
    const { amount, name, id, basePath } = req.body
    try {
        const parsed: { [key: string]: string } = {
            'amount': amount,
            'currency_code': 'XAF',
            'lang': 'FR',
            'item_ref': id,
            'item_name': name,
            'public_key': process.env.PAYMOONEY_PUBLIC_KEY!,
            'logo': `${basePath}/images/logo.png`,
        }
        if (process.env.NODE_ENV !== 'production') parsed.environement = 'test'

        const response = await axios.post<
            { response: 'success', payment_url: string } |
            { response: 'error', error_code: number, message: string }
        >("https://www.paymooney.com/api/v1.0/payment_url", parsed)
        console.log(response.data)
        return res.status(200).json(response.data)
    } catch (error) {
        handleError(res, error)
    }
}