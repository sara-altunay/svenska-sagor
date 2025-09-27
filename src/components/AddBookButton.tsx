import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStory } from '../features/storybook/slices/story/Slice';
import { useSoundEffect } from '../hooks/useAudio';

const AddBookButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [pageCount, setPageCount] = useState(10);
  const [isEnglish, setIsEnglish] = useState(false);
  const dispatch = useDispatch();
  const { play: playButtonClick } = useSoundEffect('/assets/audio/button-click.mp3');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playButtonClick();
    
    // Generate a simple ID from the title
    const id = 'book_' + Date.now();
    
    dispatch(addStory({
      id,
      title: bookTitle,
      isEnglish,
      pageCount: Number(pageCount)
    }));
    
    // Reset form and close modal
    setBookTitle('');
    setPageCount(10);
    setIsModalOpen(false);
  };

  return (
    <>
      <button 
        className="add-book-button"
        onClick={() => {
          playButtonClick();
          setIsModalOpen(true);
        }}
      >
        + Lägg till bok
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Lägg till ny bok</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titel:</label>
                <input 
                  type="text" 
                  value={bookTitle} 
                  onChange={(e) => setBookTitle(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Antal sidor:</label>
                <input 
                  type="number" 
                  min="1" 
                  value={pageCount} 
                  onChange={(e) => setPageCount(Number(e.target.value))} 
                  required 
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    checked={isEnglish} 
                    onChange={(e) => setIsEnglish(e.target.checked)} 
                  />
                  Engelsk bok
                </label>
              </div>
              <div className="button-group">
                <button type="submit" className="submit-button">Spara</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    playButtonClick();
                    setIsModalOpen(false);
                  }}
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .add-book-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin: 20px 0;
          transition: background-color 0.3s;
        }
        .add-book-button:hover {
          background-color: #45a049;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        .form-group input[type="text"],
        .form-group input[type="number"] {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .checkbox {
          display: flex;
          align-items: center;
        }
        .checkbox input {
          margin-right: 0.5rem;
        }
        .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .submit-button, .cancel-button {
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }
        .submit-button {
          background-color: #4CAF50;
          color: white;
        }
        .submit-button:hover {
          background-color: #45a049;
        }
        .cancel-button {
          background-color: #f44336;
          color: white;
        }
        .cancel-button:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </>
  );
};

export default AddBookButton;
