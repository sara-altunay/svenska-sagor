import { configureStore } from '@reduxjs/toolkit';
import storyReducer from '../features/storybook/slices/story/Slice';
import { StoryState } from '../features/storybook/types/storyTypes';

// Define the root state type
export interface RootState {
  story: StoryState;
}

// Create the store
export const store = configureStore({
  reducer: {
    story: storyReducer,
  },
});

// Define the app dispatch type
export type AppDispatch = typeof store.dispatch;

export default store;