import { NextApiRequest, NextApiResponse } from "next";
import { InferAttributes, Op } from "sequelize";

import { handleError } from "../../../../app/helpers/utils";
import { Serie, Stream } from "../../../../app/models";
import Bouquet from "../../../../app/models/bouquet";

type Data = InferAttributes<Bouquet> & { channels: Stream[], series: Serie[] }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | { error: string }>
) {
    const id = req.query.id as string
    try {
        const bouquetData = await Bouquet.findByPk(+id)

        if (!bouquetData) return res.status(404).json({ error: 'Bouquet not found.' })

        const channels = await Stream.findAll({ where: { id: { [Op.in]: (bouquetData.bouquet_channels as number[]) } } })
        const series = await Serie.findAll({ where: { id: { [Op.in]: (bouquetData.bouquet_series as number[]) } } })

        const bouquet = { ...bouquetData.get(), channels, series }

        res.status(200).json(bouquet)
    } catch (error) {
        handleError(res, error)
    }
}