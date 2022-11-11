export interface IMovie {
  id: string;
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
  Director: string;
  Actors: string;
  Genre: string;
  Plot: string;
}
export interface IJob {
  id: string;
  title: string;
  description: string;
  url: string;
  updated: string;
  website: string;
  image: string;
}

export interface IQueryParams {
  keyword?: string;
}
export interface IResultsState {
  results: IMovie[];
  paginatedResults: IMovie[];
  recommendedListing: IMovie[];
  keyword: string;
  loading: boolean;
  errorMessage: string | null;
  selectedItem: IMovie | null;
  perPage: number;
  currentPageIndex: number;
  totalPages: number;
  isResultModalOpen: boolean;
}
export interface IResultsProvider {
  results: IMovie[];
  paginatedResults: IMovie[];
  recommendedListing: IMovie[];
  keyword: string;
  loading: boolean;
  errorMessage: string | null;
  selectedItem: IMovie | null;
  perPage: number;
  currentPageIndex: number;
  totalPages: number;
  isResultModalOpen: boolean;
  getCurrentPage: () => number;
  getQueryParamsString: () => string;
  incrementPage: () => void;
  decrementPage: () => void;
  updateSelectedItem: (item: IMovie) => Promise<void>;
  setKeyword: (keyword: string) => void;
  getTotalPages: () => number;
  setModalOpenState: (state: boolean) => void;
}
