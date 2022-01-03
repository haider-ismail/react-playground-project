import { useState } from "react";
import { IMovie, IQueryParams } from '../types/types';
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';

// services
import { fetchRecommended, fetchFullProgrammeDetails, fetchResults } from '../services/ResultsService';

export const useResultsStore = () => {
  const [results, setResults] = useState<IMovie[]>([])
  const [paginatedResults, setPaginatedResults] = useState<IMovie[]>([])
  const [recommendedListing, setRecommendedListing] = useState<IMovie[]>([])
  const [keyword, setKeyword] = useState<string>('')
  const [loading, setLoadingState] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string|null>(null)
  const [selectedItem, setSelectedItem] = useState<IMovie|null>(null)
  const [searched, setSearchedState] = useState<boolean>(false)
  const [perPage, setPerPage] = useState<number>(6)
  const [currentPageIndex, setCurrentPageIndex] = useState<Number>(0)
  const [totalPages, setTotalPages] = useState<Number>(0)
  const [queryParams, setQueryParams] = useState<IQueryParams>({})

  const getQueryParamsString = () => {
    let params: any = queryParams
    let queryString = null
    let queryParamsArr = Object.keys(params).map((key) => { 
      return (params[key] ? `${key}=${params[key]}` : null ) 
    })

    queryString = `${queryParamsArr.filter(filter => filter !== null).join('&')}`

    return queryString
  }


  const getCurrentPage = () => {
    return  Math.abs(currentPageIndex as any + 1)
  }

  const getTotalPages = () => {
    return  Math.ceil(Math.abs(totalPages as any))
  }

  const updatedPaginatedResults = () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const paginationOffset = Math.abs(currentPageIndex  as any  * perPage)
    const to = Math.abs(paginationOffset as any + perPage)

    const paginated = results.slice(paginationOffset, to)
    setPaginatedResults(paginated)
  }

  /**
   * This is called when keyword is entered into the header search-box
   * @param input 
   */
  const updateKeyword = async (input: string = '', search: boolean = false) => {
    console.log('[updateKeyword] --> input:', input);
    setKeyword(input)

    if (search) setParams(true)
  }

  const setParams = async (search: boolean = false) => {
    let params: any = {}

    if (keyword) {
      params.keyword = keyword
    }

    console.log('[setParams] --> search:', search, ', keywrod:', keyword, ', params: ', params);
    
    setQueryParams(params)
    
    if (search && !_isEmpty(params)) await doSearch()
    if (_isEmpty(params)) {
      // resetResults()
      if (!recommendedListing.length) await getRecommended()
    } 
  }

  const incrementPage = () => {
    
    if (Math.abs(currentPageIndex as any + 1) > totalPages ) return

    setCurrentPageIndex(Math.abs(currentPageIndex as any + 1))
    updatedPaginatedResults()
  }

  const decrementPage = () => {
    if (currentPageIndex <= 0) return

    setCurrentPageIndex(Math.abs(currentPageIndex as any  - 1))
    updatedPaginatedResults()
  }

  const resetResults = () => {
    setSearchedState(false)
    // setResults([])
    setCurrentPageIndex(0)
    setTotalPages(0)
  }

  const updateSelectedItem = async (item: IMovie) => {
    setSelectedItem(null)
    if (!item.imdbID) return

    await getFullDetails(item.imdbID)
  }

  const doSearch = async () => {
    resetResults()

    setLoadingState(true)

    try {
      const response = await fetchResults(keyword);

      console.log('[doSearch] --> keyword', keyword, ', response: ', response)
      
      if (_get(response, 'data.Search')) {
        setResults(_get(response, 'data.Search', []));
        setTotalPages(Math.abs(results.length / perPage))
        updatedPaginatedResults()
      } else {
        if (_get(response, 'data.Error')) setErrorMessage(_get(response, 'data.Error'))
        console.log('[doSearch] error --> reset results');
        setResults([])
      }

      setLoadingState(false)
      setSearchedState(true)
     
    } catch (e) {
      console.error(e);
      console.log('[doSearch] try/catch error --> reset results');
      setResults([])
      setLoadingState(false)
      setSearchedState(true)
    }
  }


  const getRecommended = async () => {
    console.log('[getRecommended] -->');
    
    try {
      const response = await fetchRecommended()
      
      if (_get(response, 'data.Search')) {
        setRecommendedListing(_get(response, 'data.Search', []))
      } else {
        setRecommendedListing([])
      }
    } catch (e) {
      setRecommendedListing([])
    }
  }


  const getFullDetails = async (id: string) => {
    if (!id) return

    try {
      const response = await fetchFullProgrammeDetails(id)
      
      if (_get(response, 'data')) {
        setSelectedItem(_get(response, 'data'))
      } else {
        setSelectedItem(null)
      }
    } catch (e) {
      console.error(e);
      setSelectedItem(null)
    }
  }

  /**
   * Gets search terms from url query. Runs on component mount and update
  */
  const getSearchTerms = () => {

    const searchTerms = queryString.parse(window.location.search)
    console.log('[getSearchTerms] --> searchTerms', searchTerms);
    
      
    setSearchTerms(searchTerms);
  }

  /**
   * Updates the store with the pased in query params 
   * @param searchTerms 
  */
  const setSearchTerms = async (searchTerms: { [key: string]: any }) => {
    _forEach(searchTerms, (key, value) => {
      if (value === 'keyword') {
        updateKeyword(key)
      }
    })
  }  


  return {
    results,
    paginatedResults,
    keyword, 
    loading, 
    errorMessage, 
    selectedItem, 
    recommendedListing,
    queryParams,
    setResults,
    updateKeyword,
    getQueryParamsString,
    doSearch,
    getSearchTerms,
    updateSelectedItem
  }
}