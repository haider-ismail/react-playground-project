import { observable, action, computed } from 'mobx';
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
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
  @observable recommendedListing: IMovie[] = [];
  @observable selectedItem: IMovie | null = null;
  @observable loading: boolean = false;
  @observable searched: boolean = false;
  @observable errorMessage: string | null = null;
  @observable perPage: Number = 6;
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
  }

  @action
  setParams = async (search: boolean = false) => {
    let params: any = {}

    console.log('[setParams] --> search:', search, ', keywrod:', this.keyword);
    

    if (this.keyword) {
      params.keyword = this.keyword
    }

    console.log('[setParams] --> params:', params);
    

    this.queryParams = params
    
    if (search && !_isEmpty(params)) await this.fetchResults()
    if (_isEmpty(params)) {
      this.resetResults()
      await this.fetchRecommended()
    } 
  }

  @action
  getQueryParamsString = () => {
    let params: any = this.queryParams
    let queryString = null
    let queryParams = Object.keys(params)
    .map((key) => { 
      return (params[key] ? `${key}=${params[key]}` : null ) 
    })

    queryString = `${queryParams.filter(filter => filter !== null).join('&')}`

    console.log('[getQueryParamsString] --> queryString: ', queryString);
    

    return queryString
  }

  @action
  incrementPage() {
    console.log('incrementPage');
    
    if (Math.abs(this.currentPageIndex as any + 1) > this.totalPages ) return
    this.currentPageIndex = Math.abs(this.currentPageIndex as any + 1)
    console.log('this.totalPages', this.totalPages);
    
    console.log('this.currentPageIndex', this.currentPageIndex);
    
  }

  @action
  decrementPage() {
    if (this.currentPageIndex <= 0) return
    this.currentPageIndex = Math.abs(this.currentPageIndex as any  - 1)

    console.log('decremt');
    console.log('this.totalPages', this.totalPages);
    
    console.log('this.currentPageIndex', this.currentPageIndex);
    
  }

  @action
  getPaginatedResults() {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const paginationOffset = Math.abs(this.currentPageIndex  as any  * <any>this.perPage)
    const to = Math.abs(paginationOffset as any + this.perPage)

    const paginated = this.results.slice(paginationOffset, to)

    console.log(`paginatedOffser: ${paginationOffset}, to: ${to}`);

    console.log('paginated', paginated);
    
    
    
    return paginated
  }

  @action
  resetResults() {
    this.searched = false;
    this.results = []
    this.currentPageIndex = 0
    this.totalPages = 0
  }

  @action
  setSelectedItem = async (item: IMovie) => {
    this.selectedItem = null
    if (item.imdbID) await this.getFullDetails(item.imdbID)
  }

  @action
  fetchResults = async () => {
    this.resetResults()

    console.log('[fetchResults] -->')

    this.loading = true;
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${this.keyword}`);
      
      if (_get(response, 'data.Search')) {
        this.results = _get(response, 'data.Search', []);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        this.totalPages = Math.abs(<any>this.results.length / <any>this.perPage)
      } else {
        if (_get(response, 'data.Error')) this.errorMessage = _get(response, 'data.Error')
        this.results = []
      }

      this.loading = false
      this.searched = true
     
    } catch (e) {
      console.error(e);
      this.results = []
      this.loading = false;
      this.searched = true;
    }
  }

  @action
  fetchRecommended = async () => {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=christmas`)
      
      if (_get(response, 'data.Search')) {
        this.recommendedListing = _get(response, 'data.Search', [])

        console.log('this.recommendedListing', this.recommendedListing)
        
      } else {
        this.recommendedListing = []
      }
    } catch (e) {
      console.error(e);
      this.recommendedListing = []
    }
  }

  @action
  getFullDetails = async (id: string) => {
    if (!id) return

    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=6f575f76&&i=${id}`);
      
      if (_get(response, 'data')) {
        this.selectedItem = _get(response, 'data')
      } else {
        this.selectedItem = null
      }
    } catch (e) {
      console.error(e);
      this.selectedItem = null
    }
  }

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
    _forEach(searchTerms, (key, value) => {
      if (value === 'keyword') {
        this.keyword = key;
      }
    })

    this.setParams(true)
  }  
}
