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
    const { amount, name, id, basePath, phone } = req.body
    try {
        const instance = axios.create({
            baseURL: "https://api-s1.orange.cm/",
            headers: {
                'X-AUTH-TOKEN': process.env.OM_X_AUTH_TOKEN,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            httpsAgent: new Agent({
                ca: require('ssl-root-cas/latest').create()
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

        const mpInitRes = await instance.post<{
            message: string
            data: {
                payToken: string
            }
        }>("omcoreapis/1.0.2/mp/init", initBody, {
            headers: {
                Authorization: `${tokenRes.data.token_type} ${tokenRes.data.access_token}`,
            },
        })

        const payBody = {
            notifUrl: `${basePath}/api/payment/om/notify`,
            amount: amount,
            orderId: `${Date.now()}_${phone}_${id}`,
            description: name,
            channelUserMsisdn: process.env.OM_USER,
            subscriberMsisdn: phone,
            pin: process.env.OM_PIN,
            payToken: mpInitRes.data.data.payToken,
        }

        const response = await instance.post<MerchantPayment>("omcoreapis/1.0.2/mp/pay", payBody, {
            headers: {
                Authorization: `${tokenRes.data.token_type} ${tokenRes.data.access_token}`,
            },
        })

        console.log(response.data)
        return res.status(200).json(response.data)
    } catch (error) {
        handleError(res, error)
    }
}