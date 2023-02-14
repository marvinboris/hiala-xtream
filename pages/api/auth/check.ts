// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { InferAttributes, Op } from 'sequelize'

import { decryptPayload, handleError } from '../../../app/helpers/utils'
import Bouquet from '../../../app/models/bouquet'
import User from '../../../app/models/user'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ data: InferAttributes<User> } | { error: string }>
) {
    try {
        if (!req.cookies.user) return res.status(401).json({ error: "Not authorized!" })

        const decrypted = decryptPayload(req.cookies.user)
        if (!decrypted) return res.status(401).json({ error: "Not authorized!" })

        const { id } = decrypted
        const user = await User.findByPk(id)

        if (!user) return res.status(401).json({ error: "Invalid user!" })
        
        const data = { ...user.get() }
        if (typeof user.bouquet === 'object') {
            const bouquet = await Bouquet.findAll({ where: { id: { [Op.in]: (user.bouquet as number[]) } } })
            data.bouquet = bouquet
        }

        res.json({ data })
    } catch (error) {
        handleError(res, error)
    }
}