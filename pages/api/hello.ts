// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Op } from 'sequelize'

import AccessOutput from '../../app/models/access_output'
import User from '../../app/models/user'
import UserOutput from '../../app/models/user_output'

import { checkCredit } from '../../lib/budget-sms'

type Data = boolean

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const access_output = await AccessOutput.findAll()

  const users = await User.findAll({ where: { created_at: 0 } })

  await Promise.all(users.map(async user =>
    await Promise.all(access_output.map(async item =>
      await UserOutput.create({
        user_id: user.id,
        access_output_id: item.access_output_id,
      })
    ))
  ))

  res.status(200).json(true)
}
