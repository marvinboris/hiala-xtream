export default interface StreamType {
    id: number
    type: number
    category_id: number
    stream_display_name: string
    stream_source: string[]
    stream_icon: string
    notes: string
    created_channel_location: string | null
    enable_transcode: number
    transcode_attributes: string
    custom_ffmpeg: string
    movie_propeties: {
        actors: string
        cover_big: string
        genre: string
        releasedate: string
        plot: string
        movie_image: string
        duration_secs: number
    }
    movie_subtitles: string
    read_native: number
    target_container: string[]
    stream_all: number
    remove_subtitles: number
    custom_sid: string
    epg_id: number | null
    channel_id: number | null
    epg_lang: string | null
    order: number
    auto_restart: string
    transcode_profile_id: number
    pids_create_channel: string
    cchannel_rsoures: string
    gen_timestamps: number
    added: number
    series_no: number
    direct_source: number
    tv_archive_duration: number
    tv_archive_server_id: number
    tv_archive_pid: number
    redirect_stream: number
    rtmp_output: number
    number: number
    allow_record: number
    probesize_ondemand: number
    custom_map: string
    external_push: string
    delay_minutes: number
    slug: string
    encoding?: string
}