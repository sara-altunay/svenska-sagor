import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoryState } from '../../types/storyTypes';

export type StorySliceState = StoryState;

// Create a function to generate page objects with image and text
const createPages = (count: number, basePath: string, title: string, isEnglish: boolean = false) => {
  return Array.from({ length: count }, (_, i) => {
    const pageNum = i + 1;
    const pageText = isEnglish 
      ? `${title} - Page ${pageNum}. This is a sample page from the story.`
      : `${title} - Sida ${pageNum}. Detta är en exempelsida från berättelsen.`;
      
    return {
      image: `${basePath}/${pageNum}.png`,
      text: pageText
    };
  });
};

const initialState: StoryState = {
  currentStory: null,
  currentPage: 0,
  stories: {
    hikaye1: {
      title: "Deni i Skogen",
      cover: '/images/covers/1.png',
      pages: createPages(10, '/images/hikaye1', 'Deni i Skogen')
    },
    hikaye2: {
      title: "Tut Tut ! Här Kommer Vi",
      cover: '/images/covers/2.png',
      pages: createPages(11, '/images/hikaye2', 'Tut Tut ! Här Kommer Vi')
    },
    hikaye3: {
      title: "Welcome Autumn",
      cover: '/images/covers/3.png',
      pages: createPages(12, '/images/hikaye3', 'Welcome Autumn', true)
    },
    hikaye4: {
      title: "Meet My Family",
      cover: '/images/covers/4.png',
      pages: createPages(15, '/images/hikaye4', 'Meet My Family', true)
    }
  }
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    addStory: (state, action: PayloadAction<{id: string, title: string, isEnglish: boolean, pageCount: number, cover?: string}>) => {
      const { id, title, isEnglish, pageCount, cover } = action.payload;
      const basePath = `/images/${id}`;
      state.stories[id] = {
        title,
        cover: cover || '/images/covers/default.jpg',
        pages: createPages(pageCount, basePath, title, isEnglish)
      };
    },
    setCurrentStory: (state, action: PayloadAction<string>) => {
      state.currentStory = action.payload;
      state.currentPage = 0;
    },
    nextPage: (state) => {
      if (state.currentStory && state.currentPage < state.stories[state.currentStory].pages.length - 1) {
        state.currentPage += 1;
      }
    },
    prevPage: (state) => {
      if (state.currentPage > 0) {
        state.currentPage -= 1;
      }
    }
  }
});

export const { addStory, setCurrentStory, nextPage, prevPage } = storySlice.actions;
export default storySlice.reducer;

export const selectCurrentStory = (state: { story: StorySliceState }) => state.story.currentStory;
export const selectStories = (state: { story: StorySliceState }) => state.story.stories;
export const selectCurrentPage = (state: { story: StorySliceState }) => state.story.currentPage;