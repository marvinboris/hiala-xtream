// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { decryptPayload, handleError } from '../../../../../app/helpers/utils'
import User from '../../../../../app/models/user'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<unknown | { error: string }>
) {
    try {
        const decrypted = decryptPayload(req.cookies.user!)
        if (!decrypted) return res.status(401).json({ error: "Not authorized!" })

        const user = await User.findByPk(decrypted.id)
        if (!user) return res.status(401).json({ error: "Invalid user!" })

        const { id } = req.query
        const { username, password } = user
        
        const source = await axios.get<string>(`${process.env.XTREAM_HOSTNAME!}/live/${username}/${password}/${id}.m3u8`)

        const expression = new RegExp(`/hls/${username}/${password}`, "g")
        const result = source.data.replace(expression, `/api/assets?src=${process.env.XTREAM_HOSTNAME!}/hls/${username}/${password}`)
        
        res.send(result)
    } catch (error) {
        handleError(res, error)
    }
}

