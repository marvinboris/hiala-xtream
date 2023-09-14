// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";

import { handleError } from "../../../app/helpers/utils";

import Bouquet from "../../../app/models/bouquet";
import User from "../../../app/models/user";

import { sign } from "../../../lib/jose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ token: string; data: any } | { error: string }>
) {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            admin_notes: {
              [Op.like]: `%${login}%`,
            },
          },
          { username: login },
        ],
        password,
      },
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const payload = { user: { id: user.get("id") } };
    const token = await sign(payload, process.env.JWT_SECRET!);

    const data = { ...user.get() };
    if (typeof user.bouquet === "object") {
      const bouquet = await Bouquet.findAll({
        where: { id: { [Op.in]: user.bouquet as number[] } },
      });
      data.bouquet = bouquet;
    }

    res.json({ token, data });
  } catch (error) {
    handleError(res, error);
  }
}
