import { createWriteStream, existsSync } from 'fs';
import path from 'path';
import { promisify } from 'util';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import got from 'got';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Op } from 'sequelize';
import stream from 'stream'

import { decryptPayload, handleError } from './../../../../app/helpers/utils';
import { SeriesEpisode, Stream } from '../../../../app/models'
import User from '../../../../app/models/user';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any[] | { error: string }>
) {
    try {
        const { series_id } = req.query
        const series_episodes = await SeriesEpisode.findAll({ where: { series_id } })
        const streams = await Stream.findAll({ where: { id: { [Op.in]: series_episodes.map(episode => episode.stream_id) } } })

        const pipeline = promisify(stream.pipeline)

        const decrypted = decryptPayload(req.cookies.user!)
        if (!decrypted) return res.status(401).json({ error: "Not authorized!" })

        const user = await User.findByPk(decrypted.id)
        if (!user) return res.status(401).json({ error: "Invalid user!" })

        const { username, password } = user

        const episodes = streams.map(stream => {
            const episode = series_episodes.find(episode => episode.stream_id === stream.id)!

            const filePath = path.join(process.cwd(), 'public', 'files', 'series', stream.id.toString() + '.' + (<string[]>stream.target_container)[0])
            if (!existsSync(filePath)) {
                const downloadStream = got.stream(`${process.env.XTREAM_HOSTNAME!}/series/${username}/${password}/${stream.id.toString()}.${(<string[]>stream.target_container)[0]}`)
                const fileWriterStream = createWriteStream(filePath)
                pipeline(downloadStream, fileWriterStream)
            }
            return { stream, ...episode.get() }
        })

        res.status(200).json(episodes)
    } catch (error) {
        handleError(res, error)
    }
}
