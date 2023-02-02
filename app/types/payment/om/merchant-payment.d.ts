export default interface MerchantPayment {
    message: string
    data: {
        id: number
        createtime: string
        subscriberMsisdn: string
        amount: number
        payToken: string
        txnid: string
        txnmode: string
        inittxnmessage: string
        inittxnstatus: string
        confirmtxnstatus: string | null
        confirmtxnmessage: string | null
        status: "PENDING" | "SUCCESSFULL" | "CANCELLED" | "FAILED"
        notifUrl: string
        description: string
        channelUserMsisdn: string
    }
}