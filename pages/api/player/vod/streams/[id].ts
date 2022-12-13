// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { decryptPayload, handleError } from '../../../../../app/helpers/utils'
import { Stream } from '../../../../../app/models'
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

        const id = req.query.id as string
        const { username, password } = user
        const movie = await Stream.findByPk(+id)
        const source = await axios.get<string>(`${process.env.XTREAM_HOSTNAME!}/movie/${username}/${password}/${id}.${movie!.target_container[0]}`)
        const expression1 = new RegExp(`/hls/${username}/${password}`, "g")
        const result1 = source.data.replace(expression1, `${process.env.XTREAM_HOSTNAME!}/hls/${username}/${password}`)
        // const expression2 = new RegExp(`.ts`, "g")
        // const result2 = result1.replace(expression2, '')
        res.send(result1)
    } catch (error) {
        handleError(res, error)
    }
}

