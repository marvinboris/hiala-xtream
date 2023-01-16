// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import User from '../../app/models/user'

type Data = unknown

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await User.findOne()
  const data = user!.bouquet.length

  res.status(200).json([data, typeof data])
}
