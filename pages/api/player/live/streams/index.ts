// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../../../../app/helpers/utils'
import Stream from '../../../../../app/models/stream'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Stream[] | { error: string }>
) {
    try {
        const { category_id } = req.query
        // const type = await Strea
        const type = 1

        let liveStreams
        if (category_id) liveStreams = await Stream.findAll({ where: { category_id, type } })
        else liveStreams = await Stream.findAll({ where: { type } })

        res.status(200).json(liveStreams)
    } catch (error) {
        handleError(res, error)
    }
}
