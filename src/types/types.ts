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

export interface IQueryParams {
  keyword?: string;
}

export interface ResultsStoreContextType {
  keyword: string;
  selectedItem: IMovie | null;
  loading: boolean;
  searched: boolean ;
  errorMessage: string | null;
  perPage: Number;
  currentPageIndex: Number;
  totalPages: Number;
  queryParams: IQueryParams;
  recommendedListing: IMovie[];
  results: IMovie[];
  paginatedResults: IMovie[];
  setResults: () => Array<string>;
  setKeyword: () => Array<string>;
  setParams: () => Array<string>;
  updateKeyword: () => Array<string>;
  doSearch: () => Array<string>;
  getPaginatedResults: () => Array<string>;
  getSearchTerms: () => Array<string>;
  updateSelectedItem: () => Array<string>;
  getCurrentPage: () => number;
  incrementPage: () => void;
  decrementPage: () => void;
  getTotalPages: () => number;
};
