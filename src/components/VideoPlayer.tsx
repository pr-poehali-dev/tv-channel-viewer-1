import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onQualityChange?: (quality: string) => void;
}

export default function VideoPlayer({ src, poster, onQualityChange }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      poster: poster,
      html5: {
        vhs: {
          overrideNative: true,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
    });

    playerRef.current = player;

    player.src({
      src: src,
      type: 'application/x-mpegURL',
    });

    const qualityLevels = player.qualityLevels();
    qualityLevels.on('addqualitylevel', () => {
      if (onQualityChange) {
        const currentQuality = qualityLevels[qualityLevels.selectedIndex];
        if (currentQuality) {
          onQualityChange(currentQuality.height >= 720 ? 'HD' : 'SD');
        }
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, onQualityChange]);

  return (
    <div data-vjs-player className="w-full h-full">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-theme-fantasy"
      />
    </div>
  );
}
