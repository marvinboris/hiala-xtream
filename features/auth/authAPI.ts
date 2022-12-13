import axios from "axios"

// Login
export const postLogin = async (data: { username: string, password: string }) => {
    const res = await axios.post<{ token: string, data: any }>('/api/auth/login', data)
    return res.data
}

export const getCheck = async () => {
    const res = await axios.get<false | { data: any }>('/api/auth/check')
    return res.data
}