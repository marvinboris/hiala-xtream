// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { checkCredit } from '../../lib/budget-sms'

type Data = boolean

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const answer = await checkCredit()

  res.status(200).json(answer)
}
