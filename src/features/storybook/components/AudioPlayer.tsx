import React, { useEffect, useState } from 'react';
import useTextToSpeech from '../../../hooks/useTextToSpeech';
import './AudioPlayer.css';

interface AudioPlayerProps {
  text: string;
  isPlaying: boolean;
  onPlayPause: (isPlaying: boolean) => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  isPlaying,
  onPlayPause,
  onStop,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}) => {
  // State for voice selection
  const [currentText, setCurrentText] = useState(text);
  const [filteredVoices, setFilteredVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  
  // Text-to-speech hook
  const {
    isSpeaking,
    isLoading,
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    speak,
    stop,
    pause,
    isSupported,
  } = useTextToSpeech();

  // Update current text when prop changes
  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying && !isSpeaking) {
      speak(currentText);
    } else if (!isPlaying && isSpeaking) {
      pause();
    }
  }, [isPlaying, isSpeaking, currentText, speak, pause]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Filter voices and handle voice selection
  useEffect(() => {
    if (!isSupported || isLoading) return;
    
    if (!availableVoices.length) {
      console.warn('No voices available');
      setFilteredVoices([]);
      setShowVoiceSelector(false);
      return;
    }
    
    // Define the function inside the effect to avoid dependency issues
    const filterAndSetVoices = () => {
      const lang = document.documentElement.lang || 'sv';
      const langPrefix = lang.split('-')[0];
      
      const filtered = availableVoices.filter(voice => 
        voice.lang.startsWith(langPrefix) || 
        voice.lang.startsWith('en') ||
        voice.lang.startsWith('sv')
      );
      
      setFilteredVoices(filtered);
      setShowVoiceSelector(filtered.length > 1);
      
      if ((!selectedVoice || !filtered.includes(selectedVoice)) && filtered.length > 0) {
        const exactMatch = filtered.find(v => v.lang.startsWith(langPrefix));
        const voiceToSelect = exactMatch || filtered[0];
        console.log('Auto-selecting voice:', voiceToSelect);
        setSelectedVoice(voiceToSelect);
      }
    };
    
    filterAndSetVoices();
  }, [availableVoices, isSupported, isLoading, selectedVoice, setSelectedVoice]);

  if (!isSupported) {
    return (
      <div className="audio-player unsupported">
        <p>Text-till-tal stöds inte i din webbläsare. Prova med Chrome, Edge eller Safari.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="audio-player loading">
        <p>Laddar röststöd...</p>
      </div>
    );
  }

  // Debug info
  console.log('AudioPlayer render:', {
    isSpeaking,
    selectedVoice: selectedVoice?.name,
    availableVoices: availableVoices.map((v: SpeechSynthesisVoice) => v.name)
  });

  return (
    <div className="audio-player">
      <div className="audio-controls">
        <button 
          onClick={onStop} 
          aria-label="Stop"
          className="control-button stop"
          title="Stop"
        >
          ⏹️
        </button>
        <button 
          onClick={() => onPlayPause(!isPlaying)} 
          aria-label={isPlaying ? "Pause" : "Play"}
          className="control-button play-pause"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button 
          onClick={onPrevious} 
          disabled={!hasPrevious}
          aria-label="Previous page"
          className="control-button"
          title="Previous page"
        >
          ⏮️
        </button>
        <button 
          onClick={onNext} 
          disabled={!hasNext}
          aria-label="Next page"
          className="control-button"
          title="Next page"
        >
          ⏭️
        </button>
      </div>

      <div className="audio-settings">
        {showVoiceSelector && filteredVoices.length > 0 && (
          <div className="setting-group">
            <label htmlFor="voice-select">Röst:</label>
            <select
              id="voice-select"
              value={selectedVoice ? selectedVoice.voiceURI : ''}
              onChange={(e) => {
                const voice = filteredVoices.find(v => v.voiceURI === e.target.value);
                if (voice) setSelectedVoice(voice);
              }}
              disabled={isSpeaking}
              className="voice-select"
            >
              {filteredVoices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {`${voice.name} (${voice.lang})`}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="setting-group">
          <label htmlFor="rate">Hastighet: {rate.toFixed(1)}x</label>
          <input
            id="rate"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            disabled={isSpeaking}
            className="rate-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
