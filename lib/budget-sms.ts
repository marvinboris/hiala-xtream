import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api.budgetsms.net/',
})

export const sendSms = async ({ to, message }: { to: string, message: string }) => {
    try {
        const info = await instance.get<unknown>(`sendsms`, {
            params: {
                username: process.env.BUDGET_USERNAME,
                userid: process.env.BUDGET_USERID,
                handle: process.env.BUDGET_HANDLE,
                from: process.env.COMPANY_NAME,
                msg: message, to: +to
            }
        })
        console.log(`SMS: ${info.data}`);
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const testSms = async ({ to, message }: { to: string, message: string }) => {
    try {
        const info = await instance.get<unknown>(`testsms`, {
            params: {
                username: process.env.BUDGET_USERNAME,
                userid: process.env.BUDGET_USERID,
                handle: process.env.BUDGET_HANDLE,
                from: process.env.COMPANY_NAME,
                msg: message, to: +to
            }
        })
        console.log(`SMS: ${info.data}`);
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const checkCredit = async () => {
    try {
        const info = await instance.get<unknown>(`checkcredit`, {
            params: {
                username: process.env.BUDGET_USERNAME,
                userid: process.env.BUDGET_USERID,
                handle: process.env.BUDGET_HANDLE,
            }
        })
        console.log(`SMS: ${info.data}`);
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}