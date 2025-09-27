import React, { useState, useEffect } from 'react';

const SpeechTest: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [status, setStatus] = useState('Ready');
  const [rate, setRate] = useState(1);
  
  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      if (availableVoices.length > 0) {
        const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
        setSelectedVoice(defaultVoice);
      }
      
      setStatus(`Loaded ${availableVoices.length} voices`);
    };

    // Load voices immediately if available
    loadVoices();
    
    // Some browsers require this event to load voices
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setStatus('Resumed speaking');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      'This is a test of the Web Speech API. Hello!' 
    );
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus('Speaking...');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus('Finished speaking');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setStatus(`Error: ${event.error}`);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setStatus('Paused');
  };
  
  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setStatus('Stopped');
  };
  
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceIndex = parseInt(e.target.value, 10);
    setSelectedVoice(voices[voiceIndex]);
  };
  
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(e.target.value));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Web Speech API Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Voice: 
            <select 
              onChange={handleVoiceChange}
              disabled={voices.length === 0}
              style={{ marginLeft: '10px' }}
            >
              {voices.map((voice, index) => (
                <option key={index} value={index}>
                  {voice.name} ({voice.lang}) {voice.default ? ' - DEFAULT' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            Rate: {rate.toFixed(1)}
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={rate} 
              onChange={handleRateChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={speak} 
          disabled={isSpeaking && !isPaused}
          style={{ marginRight: '10px' }}
        >
          {isPaused ? 'Resume' : 'Speak'}
        </button>
        
        <button 
          onClick={pause} 
          disabled={!isSpeaking || isPaused}
          style={{ marginRight: '10px' }}
        >
          Pause
        </button>
        
        <button 
          onClick={stop} 
          disabled={!isSpeaking && !isPaused}
        >
          Stop
        </button>
      </div>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '4px',
        minHeight: '50px'
      }}>
        <strong>Status:</strong> {status}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>If this test doesn't work, please check:</p>
        <ul>
          <li>Your browser supports the Web Speech API (Chrome, Edge, Safari, Firefox)</li>
          <li>Your system has text-to-speech voices installed</li>
          <li>Your browser has permission to use the microphone/speakers</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeechTest;
