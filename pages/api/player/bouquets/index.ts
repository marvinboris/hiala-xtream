import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";

import { handleError } from "../../../../app/helpers/utils";
import Bouquet from "../../../../app/models/bouquet";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Bouquet[] | { error: string }>
) {
    try {
        const bouquets = await Bouquet.findAll({ where: { bouquet_name: { [Op.not]: 'TEST' } } })

        res.status(200).json(bouquets)
    } catch (error) {
        handleError(res, error)
    }
}