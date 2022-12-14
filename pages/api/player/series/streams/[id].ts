// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { existsSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'

import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import type { NextApiRequest, NextApiResponse } from 'next'

import { decryptPayload, handleError } from '../../../../../app/helpers/utils'
import { Stream } from '../../../../../app/models'
import User from '../../../../../app/models/user'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<unknown | { error: string }>
) {
    ffmpeg.setFfmpegPath(ffmpegPath)
    
    try {
        const decrypted = decryptPayload(req.cookies.user!)
        if (!decrypted) return res.status(401).json({ error: "Not authorized!" })

        const user = await User.findByPk(decrypted.id)
        if (!user) return res.status(401).json({ error: "Invalid user!" })

        const id = req.query.id as string
        const { username, password } = user
        const series = await Stream.findByPk(+id)

        const src = `${process.env.XTREAM_HOSTNAME!}/series/${username}/${password}/${id}.${series!.target_container[0]}`

        const parsedSrc = src.split('/')

        const directory = path.join(process.cwd(), 'public', 'files', parsedSrc[3])
        const fileName = `${parsedSrc.filter((_, i) => i > 3).join('-')}.m3u8`

        const filePath = path.join(directory, fileName)
        if (!existsSync(directory)) mkdirSync(directory)
        if (!existsSync(filePath)) {
            ffmpeg(src, { timeout: 432000 }).addOptions([
                '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
                '-level 3.0',
                // '-s 640x360',          // 640px width, 360px height output video dimensions
                '-start_number 0',     // start the first .ts segment at index 0
                '-hls_time 5',        // 5 second segment duration
                '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
                '-f hls'               // HLS format
            ]).output(filePath).run()

            return res.end()
        }

        const source = readFileSync(filePath, 'utf8')

        const expression = new RegExp(`${username}-${password}-${id}`, "g")
        const result = source.replace(expression, `/files/series/${username}-${password}-${id}`)

        res.send(result)
    } catch (error) {
        handleError(res, error)
    }
}

