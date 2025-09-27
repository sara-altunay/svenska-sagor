import React, { useState, useEffect, useRef } from 'react';
import { useSoundEffect } from '../hooks/useAudio';

const SoundControls: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Sound effects
  const { play: playButtonClick } = useSoundEffect('/audio/button-click.mp3');
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/audio/background-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    // Try to play the audio when component mounts
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Toggle mute state
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      playButtonClick();
    }
  };
  
  return (
    <button 
      className={`sound-button ${isMuted ? 'muted' : ''}`}
      onClick={toggleMute}
      aria-label={isMuted ? 'Ljud på' : 'Ljud av'}
      title={isMuted ? 'Ljud på' : 'Ljud av'}
    >
      {isMuted ? '🔇' : '🔊'}
    </button>
  );
};

export default SoundControls;
