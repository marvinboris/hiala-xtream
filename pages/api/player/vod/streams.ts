// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../../../app/helpers/utils'
import Stream from '../../../../app/models/stream'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Stream[] | { error: string }>
) {
    try {
        const { category_id } = req.query
        // const type = await Strea
        const type = 2

        let vod_streams
        if (category_id) vod_streams = await Stream.findAll({ where: { category_id, type } })
        else vod_streams = await Stream.findAll({ where: { type } })

        res.status(200).json(vod_streams)
    } catch (error) {
        handleError(res, error)
    }
}
