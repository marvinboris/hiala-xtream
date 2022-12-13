// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Op } from 'sequelize';

import { handleError } from './../../../../app/helpers/utils';
import { SeriesEpisode, Stream } from '../../../../app/models'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any[] | { error: string }>
) {
    try {
        const { series_id } = req.query
        const series_episodes = await SeriesEpisode.findAll({ where: { series_id } })
        const streams = await Stream.findAll({ where: { id: { [Op.in]: series_episodes.map(episode => episode.stream_id) } } })
        
        const episodes = streams.map(stream => {
            const episode = series_episodes.find(episode => episode.stream_id === stream.id)!
            return { stream, ...episode.get() }
        })

        res.status(200).json(episodes)
    } catch (error) {
        handleError(res, error)
    }
}
