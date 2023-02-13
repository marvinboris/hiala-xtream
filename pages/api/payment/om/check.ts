// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFileSync } from 'fs'
import { Agent } from 'https'

import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { decryptPayload, handleError } from '../../../../app/helpers/utils'

import User from '../../../../app/models/user'

import MerchantPayment from '../../../../app/types/payment/om/merchant-payment'
import Bouquet from '../../../../app/models/bouquet'

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
                ca: readFileSync('node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle/ca_intermediate_root_bundle.pem')
            }),
            validateStatus: () => true
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

        if (response.data.data.status === 'SUCCESSFULL') {
            const decrypted = decryptPayload(req.cookies.user!)
            if (!decrypted) return res.status(401).json({ error: "Not authorized!" })

            const user = await User.findByPk(decrypted.id)
            if (!user) return res.status(401).json({ error: "Invalid user!" })

            const test_bouquet = await Bouquet.findOne({ where: { bouquet_name: 'TEST' } })

            const bouquet_id = +response.data.data.txnmode.split('_')[1]
            let bouquet = JSON.stringify((JSON.parse(user.getDataValue('bouquet') as string) as number[]).concat(bouquet_id))
            if ((user.bouquet as number[]).length === 1 && user.bouquet[0] === test_bouquet!.id) bouquet = JSON.stringify([bouquet_id])
            const exp_date = new Date().getTime() / 1000 + 30 * 24 * 60 * 60
            
            user.bouquet = bouquet
            user.exp_date = exp_date

            await user.save()
        }

        return res.status(200).json(response.data)
    } catch (error) {
        handleError(res, error)
    }
}