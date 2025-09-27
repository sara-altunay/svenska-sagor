import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  isSpeechSynthesisSupported, 
  getVoices, 
  speak as speakUtil, 
  pauseSpeech, 
  resumeSpeech, 
  stopSpeech, 
  isSpeaking as isSpeakingUtil,
  isPaused as isPausedUtil
} from '../utils/speechUtils';

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceLoadAttempts = useRef(0);
  const MAX_VOICE_ATTEMPTS = 5;
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Initialize speech synthesis
  useEffect(() => {
    console.log('Initializing speech synthesis...');
    
    if (!isSupported) {
      console.error('Speech synthesis not supported in this browser');
      setIsLoading(false);
      return;
    }

    const loadVoices = async () => {
      try {
        const voices = await getVoices();
        console.log('Available voices:', voices);
        
        if (voices.length === 0) {
          console.error('No voices found on the system');
          setIsLoading(false);
          return;
        }

        setAvailableVoices(voices);
        
        // Try to find a voice matching the current language or fallback to English
        const lang = document.documentElement.lang || 'sv';
        const langPrefix = lang.split('-')[0];
        
        const matchingVoice = voices.find(voice => 
          voice.lang.startsWith(langPrefix) ||
          voice.lang.startsWith('en') ||
          voice.lang.startsWith('sv')
        );
        
        if (matchingVoice) {
          console.log('Selected voice:', matchingVoice);
          setSelectedVoice(matchingVoice);
        } else if (voices.length > 0) {
          console.log('Using first available voice:', voices[0]);
          setSelectedVoice(voices[0]);
        }
      
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading voices:', error);
        setIsLoading(false);
      }
    };
    
    loadVoices();
    
    return () => {
      stopSpeech();
    };
  }, []);

  // Speak the given text
  const speak = useCallback((text: string) => {
    console.log('Attempting to speak text:', text);
    
    if (!selectedVoice) {
      console.error('No voice selected. Available voices:', availableVoices);
      return false;
    }

    try {
      speakUtil(text, {
        voice: selectedVoice,
        rate,
        pitch,
        volume,
        onEnd: () => setIsSpeaking(false),
        onError: (event) => {
          console.error('SpeechSynthesis error:', event);
          setIsSpeaking(false);
        }
      });
      
      setIsSpeaking(true);
      console.log('Speaking with voice:', selectedVoice.name, 'lang:', selectedVoice.lang);
      return true;
    } catch (error) {
      console.error('Error in speak function:', error);
      setIsSpeaking(false);
      return false;
    }
  }, [selectedVoice, rate, pitch, volume, availableVoices]);

  // Stop speaking
  const stop = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
  }, []);

  // Pause speaking
  const pause = useCallback(() => {
    pauseSpeech();
    setIsSpeaking(false);
  }, []);

  // Resume speaking
  const resume = useCallback(() => {
    resumeSpeech();
    setIsSpeaking(true);
  }, []);

  return {
    isSpeaking,
    isLoading,
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    speak,
    stop,
    pause,
    resume,
    isSupported,
  };
};

// Export the hook as default
export default useTextToSpeech;
