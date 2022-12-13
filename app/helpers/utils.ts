import axios from 'axios'

export const setAuthToken = (token?: string | undefined | null) => {
    if (token) axios.defaults.headers.common['x-auth-token'] = token
    else delete axios.defaults.headers.common['x-auth-token']
}

export const handleError = (res: any, error: any) => {
    console.log(error)
    res.status(500).send({ error: 'Failed to fetch data' })
}

export const decryptPayload = (str: string) => {
    const withoutJ = str.split('').filter((char, i) => i > 1).join('')

    return JSON.parse(withoutJ)
}

export const classNames = (...c: string[]) => c.join(' ')

export const generateString = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}