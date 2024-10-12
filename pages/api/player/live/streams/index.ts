// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { InferAttributes, Op } from "sequelize";

import { handleError } from "../../../../../app/helpers/utils";
import { StreamsSys } from "../../../../../app/models";
import Stream from "../../../../../app/models/stream";

function isJSONString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    (InferAttributes<Stream> & { encoding: string })[] | { error: string }
  >
) {
  try {
    const { category_id } = req.query;
    // const type = await Strea
    const type = 1;

    let liveStreams;
    if (category_id)
      liveStreams = await Stream.findAll({ where: { category_id, type } });
    else liveStreams = await Stream.findAll({ where: { type } });

    const ids = liveStreams.map((s) => s.id as number);
    const sys = await StreamsSys.findAll({
      where: { stream_id: { [Op.in]: ids } },
    });

    res.status(200).json(
      liveStreams.map((stream) => {
        const index = sys.findIndex((item) => item.stream_id === stream.id)!;

        const str = sys.at(index)?.stream_info;
        const isJSON = str && isJSONString(str);

        const stream_info = isJSON && JSON.parse(str);
        const encoding = isJSON
          ? (stream_info.codecs.video.codec_name as string)
          : "";

        return {
          ...stream.get(),
          encoding,
        };
      })
    );
  } catch (error) {
    handleError(res, error);
  }
}
