// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createReadStream, createWriteStream, existsSync } from 'fs'
import stream from 'stream'
import { promisify } from 'util'

import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../app/helpers/utils'
import path from 'path'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<unknown | { error: string }>
) {
    const src = req.query.src as string
    try {
        const pipeline = promisify(stream.pipeline)

        const parsedSrc = src.split('/')
        const fileName = path.join(__dirname, 'public', 'files', parsedSrc[2], parsedSrc.filter((_, i) => i > 3).join('-'))

        // if (!existsSync(fileName)) {
        const downloadStream = got.stream(src)
        const fileWriterStream = createWriteStream(fileName)
        await pipeline(downloadStream, fileWriterStream)
        // }
        const readStream = createReadStream(fileName)

        readStream.pipe(res)
    } catch (error) {
        handleError(res, error)
    }
}