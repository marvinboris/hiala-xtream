// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createWriteStream, existsSync, statSync } from 'fs'
import path from 'path'
import { promisify } from 'util'

import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'
import stream from 'stream'

import { decryptPayload, handleError } from '../../../../app/helpers/utils'
import Stream from '../../../../app/models/stream'
import User from '../../../../app/models/user'

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

        // const pipeline = promisify(stream.pipeline)

        // const decrypted = decryptPayload(req.cookies.user!)
        // if (!decrypted) return res.status(401).json({ error: "Not authorized!" })

        // const user = await User.findByPk(decrypted.id)
        // if (!user) return res.status(401).json({ error: "Invalid user!" })

        // const { username, password } = user

        // Promise.all(vod_streams.map(async stream => {
        //     const filePath = path.join(process.cwd(), 'public', 'files', 'movie', stream.id.toString() + '.' + (<string[]>stream.target_container)[0])
        //     if (!existsSync(filePath) || (existsSync(filePath) && statSync(filePath).size === 0)) {
        //         const downloadStream = got.stream(`${process.env.XTREAM_HOSTNAME!}/movie/${username}/${password}/${stream.id.toString()}.${(<string[]>stream.target_container)[0]}`)
        //         const fileWriterStream = createWriteStream(filePath)
        //         await pipeline(downloadStream, fileWriterStream)
        //     }
        // }))

        res.status(200).json(vod_streams)
    } catch (error) {
        handleError(res, error)
    }
}
