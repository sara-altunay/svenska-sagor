// Utility functions for Web Speech API

export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

export const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      return resolve(voices);
    }
    
    // If voices aren't loaded yet, wait for the voiceschanged event
    window.speechSynthesis.onvoiceschanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      resolve(availableVoices);
    };
    
    // Fallback in case voiceschanged doesn't fire
    setTimeout(() => {
      const availableVoices = window.speechSynthesis.getVoices();
      resolve(availableVoices);
    }, 1000);
  });
};

export const speak = (text: string, options: {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: (event: SpeechSynthesisErrorEvent) => void;
} = {}): void => {
  if (!isSpeechSynthesisSupported()) {
    console.error('Web Speech API is not supported in this browser');
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  if (options.voice) {
    utterance.voice = options.voice;
  }
  
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;
  
  if (options.onEnd) {
    utterance.onend = options.onEnd;
  }
  
  if (options.onError) {
    utterance.onerror = options.onError;
  }
  
  window.speechSynthesis.speak(utterance);
};

export const pauseSpeech = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeech = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.resume();
  }
};

export const stopSpeech = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = (): boolean => {
  return isSpeechSynthesisSupported() && window.speechSynthesis.speaking;
};

export const isPaused = (): boolean => {
  return isSpeechSynthesisSupported() && window.speechSynthesis.paused;
};
