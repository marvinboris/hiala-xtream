// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { request } from 'http'

import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../app/helpers/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<unknown | { error: string }>
) {
    const { src } = req.query
    try {
        request(src as string).pipe(res)
    } catch (error) {
        handleError(res, error)
    }
}