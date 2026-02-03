// Fix: Populating the types.ts file with required type definitions.
export type Platform = 'youtube' | 'twitch' | 'kick' | 'm3u8' | 'unknown';

export type TwitchContentType = 'video' | 'clip' | 'channel';

export type YouTubeContentType = 'live_channel' | 'video';

export interface Stream {
  id: string;
  originalUrl: string;
  platform: Platform;
  videoId: string;
  twitchContentType?: TwitchContentType;
  youtubeContentType?: YouTubeContentType;
}
