// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createWriteStream, existsSync } from 'fs'
import path from 'path'
import { promisify } from 'util'

import type { NextApiRequest, NextApiResponse } from 'next'
import stream from 'stream'

import { decryptPayload, handleError } from '../../../../app/helpers/utils'
import Stream from '../../../../app/models/stream'
import User from '../../../../app/models/user'
import got from 'got'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Stream[] | { error: string }>
) {
    try {
        const { category_id } = req.query
        // const type = await Strea
        const type = 2

        const pipeline = promisify(stream.pipeline)

        const decrypted = decryptPayload(req.cookies.user!)
        if (!decrypted) return res.status(401).json({ error: "Not authorized!" })

        const user = await User.findByPk(decrypted.id)
        if (!user) return res.status(401).json({ error: "Invalid user!" })

        const { username, password } = user

        let vod_streams
        if (category_id) vod_streams = await Stream.findAll({ where: { category_id, type } })
        else vod_streams = await Stream.findAll({ where: { type } })

        vod_streams.forEach(stream => {
            const filePath = path.join(process.cwd(), 'public', 'files', 'series', stream.id.toString() + '.' + (<string[]>stream.target_container)[0])
            if (!existsSync(filePath)) {
                const downloadStream = got.stream(`${process.env.XTREAM_HOSTNAME!}/series/${username}/${password}/${stream.id.toString()}.${(<string[]>stream.target_container)[0]}`)
                const fileWriterStream = createWriteStream(filePath)
                pipeline(downloadStream, fileWriterStream)
            }
        })

        res.status(200).json(vod_streams)
    } catch (error) {
        handleError(res, error)
    }
}
