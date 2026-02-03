import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
    src: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let hls: Hls | null = null;

        if (videoRef.current) {
            const video = videoRef.current;

            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => {
                        console.log('Autoplay was prevented.');
                    });
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari and other browsers that support HLS natively
                video.src = src;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(() => {
                        console.log('Autoplay was prevented.');
                    });
                });
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]);

    return (
        <video 
            ref={videoRef} 
            controls 
            muted 
            width="100%" 
            height="100%" 
            className="rounded-xl"
        />
    );
};

export default HlsPlayer;
