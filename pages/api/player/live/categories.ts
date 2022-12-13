// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../../../app/helpers/utils'
import StreamCategory from '../../../../app/models/stream_category'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StreamCategory[] | { error: string }>
) {
    try {
        const stream_categories = await StreamCategory.findAll({ where: { category_type: 'live' } })

        res.status(200).json(stream_categories)
    } catch (error) {
        handleError(res, error)
    }
}
