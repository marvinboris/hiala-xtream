import BouquetType from "../bouquet"

export default interface UserType {
    id: number
    member_id: number | null
    username: string
    password: string
    exp_date: number | null
    admin_enabled: number
    enabled: number
    admin_notes: { first_name: string, last_name: string, email: string, phone: string } | null
    reseller_notes: string
    bouquet: BouquetType[] | null
    max_connections: number
    is_restreamer: number
    allowed_ips: string
    allowed_ua: string
    is_trial: number
    created_at: number
    created_by: number
    pair_id: number
    is_mag: number
    is_e2: number
    force_server_id: number
    is_isplock: number
    as_number: string | null
    isp_desc: string
    forced_country: string
    is_stalker: number
    bypass_ua: number
    play_token: string
}