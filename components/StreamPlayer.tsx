import React from 'react';
import { getEmbedUrl } from '../services/streamService';
import { TrashIcon } from './icons/TrashIcon';
import type { Stream } from '../types';
import HlsPlayer from './HlsPlayer'; // Import the new HlsPlayer component

interface StreamPlayerProps {
    stream: Stream;
    onRemove: (id: string) => void;
}

export const StreamPlayer: React.FC<StreamPlayerProps> = ({ stream, onRemove }) => {
    const embedUrl = getEmbedUrl(stream.platform, stream.videoId, stream.twitchContentType, stream.youtubeContentType);

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(stream.id);
    };

    const getDisplayInfoText = () => {
        if (stream.platform === 'youtube') {
            switch (stream.youtubeContentType) {
                case 'live_channel':
                    return `YT Live: ${stream.videoId}`;
                case 'video':
                default:
                    return 'View on YouTube';
            }
        }

        if (stream.platform === 'kick') {
            return `kick.com/${stream.videoId}`;
        }

        if (stream.platform === 'twitch') {
            switch (stream.twitchContentType) {
                case 'video':
                    return 'Twitch VOD';
                case 'clip':
                    return 'Twitch Clip';
                case 'channel':
                default:
                    return `twitch.tv/${stream.videoId}`;
            }
        }

        if (stream.platform === 'm3u8') {
            return 'M3U8 Stream';
        }

        return 'View Source';
    };

    return (
        <div className="group relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-xl overflow-hidden border border-gray-700/50
                        transition-all duration-500 ease-out hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 animate-stream-enter
                        backdrop-blur-sm">
            {embedUrl ? (
                stream.platform === 'm3u8' ? (
                    <HlsPlayer src={embedUrl} />
                ) : (
                    <iframe
                        src={embedUrl}
                        title={`${stream.platform} stream player for ${stream.videoId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full rounded-xl"
                    ></iframe>
                )
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-center p-6 rounded-xl">
                    <div className="space-y-3">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-red-400 text-2xl">⚠</span>
                        </div>
                        <p className="text-red-400 font-medium">No se pude generar la URL de inserción</p>
                        <p className="text-gray-500 text-sm">Por favor, comprueba la URL de la transmisión.</p>
                    </div>
                </div>
            )}
            
            {/* Centered Remove Button */}
            <button
                onClick={handleRemove}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 hover:bg-red-500 text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 transform hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100 z-10 flex items-center justify-center"
                aria-label={`Remove stream ${stream.videoId}`}
            >
                <TrashIcon />
            </button>
            
            {/* Platform Badge - Small and unobtrusive */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                    stream.platform === 'youtube' 
                        ? 'bg-red-500/90 text-white' 
                        : stream.platform === 'kick'
                        ? 'bg-green-500/90 text-white'
                        : stream.platform === 'm3u8'
                        ? 'bg-blue-500/90 text-white'
                        : 'bg-purple-500/90 text-white'
                } backdrop-blur-md shadow-lg`}>
                    {stream.platform.toUpperCase()}
                </div>
            </div>
        </div>
    );
};