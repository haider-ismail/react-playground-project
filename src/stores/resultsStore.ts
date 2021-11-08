import { observable, action, computed } from 'mobx';
import get from 'lodash/get';
import axios from 'axios';

import {
  IMovie
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

  @computed
  get getCurrentPage() {
    return  Math.abs(this.currentPageIndex as any + 1)
  }

  @computed
  get getTotalPages() {
    return  Math.ceil(Math.abs(this.totalPages as any))
  }

  @action
  setKeyword = async (input: string) => {
    this.keyword = input;
    this.resetResults()

    if(this.keyword !== '') {
      await this.fetchResults();
      return
    }
  };

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
      const response = await axios.get(`http://www.omdbapi.com/?apikey=6f575f76&s=${this.keyword}`);
      
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

  
}
