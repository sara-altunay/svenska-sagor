import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddBookButton from './components/AddBookButton';
import StoryReader from './features/storybook/components/StoryReader';
import { selectCurrentStory, selectStories, setCurrentStory } from './features/storybook/slices/story/Slice';
import { useSoundEffect } from './hooks/useAudio';
import SoundControls from './components/SoundControls';
import SpeechTest from './components/SpeechTest';
import './App.css';

// Decorative elements for the background
const Decorations = () => (
  <>
    <div className="decoration cloud1">☁️</div>
    <div className="decoration cloud2">☁️</div>
    <div className="decoration cloud3">☁️</div>
    <div className="decoration star1">⭐</div>
    <div className="decoration star2">✨</div>
    <div className="decoration star3">🌟</div>
  </>
);

function App() {
  const currentStory = useSelector(selectCurrentStory);
  const stories = useSelector(selectStories);
  const { play: playPageTurn } = useSoundEffect('/assets/audio/page-turn.mp3');
  const { play: playButtonClick } = useSoundEffect('/assets/audio/button-click.mp3');
  
  const handleStorySelect = (id: string) => {
    playButtonClick();
    import('./app/store').then(({ store }) => {
      store.dispatch(setCurrentStory(id));
      playPageTurn();
    });
  };

  if (currentStory) {
    return <StoryReader />;
  }

  // Removed development-only SpeechTest to always show book selection

  return (
    <div className="App">
      <SoundControls />
      <header className="App-header">
        <div className="header-content">
          <h1>
            <span className="title-icon">📚</span>
            Barnböcker
            <span className="title-icon">🎨</span>
          </h1>
          <p className="subtitle">Välj en berättelse att läsa!</p>
          
          <AddBookButton />
          <div className="story-list">
            {Object.entries(stories).map(([id, story]) => {
              // Determine emoji based on story ID
              let emoji = '📖'; // Default emoji
              if (id === 'hikaye1') emoji = '🌲'; // Deni i Skogen (forest theme)
              else if (id === 'hikaye2') emoji = '🚂'; // Tut Tut ! Här Kommer Vi (train theme)
              else if (id === 'hikaye3') emoji = '🍂'; // Welcome Autumn (autumn leaves)
              else if (id === 'hikaye4') emoji = '👨‍👩‍👧‍👦'; // Meet My Family (family theme)
              
              // All stories are by Sara Altunay
              const author = `Av: Sara Altunay`;
              
              return (
                <div key={id} className="story-card">
                  {(id === 'hikaye3' || id === 'hikaye4') && (
                    <span className="language-tag">EN</span>
                  )}
                  <div className="story-cover">
                    <img 
                      src={story.cover} 
                      alt={story.title}
                      onError={(e) => {
                        // If image fails to load, show the emoji instead
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const emojiSpan = document.createElement('span');
                        emojiSpan.className = 'story-emoji';
                        emojiSpan.textContent = emoji;
                        target.parentNode?.appendChild(emojiSpan);
                      }}
                    />
                    <span className="story-emoji" style={{ display: 'none' }}>
                      {emoji}
                    </span>
                  </div>
                  <div className="story-content">
                    <h2>{story.title}</h2>
                    <p className="author">{author}</p>
                    <button 
                      className="read-button"
                      onClick={() => handleStorySelect(id)}
                    >
                      {id.startsWith('hikaye3') || id.startsWith('hikaye4') ? 'Read Story' : 'Läs Berättelsen'}
                      <span className="button-arrow">→</span>
                    </button>
                  </div>
              </div>
            )})}
          </div>
          
          <div className="footer">
            <p>👶 Läs för ditt barn varje dag! 👧👦</p>
          </div>
        </div>
        
        <Decorations />
      </header>
    </div>
  );
}

export default App;