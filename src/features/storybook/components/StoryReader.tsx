import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextPage, prevPage, selectCurrentPage, selectCurrentStory, selectStories } from '../slices/story/Slice';
import { useSoundEffect } from '../../../hooks/useAudio';
import useTextToSpeech from '../../../hooks/useTextToSpeech';
import AudioPlayer from './AudioPlayer';
import './StoryReader.css';

const StoryReader: React.FC = () => {
  const dispatch = useDispatch();
  const currentStory = useSelector(selectCurrentStory);
  const currentPage = useSelector(selectCurrentPage);
  const stories = useSelector(selectStories);
  
  // Text-to-speech hook - must be called unconditionally
  const {
    speak,
    stop,
    availableVoices,
    isSpeaking
  } = useTextToSpeech();
  
  // Sound effects - must be called unconditionally
  const { play: playPageTurn } = useSoundEffect('/audio/page-turn.mp3');
  const { play: playWoosh } = useSoundEffect('/audio/woosh.mp3');

  // Get story data safely
  const story = currentStory ? stories[currentStory] : null;
  const currentPageData = story?.pages?.[currentPage];
  const pageText = currentPageData?.text || '';
  
  // Handle automatic reading when page changes
  useEffect(() => {
    if (!currentPageData) return;
    
    playPageTurn();
    
    // Auto-read the current page when it changes
    const timer = setTimeout(() => {
      if (pageText && availableVoices.length > 0) {
        // Only auto-read if we have voices available
        speak(pageText);
      }
    }, 500); // Slightly longer delay to ensure voices are loaded
    
    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [currentPage, currentPageData, pageText, availableVoices, speak, stop, playPageTurn]);

  // Early return if no story is selected
  if (!currentStory) {
    return <div>Ingen berättelse vald</div>;
  }

  if (!story) {
    return <div>Kunde inte hitta berättelsen</div>;
  }

  if (!currentPageData) {
    return <div>Laddar sida...</div>;
  }

  const handlePrevPage = () => {
    playWoosh();
    dispatch(prevPage());
  };

  const handleNextPage = () => {
    playWoosh();
    dispatch(nextPage());
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isSpeaking) {
      stop();
    } else if (pageText) {
      speak(pageText);
    }
  };

  const handlePlayPause = (playing: boolean) => {
    if (playing) {
      speak(currentPageData?.text || '');
    } else {
      stop();
    }
  };

  const handleStop = () => {
    stop();
  };

  return (
    <div className="story-reader">
      <h2>{story.title}</h2>
      
      {/* Audio Player */}
      <div className="audio-player-container">
        {availableVoices.length > 0 ? (
          <AudioPlayer
            text={pageText}
            isPlaying={isSpeaking}
            onPlayPause={handlePlayPause}
            onStop={handleStop}
            onNext={handleNextPage}
            onPrevious={handlePrevPage}
            hasNext={currentPage < story.pages.length - 1}
            hasPrevious={currentPage > 0}
          />
        ) : (
          <div className="voice-loading">
            <p>Laddar röster... Vänligen vänta.</p>
            <p>Om detta tar för långt, kontrollera att du har röststöd i din webbläsare.</p>
          </div>
        )}
      </div>
      
      <div className="page-navigation">
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="nav-button"
        >
          ⏮️ Föregående sida
        </button>
        <span className="page-indicator"></span>
        <button 
          onClick={handleNextPage}
          disabled={currentPage === story.pages.length - 1}
          className="nav-button"
        >
          Nästa sida ⏭️
        </button>
      </div>
      <div className="page-content">
        <img 
          src={currentPageData.image} 
          alt="" 
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default StoryReader;