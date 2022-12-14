// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createReadStream, createWriteStream } from 'fs'
import stream from 'stream'
import { promisify } from 'util'

import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../app/helpers/utils'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<unknown | { error: string }>
) {
    const src = req.query.src as string
    try {
        const pipeline = promisify(stream.pipeline)

        const parsedSrc = src.split('/')
        const fileName = parsedSrc.filter((_, i) => i > 2).join('-')

        const downloadStream = got.stream(src)
        const fileWriterStream = createWriteStream(fileName)
        await pipeline(downloadStream, fileWriterStream)
        const readStream = createReadStream(fileName)
        
        readStream.pipe(res)
    } catch (error) {
        handleError(res, error)
    }
}