// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../app/helpers/utils'
import { assets } from '../../lib/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<unknown | { error: string }>
) {
    try {
        const src = req.query.src as string | undefined
        return await assets({ src, res })
    } catch (error) {
        handleError(res, error)
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
}