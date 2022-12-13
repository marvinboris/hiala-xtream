// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../../../app/helpers/utils'
import Serie from '../../../../app/models/serie'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any[] | { error: string }>
) {
    try {
        const { category_id } = req.query
        let series
        if (category_id) series = await Serie.findAll({ where: { category_id } })
        else series = await Serie.findAll()
        res.status(200).json(series)
    } catch (error) {
        handleError(res, error)
    }
}
