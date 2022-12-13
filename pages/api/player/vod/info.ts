// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../../../app/helpers/utils'
import { Stream } from '../../../../app/models'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Stream | { error: string }>
) {
    try {
        const { vod_id } = req.query
        const vod = await Stream.findOne({ where: { id: vod_id } })
        res.status(200).json(vod!)
    } catch (error) {
        handleError(res, error)
    }
}
