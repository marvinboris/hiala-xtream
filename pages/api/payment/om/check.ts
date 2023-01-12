// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Agent } from 'https'

import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../../../app/helpers/utils'
import MerchantPayment from '../../../../app/types/payment/om/merchant-payment'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<
        MerchantPayment |
        { error: string }
    >
) {
    const { payToken } = req.body
    try {
        const instance = axios.create({
            baseURL: "https://api-s1.orange.cm/",
            headers: {
                'X-AUTH-TOKEN': process.env.OM_X_AUTH_TOKEN,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            httpsAgent: new Agent({
                ca: require('ssl-root-cas').create()
            })
        })

        const initBody = { grant_type: 'client_credentials', }

        const tokenRes = await instance.post<{
            access_token: string
            scope: string
            token_type: string
            expires_in: number
        }>("token", initBody, {
            headers: {
                Authorization: `Basic ${process.env.OM_BASIC_AUTH}`,
            },
        });

        const response = await instance.get<MerchantPayment>(`omcoreapis/1.0.2/mp/paymentstatus/${payToken}`, {
            headers: {
                Authorization: `${tokenRes.data.token_type} ${tokenRes.data.access_token}`,
            },
        })

        return res.status(200).json(response.data)
    } catch (error) {
        handleError(res, error)
    }
}