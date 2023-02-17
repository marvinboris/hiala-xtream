import { createReadStream } from "fs"
import path from "path"

import got from "got"
import { NextApiRequest, NextApiResponse } from "next"

const send = (res: NextApiResponse) => {
    const readStream = createReadStream(path.join(process.cwd(), 'public', 'images', 'favicon.svg'))

    res.setHeader("Content-Type", "image/svg+xml")
    readStream.pipe(res)
}

type AssetsParams = {
    src: string | undefined
    req: NextApiRequest
    res: NextApiResponse
}

export const assets = async ({ src, req, res }: AssetsParams) => {
    if (!src) return send(res)
    return got.stream(src, { headers: req.headers }).pipe(res)
}