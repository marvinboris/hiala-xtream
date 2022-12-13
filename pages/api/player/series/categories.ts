// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from './../../../../app/helpers/utils';
import StreamCategory from '../../../../app/models/stream_category'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StreamCategory[] | { error: string }>
) {
    try {
        const series_categories = await StreamCategory.findAll({ where: { category_type: 'series' } })
        res.status(200).json(series_categories)
    } catch (error) {
        handleError(res, error)
    }
}
