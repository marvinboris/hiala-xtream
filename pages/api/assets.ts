// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'fs'
import path from 'path'
import stream from 'stream'
import { promisify } from 'util'

import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../app/helpers/utils'

const send = (res: NextApiResponse) => {
    const readStream = createReadStream(path.join(process.cwd(), 'public', 'images', 'favicon.svg'))

    res.setHeader("Content-Type", "image/svg+xml")
    readStream.pipe(res)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<unknown | { error: string }>
) {
    try {
        const src = req.query.src as string

        if (!src) return send(res)

        const pipeline = promisify(stream.pipeline)

        const parsedSrc = src.split('/')

        const directory = path.join(process.cwd(), 'public', 'files', parsedSrc[3])
        const fileName = parsedSrc.filter((_, i) => i > 3).join('-')

        const filePath = path.join(directory, fileName)

        if (!existsSync(directory)) mkdirSync(directory)

        if (!existsSync(filePath)) {
            const downloadStream = got.stream(src)
            const fileWriterStream = createWriteStream(filePath)
            await pipeline(downloadStream, fileWriterStream)

            if (parsedSrc[3] === 'hls') setTimeout(() => {
                rmSync(filePath)
            }, 60 * 1000);
        }
        const readStream = createReadStream(filePath)
        const stat = statSync(filePath)

        if (stat.size > 0) return readStream.pipe(res)
        else send(res)
    } catch (error) {
        handleError(res, error)
    }
}

export const config = {
    api: {
        responseLimit: false,
    },
}