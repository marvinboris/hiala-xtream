// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

import AuthLoginType from '../../app/types/auth/login'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AuthLoginType | { token: string | undefined } | { error: string }>
) {
    const { username, password } = req.body
    try {
        const response = await axios.get<AuthLoginType>('', {
            baseURL: `${process.env.API_URL}/player_api.php`,
            params: { username, password }
        })

        const user = response.data
        if (!user) return res.status(401).json({ error: 'Invalid credentials' })

        const payload = { user: { username, password } }
        jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: 720000 }, (err, token) => {
            if (err) throw err
            res.json({ token })
        })
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch data' })
    }
}