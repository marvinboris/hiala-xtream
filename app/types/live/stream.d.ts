export default interface LiveStreamType {
    num: number
    name: string
    stream_type: string
    stream_id: number
    stream_icon: string
    epg_channel_id?: number | null
    added: string
    category_id: string
    custom_sid: string
    tv_archive: number
    direct_source: string
    tv_archive_duration: number
}