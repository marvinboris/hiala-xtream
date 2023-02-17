// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { decryptPayload, handleError } from '../../../../../app/helpers/utils'
import { Stream } from '../../../../../app/models'
import User from '../../../../../app/models/user'
import { assets } from '../../../../../lib/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<unknown | { error: string }>
) {
    try {
        if (!req.cookies.user) return res.status(401).json({ error: 'Unauthorized' })

        const decrypted = decryptPayload(req.cookies.user!)
        if (!decrypted) return res.status(401).json({ error: "Not authorized!" })

        const user = await User.findByPk(decrypted.id)
        if (!user) return res.status(401).json({ error: "Invalid user!" })

        const id = req.query.id as string
        const { username, password } = user
        const movie = await Stream.findByPk(+id)

        const src = `${process.env.XTREAM_HOSTNAME!}/movie/${username}/${password}/${id}.${movie!.target_container[0]}`
        return await assets({ src, req, res })
    } catch (error) {
        handleError(res, error)
    }
}

export const config = {
    api: {
        responseLimit: false
    }
}