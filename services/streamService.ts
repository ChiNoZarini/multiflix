import type { Platform, TwitchContentType, YouTubeContentType } from '../types';

interface ParsedUrl {
    platform: Platform;
    videoId: string | null;
    twitchContentType?: TwitchContentType;
    youtubeContentType?: YouTubeContentType;
}

export const parseStreamUrl = (url: string): ParsedUrl => {
    // YouTube Live Channel: e.g., https://www.youtube.com/channel/CHANNEL_ID/live
    // This is the only reliable format for embedding live streams via channel ID.
    // The regex is now stricter and does NOT match @handle URLs.
    const youtubeLiveRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([a-zA-Z0-9_-]+)(?:\/live)?/;
    const youtubeLiveMatch = url.match(youtubeLiveRegex);
    if (youtubeLiveMatch && youtubeLiveMatch[1]) {
        return { platform: 'youtube', videoId: youtubeLiveMatch[1], youtubeContentType: 'live_channel' };
    }

    // YouTube Video: e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...
    const youtubeVideoRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([\w-]+)/;
    const youtubeVideoMatch = url.match(youtubeVideoRegex);
    if (youtubeVideoMatch && youtubeVideoMatch[1]) {
        return { platform: 'youtube', videoId: youtubeVideoMatch[1], youtubeContentType: 'video' };
    }

    // Twitch VOD: e.g., https://www.twitch.tv/videos/1234567
    const twitchVideoRegex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\d+)/;
    const twitchVideoMatch = url.match(twitchVideoRegex);
    if (twitchVideoMatch && twitchVideoMatch[1]) {
        return { platform: 'twitch', videoId: twitchVideoMatch[1], twitchContentType: 'video' };
    }

    // Twitch Clip (long URL): e.g., https://www.twitch.tv/ninja/clip/PowerfulSpikyDingo...
    const twitchClipRegex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/(?:[a-zA-Z0-9_]+)\/clip\/([a-zA-Z0-9_-]+)/;
    const twitchClipMatch = url.match(twitchClipRegex);
    if (twitchClipMatch && twitchClipMatch[1]) {
        return { platform: 'twitch', videoId: twitchClipMatch[1], twitchContentType: 'clip' };
    }

    // Twitch Clip (short URL): e.g., https://clips.twitch.tv/PowerfulSpikyDingo...
    const twitchShortClipRegex = /(?:https?:\/\/)?clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/;
    const twitchShortClipMatch = url.match(twitchShortClipRegex);
    if (twitchShortClipMatch && twitchShortClipMatch[1]) {
        return { platform: 'twitch', videoId: twitchShortClipMatch[1], twitchContentType: 'clip' };
    }

    // Twitch Channel: e.g., https://www.twitch.tv/shroud (must be last)
    const twitchChannelRegex = /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)\/?$/;
    const twitchChannelMatch = url.match(twitchChannelRegex);
    if (twitchChannelMatch && twitchChannelMatch[1]) {
        const reservedPaths = ['videos', 'clips', 'directory', 'p', 'settings', 'about', 'brand'];
        if (!reservedPaths.includes(twitchChannelMatch[1].toLowerCase())) {
            return { platform: 'twitch', videoId: twitchChannelMatch[1], twitchContentType: 'channel' };
        }
    }

    // Kick Channel: e.g., https://kick.com/xqc
    const kickChannelRegex = /(?:https?:\/\/)?(?:www\.)?kick\.com\/([a-zA-Z0-9_]+)\/?$/;
    const kickChannelMatch = url.match(kickChannelRegex);
    if (kickChannelMatch && kickChannelMatch[1]) {
        return { platform: 'kick', videoId: kickChannelMatch[1] };
    }

    // M3U8 Stream: e.g., https://example.com/stream.m3u8
    const m3u8Regex = /\.m3u8/i;
    if (m3u8Regex.test(url)) {
        return { platform: 'm3u8', videoId: url };
    }
    
    return { platform: 'unknown', videoId: null };
};

export const getEmbedUrl = (
    platform: Platform, 
    videoId: string, 
    twitchContentType?: TwitchContentType,
    youtubeContentType?: YouTubeContentType
): string => {
    if (platform === 'youtube') {
        const commonParams = 'autoplay=1&mute=1&playsinline=1&rel=0';
        if (youtubeContentType === 'live_channel') {
            return `https://www.youtube.com/embed/live_stream?channel=${videoId}&${commonParams}`;
        }
        return `https://www.youtube.com/embed/${videoId}?${commonParams}`;
    }

    if (platform === 'twitch') {
        // Dynamically detect the parent domain to work in both development and production
        const parent = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

        switch (twitchContentType) {
            case 'video':
                return `https://player.twitch.tv/?video=${videoId}&parent=${parent}&autoplay=true&muted=false&time=0s`;
            case 'clip':
                return `https://clips.twitch.tv/embed?clip=${videoId}&parent=${parent}&autoplay=true&muted=false`;
            case 'channel':
            default:
                return `https://player.twitch.tv/?channel=${videoId}&parent=${parent}&autoplay=true&muted=false`;
        }
    }

    if (platform === 'kick') {
        return `https://player.kick.com/${videoId}?autoplay=true&muted=false`;
    }

    if (platform === 'm3u8') {
        return videoId; // The videoId is the full .m3u8 URL
    }

    return '';
};