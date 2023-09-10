// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { handleError } from "../../../app/helpers/utils";
import AccessOutput from "../../../app/models/access_output";
import Bouquet from "../../../app/models/bouquet";
import User from "../../../app/models/user";
import UserOutput from "../../../app/models/user_output";

import { sendSms, testSms } from "../../../lib/budget-sms";
import sendMail from "../../../lib/nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error: string }>
) {
  const { first_name, last_name, email, code, phone, password } = req.body;
  try {
    const phone_number = code + phone;
    const generateUsername = () => {
      const numbers: number[] = [];
      for (let index = 0; index < 4; index++) {
        numbers.push(
          phone_number[Math.floor(Math.random() * phone_number.length)]
        );
      }
      return (
        first_name.toLowerCase()[0] + last_name.toLowerCase() + numbers.join("")
      );
    };

    let username = generateUsername();
    while (await User.findOne({ where: { username } })) {
      username = generateUsername();
    }

    const test_bouquet = await Bouquet.findOne({
      where: { bouquet_name: "TEST" },
    });

    const user = await User.create({
      member_id: 1,
      username,
      password,
      admin_notes: JSON.stringify({
        first_name,
        last_name,
        email,
        phone: phone_number,
      }),
      bouquet: JSON.stringify(test_bouquet ? [test_bouquet.id] : []),
      exp_date: new Date().getTime() / 1000 + 3 * 24 * 60 * 60,
      created_at: new Date().getTime() / 1000,
    });

    const access_output = await AccessOutput.findAll();

    await Promise.all(
      access_output.map(
        async (item) =>
          await UserOutput.create({
            user_id: user.id,
            access_output_id: item.access_output_id,
          })
      )
    );

    sendMail({
      to: email,
      subject: "Bienvenue chez Hiala",
      html: `
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@xz/fonts@1/serve/plus-jakarta-display.min.css" />
                <main style="font-family: 'Plus Jakarta Display', sans-serif; color: #5A657D;">
                    <h2>Votre compte a bien été créé</h2>
                    <p>Vous pouvez vous y connecter en utilisant les paramètres suivants :</p>
                    <ul>
                    <li>Nom d'utilisateur : <strong>${username}</strong></li>
                    <li>Mot de passe : <strong>${password}</strong></li>
                    </ul>
                </main>
            `,
    });

    sendSms({
      to: phone_number,
      message: `
            Votre compte a bien été créé.
            Vous pouvez vous y connecter en utilisant les paramètres suivants :
            Nom d'utilisateur : ${username}
            Mot de passe : ${password}
            `,
    });

    res.json({
      message:
        "Compte créé avec succès. Veuillez consulter votre adresse mail.",
    });
  } catch (error) {
    handleError(res, error);
  }
}
