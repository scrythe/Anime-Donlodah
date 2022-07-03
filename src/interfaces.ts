export interface Episode {
  name: string;
  url: string;
}

export interface Season {
  url: string;
  name: string;
}

export interface Episode {
  url: string;
  name: string;
}

export type AllEpisodes = {
  url: string;
  name: string;
  episodes: Episode[];
}[];
