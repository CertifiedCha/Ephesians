import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  Volume2,
  VolumeX,
  ListMusic,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

// Define the expanded playlist with new songs and reordering
const playlist = [
  { title: 'Safe Haven', artist: 'Ruth B', url: '/music/Safe.mp3' },
  { title: 'Danza Kuduro', artist: 'Don Omar ft. Lucenzo', url: '/music/Danza.mp3' }, // New song at ID 1
  { title: 'Take Me Home, Country Roads', artist: 'John Denver', url: '/music/Take.mp3' }, // New song at ID 2
  { title: 'Sailor Song', artist: 'Gigi Perez', url: '/music/Sailor-Song.mp3' },
  { title: 'Remember When', artist: 'Alan Jackson', url: '/music/Remember-When.mp3' },
  { title: 'Chattahoochee', artist: 'Alan Jackson', url: '/music/Chattahoochee.mp3' },
  { title: 'Multo (Live at The Cozy Cove)', artist: 'Cup of Joe', url: '/music/Multo.mp3' },
  { title: 'Passenger Seat', artist: 'Stephen Speaks', url: '/music/Passenger.mp3' },
  { title: 'Paraluman', artist: 'Adie', url: '/music/Paraluman.mp3' },
  { title: 'Make You Mine', artist: 'PUBLIC', url: '/music/PUBLIC.mp3' },
  { title: 'The Only Exception', artist: 'Paramore', url: '/music/Paramore.mp3' },
  { title: 'The Man Who Can\'t Be Moved', artist: 'The Script', url: '/music/The-Script.mp3' },
  { title: 'blue', artist: 'yung kai', url: '/music/blue.mp3' },
  { title: 'Leonora', artist: 'SUGARCANE feat. Leonora', url: '/music/SUGARCANE.mp3' },
  { title: 'Misteryoso', artist: 'Cup of Joe', url: '/music/Misteryoso.mp3' },
];

const SONGS_PER_PAGE = 5;

export const MusicPlayer = memo(() => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [prevVolume, setPrevVolume] = useState(50);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = playlist[currentTrackIndex];

  // Memoized callback functions for audio controls
  const handleNextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    setIsPlaying(true);
  }, []);

  const handlePrevTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  }, []);

  const handleSelectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowPlaylist(false);
  }, []);

  const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const handleMuteToggle = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        setVolume(prevVolume);
      } else {
        audioRef.current.muted = true;
        setPrevVolume(volume);
        setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted, volume, prevVolume]);

  const togglePlayPause = () => setIsPlaying((p) => !p);

  // This effect handles track changes and initialization.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('loadedmetadata', () => {});
      audioRef.current.removeEventListener('timeupdate', () => {});
      audioRef.current.removeEventListener('ended', () => {});
    }

    const newAudio = new Audio(currentTrack.url);
    audioRef.current = newAudio;

    const handleLoadedMetadata = () => {
      setDuration(newAudio.duration || 0);
      if (isPlaying) {
        newAudio.play().catch(console.error);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(newAudio.currentTime || 0);
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    newAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
    newAudio.addEventListener('timeupdate', handleTimeUpdate);
    newAudio.addEventListener('ended', handleEnded);

    return () => {
      newAudio.pause();
      newAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      newAudio.removeEventListener('timeupdate', handleTimeUpdate);
      newAudio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, handleNextTrack, isPlaying, currentTrack]);

  // This effect handles play/pause state changes.
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // This effect handles volume/mute state changes.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Automatically update the current page when the track changes
  useEffect(() => {
    setCurrentPage(Math.floor(currentTrackIndex / SONGS_PER_PAGE));
  }, [currentTrackIndex]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const totalPages = Math.ceil(playlist.length / SONGS_PER_PAGE);
  const startIndex = currentPage * SONGS_PER_PAGE;
  const endIndex = startIndex + SONGS_PER_PAGE;
  const currentPlaylistPage = playlist.slice(startIndex, endIndex);

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-[9999] bg-background/80 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-border/50 w-80"
      initial={{ opacity: 0, scale: 0.8, x: 50, y: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={{ type: 'spring', duration: 0.8, delay: 1 }}
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div
            key="minimized"
            className="flex items-center justify-between"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2 w-full">
              <Button onClick={togglePlayPause} variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isPlaying ? 'pause' : 'play'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
              <div className="text-sm font-semibold truncate flex-1">
                {currentTrack.title}
              </div>
            </div>
            <Button onClick={() => setIsMinimized(false)} variant="ghost" size="icon" className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <motion.div
                  className="text-sm font-semibold truncate"
                  key={currentTrack.title}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {currentTrack.title}
                </motion.div>
                <motion.div
                  className="text-xs text-muted-foreground truncate"
                  key={currentTrack.artist}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {currentTrack.artist}
                </motion.div>
              </div>
              <Button onClick={() => setIsMinimized(true)} variant="ghost" size="icon" className="h-8 w-8">
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2 mt-4">
              <Button onClick={handlePrevTrack} variant="ghost" size="icon" className="h-8 w-8">
                <Rewind className="h-4 w-4" />
              </Button>
              <Button onClick={togglePlayPause} variant="secondary" size="icon" className="h-10 w-10 rounded-full shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isPlaying ? 'pause' : 'play'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
              <Button onClick={handleNextTrack} variant="ghost" size="icon" className="h-8 w-8">
                <FastForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2">
              <input
                type="range"
                value={currentTime}
                max={isNaN(duration) ? 0 : duration}
                step={1}
                onChange={handleSliderChange}
                className="w-full h-1 appearance-none bg-primary/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
              />
              <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center space-x-2 w-1/2">
                <Button onClick={handleMuteToggle} variant="ghost" size="icon" className="h-8 w-8">
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <input
                  type="range"
                  value={isMuted ? 0 : volume}
                  max={100}
                  step={1}
                  onChange={handleVolumeChange}
                  className="w-full h-1 appearance-none bg-primary/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
                />
              </div>
              <Button onClick={() => setShowPlaylist(!showPlaylist)} variant="ghost" size="sm" className="space-x-2">
                <ListMusic className="h-4 w-4" />
                <span className="hidden md:inline">Playlist</span>
                <motion.div animate={{ rotate: showPlaylist ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </div>

            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ul className="space-y-2">
                    {currentPlaylistPage.map((track, index) => (
                      <li
                        key={track.url}
                        onClick={() => handleSelectTrack(startIndex + index)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          startIndex + index === currentTrackIndex ? 'bg-primary/10 font-semibold' : 'hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="min-w-0">
                            <div className="text-sm truncate">
                              {startIndex + index === currentTrackIndex && (
                                <span className="text-primary mr-2">
                                  <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                  >
                                    ▶
                                  </motion.span>
                                </span>
                              )}
                              {track.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                          </div>
                          {startIndex + index === currentTrackIndex && (
                            <span className="text-xs text-muted-foreground">Now Playing</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      variant="ghost"
                      size="icon"
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      variant="ghost"
                      size="icon"
                      disabled={currentPage >= totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});