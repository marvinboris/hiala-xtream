// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs'
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

        const directory = path.join(process.cwd(), 'public', 'files', parsedSrc[3])
        const fileName = parsedSrc.filter((_, i) => i > 3).join('-')

        const filePath = path.join(directory, fileName)

        if (!existsSync(directory)) mkdirSync(directory)

        if (!existsSync(filePath)) {
            const downloadStream = got.stream(src)
            const fileWriterStream = createWriteStream(filePath)
            await pipeline(downloadStream, fileWriterStream)
        }
        const readStream = createReadStream(filePath)

        readStream.pipe(res)
    } catch (error) {
        handleError(res, error)
    }
}