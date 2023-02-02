import { createReadStream, createWriteStream, existsSync, mkdirSync, rmSync, statSync } from "fs"
import path from "path"
import { promisify } from "util"

import got from "got"
import { NextApiResponse } from "next"
import stream from 'stream'

const send = (res: NextApiResponse) => {
    const readStream = createReadStream(path.join(process.cwd(), 'public', 'images', 'favicon.svg'))

    res.setHeader("Content-Type", "image/svg+xml")
    readStream.pipe(res)
}

type AssetsParams = {
    src: string | undefined
    res: NextApiResponse
}

export const assets = async ({ src, res }: AssetsParams) => {
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
}