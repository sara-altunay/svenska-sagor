import { useState, useEffect, useCallback } from 'react';

export const useAudio = (url: string) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);
  const play = () => setPlaying(true);
  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
  };

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  return { playing, play, stop, toggle };
};

export const useSoundEffect = (url: string) => {
  const [audio] = useState(() => {
    // Use process.env.PUBLIC_URL for the base URL in development and production
    const audioUrl = `${process.env.PUBLIC_URL}${url}`;
    console.log('Creating audio element with URL:', audioUrl);
    const audio = new Audio(audioUrl);
    audio.preload = 'auto';
    audio.load();
    return audio;
  });
  
  const play = useCallback(() => {
    try {
      console.log(`Attempting to play audio from: ${process.env.PUBLIC_URL}${url}`);
      audio.currentTime = 0;
      audio.play().catch(e => {
        console.error('Audio playback failed:', e);
        console.log('Audio element state:', {
          src: audio.src,
          error: audio.error,
          networkState: audio.networkState,
          readyState: audio.readyState,
        });
      });
    } catch (error) {
      console.error('Error in play function:', error);
    }
  }, [audio, url]);

  // Log when the audio is loaded
  useEffect(() => {
    const handleCanPlay = () => {
      console.log(`Audio loaded successfully: ${url}`);
    };

    const handleError = (e: Event) => {
      console.error(`Error loading audio (${url}):`, audio.error);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audio, url]);

  return { play };
};
