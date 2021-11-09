import { observable, action, computed } from 'mobx';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import axios from 'axios';
import queryString from 'query-string';

// types
import {
  IMovie,
  IQueryParams
} from '../types/types';

export default class ResultsStore {
  @observable keyword: string = '';
  @observable results: IMovie[] = [];
  @observable selectedItem: IMovie | null = null;
  @observable loading: boolean = false;
  @observable searched: boolean = false;
  @observable errorMessage: string | null = null;
  @observable perPage: Number = 9;
  @observable currentPageIndex: Number = 0;
  @observable totalPages: Number = 0;
  @observable queryParams: IQueryParams = {}

  @computed
  get getCurrentPage() {
    return  Math.abs(this.currentPageIndex as any + 1)
  }

  @computed
  get getTotalPages() {
    return  Math.ceil(Math.abs(this.totalPages as any))
  }

  /**
   * This is called when keyword is entered into the header search-box
   * @param input 
   */
  @action
  setKeyword = async (input: string) => {
    this.keyword = input

    this.setParams(true)
  };

  @action
  setParams = async (search: boolean = false) => {
    let params: any = {}

    if (this.keyword) {
      params.keyword = this.keyword
    }

    this.queryParams = params

    this.resetResults()

    if(search) await this.fetchResults()
  };

  @action
  getQueryParamsString = () => {
    let params: any = this.queryParams
    let queryString = null

    let queryParams = Object.keys(params)
    .map((key) => { 
      return (params[key] ? `${key}=${params[key]}` : null ) 
    })

    queryString = `${queryParams.filter(filter => filter !== null).join('&')}`;
    return queryString
  }

  @action
  incrementPage = async () => {
    if(Math.abs(this.currentPageIndex as any + 1) > this.totalPages ) return
    this.currentPageIndex = Math.abs(this.currentPageIndex as any + 1)
  };

  @action
  decrementPage = async () => {
    if(this.currentPageIndex <= 0) return
    this.currentPageIndex = Math.abs(this.currentPageIndex as any  - 1)
  };

  @action
  getPaginatedResults() {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const paginationOffset = Math.abs(this.currentPageIndex  as any  * <any>this.perPage)
    const to = Math.abs(paginationOffset as any + this.perPage)

    const paginated = this.results.slice(paginationOffset, to)
    return paginated
  }

  @action
  resetResults() {
    this.searched = false;
    this.results = []
    this.currentPageIndex = 0;
    this.totalPages = 0;
  }

  @action
  setSelectedItem = async (item: IMovie) => {
    this.selectedItem = null
    if(item.imdbID) await this.getFullDetails(item.imdbID)
  }

  @action
  fetchResults = async () => {
    this.loading = true;
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${this.keyword}`);
      
      if(get(response, 'data.Search')) {
        this.results = get(response, 'data.Search', []);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        this.totalPages = Math.abs(<any>this.results.length / <any>this.perPage)
      } else {
        if(get(response, 'data.Error')) this.errorMessage = get(response, 'data.Error')
        this.results = []
      }

      this.loading = false;
      this.searched = true;
     
    } catch (e) {
      console.error(e);
      this.results = []
      this.loading = false;
      this.searched = true;
    }
  };

  @action
  getFullDetails = async (id: string) => {
    if(!id) return

    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=6f575f76&&i=${id}`);
      
      if(get(response, 'data')) {
        this.selectedItem = get(response, 'data')
      } else {
        this.selectedItem = null
      }
    } catch (e) {
      console.error(e);
      this.selectedItem = null
    }
  };

  /**
   * Gets search terms from url query. Runs on component mount and update
  */
  @action
  getSearchTerms = () => {
    const searchTerms = queryString.parse(window.location.search)
      
    this.setSearchTerms(searchTerms);
  }

  /**
   * Updates the store with the pased in query params 
   * @param searchTerms 
  */
  @action
  setSearchTerms = async (searchTerms: { [key: string]: any }) => {
    forEach(searchTerms, (key, value) => {
      if (value === 'q') {
        this.keyword = key;
      }
    })

    this.setParams(true)
  }  
}
