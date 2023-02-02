import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";

import { decryptPayload, handleError } from "../../../../app/helpers/utils";

import Bouquet from "../../../../app/models/bouquet";
import User from "../../../../app/models/user";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Bouquet[] | { error: string }>
) {
    try {
        let bouquets
        if (req.cookies.user) {
            const decrypted = decryptPayload(req.cookies.user)
            if (!decrypted) return res.status(401).json({ error: "Not authorized!" })

            const user = await User.findByPk(decrypted.id)
            if (!user) return res.status(401).json({ error: "Invalid user!" })
            
            bouquets = await Bouquet.findAll({ where: { bouquet_name: { [Op.not]: 'TEST' }, id: { [Op.notIn]: user.bouquet as number[] } } })
        } else {
            bouquets = await Bouquet.findAll({ where: { bouquet_name: { [Op.not]: 'TEST' } } })
        }
        res.status(200).json(bouquets)
    } catch (error) {
        handleError(res, error)
    }
}