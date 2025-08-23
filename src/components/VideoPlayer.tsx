import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from './ui/button';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  title: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ videoUrl, thumbnail, title, autoPlay = false }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Extract video ID from various video URL formats
  const getVideoId = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('youtube.com/watch?v=')[1].split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('vimeo.com/')) {
      return url.split('vimeo.com/')[1].split('?')[0];
    }
    return null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = getVideoId(url);
    if (!videoId) return url;

    if (url.includes('youtube')) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0`;
    }
    if (url.includes('vimeo')) {
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoPlay ? 1 : 0}`;
    }
    return url;
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const isValidVideoUrl = (url: string) => {
    return url.includes('youtube') || url.includes('vimeo') || url.includes('.mp4') || url.includes('.webm');
  };

  if (!isValidVideoUrl(videoUrl)) {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-white">
          <Play className="w-12 h-12 mx-auto mb-2 opacity-70" />
          <p className="text-sm opacity-70">Video format not supported</p>
        </div>
      </div>
    );
  }

  if (!isPlaying && thumbnail) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer" onClick={handlePlay}>
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-200">
            <Play className="w-6 h-6 text-gray-900 ml-1" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="bg-black/70 px-2 py-1 rounded text-sm">
            Click to play
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden">
      <iframe
        src={getEmbedUrl(videoUrl)}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}