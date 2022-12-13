// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../../../app/helpers/utils'
import Bouquet from '../../../app/models/bouquet'
import User from '../../../app/models/user'

import sendMail from '../../../lib/nodemailer';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string } | { error: string }>
) {
    const { first_name, last_name, email, phone, password } = req.body
    try {
        const generateUsername = () => {
            const numbers: number[] = []
            for (let index = 0; index < 4; index++) {
                numbers.push(phone[Math.floor(Math.random() * phone.length)])
            }
            return first_name.toLowerCase()[0] + last_name.toLowerCase() + numbers.join('')
        }
    
        let username = generateUsername()
        while (await User.findOne({ where: { username } })) {
            username = generateUsername()
        }

        const test_bouquet = await Bouquet.findOne({ where: { bouquet_name: 'TEST' } })

        const user = await User.create({
            member_id: 1,
            username, password,
            admin_notes: JSON.stringify({ first_name, last_name, email, phone }),
            bouquet: JSON.stringify(test_bouquet ? [test_bouquet.id] : []),
            exp_date: new Date().getTime() / 1000 + 7 * 24 * 60 * 60,
        })

        sendMail({
            to: email,
            subject: 'Bienvenue chez Hiala',
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
            `
        })

        res.json({ message: "Compte créé avec succès. Veuillez consulter votre adresse mail." })
    } catch (error) {
        handleError(res, error)
    }
}