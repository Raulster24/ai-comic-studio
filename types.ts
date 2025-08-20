
export type Genre = "Superhero" | "Sci-Fi" | "Fantasy" | "Horror" | "Romance" | "Comedy" | "Slice of Life";
export type ArtStyle = "Classic American Comics" | "Manga/Anime" | "European Graphic Novel" | "Cartoon/Animated" | "Noir/Monochrome" | "Indie Comics";
export type PanelLayout = "2-panel strip" | "4-panel grid" | "6-panel page" | "Full splash page";

export interface StoryFormData {
  storyPrompt: string;
  genre: Genre;
  artStyle: ArtStyle;
  panelLayout: PanelLayout;
  protagonist: string;
  antagonist: string;
  supportingChars: string;
  setting: string;
}

export interface PanelData {
  panel: number;
  description: string;
  imagePrompt: string;
  dialogue?: {
    character: string;
    speech: string;
  }[];
  caption?: string;
  soundEffect?: string;
}

export interface ComicScript {
  title: string;
  panels: PanelData[];
}

export interface ComicPanel extends PanelData {
    imageUrl: string | null;
    isLoading: boolean;
}
