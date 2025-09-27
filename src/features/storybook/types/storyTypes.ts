export interface PageContent {
  image: string;
  text: string;
}

export interface Story {
  title: string;
  cover: string;
  pages: PageContent[];
}

export interface StoryState {
  currentStory: string | null;
  currentPage: number;
  stories: {
    [key: string]: Story;
  };
}
