import React, { useEffect } from "react"
import _forEach from 'lodash/forEach'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import queryString from 'query-string'

// Types
import { IResultsProvider, IResultsState, IMovie } from '../../../types/types'

// Helpers
import reducer from "./results.reducer"
import { fetchFullProgrammeDetails, fetchResults } from '../../../services/ResultsService'

// Components
import { Provider } from "./result.context"

const ResultsProvider = ({ children }: any) => {

  // State
  const [
    { results, paginatedResults, recommendedListing, keyword, loading, errorMessage, selectedItem, perPage, currentPageIndex, totalPages, queryParams, isResultModalOpen },
    dispatch
  ]: any = React.useReducer(reducer, {
    results: [],
    paginatedResults: [],
    recommendedListing: [],
    keyword: "",
    loading: false,
    errorMessage: null,
    selectedItem: null,
    perPage: 6,
    currentPageIndex: 0,
    totalPages: 0,
    queryParams: {},
    isResultModalOpen: false,
  } as IResultsState)


  useEffect(() => {
    console.log('%c resultsProvider [useEffect] -->', 'color: yellow;');
    updatePaginatedResults()

    if (_isEmpty(queryParams) && !recommendedListing.length) getRecommended()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, recommendedListing])

  const updatePaginatedResults = () => {
    const paginationOffset = Math.abs(currentPageIndex as any * perPage)
    const to = Math.abs(paginationOffset as any + perPage)

    const paginated = results.slice(paginationOffset, to)

    console.log("paginated",paginated)
    

    dispatch({ type: "UPDATE_VALUE", key: "paginatedResults", value: paginated })
  }

  const resetResults = () => {
    dispatch({ type: "UPDATE_VALUE", key: "results", value: [] })
    dispatch({ type: "UPDATE_VALUE", key: "currentPageIndex", value: 0 })
    dispatch({ type: "UPDATE_VALUE", key: "totalPages", value: 0 })
  }

  const doSearch = async () => {
    console.log('[doSearch] -->');

    resetResults()

    dispatch({ type: "UPDATE_VALUE", key: "loading", value: true })

    try {
      const response = await fetchResults(keyword);

      if (_get(response, 'data.movies').length) {
        dispatch({ type: "UPDATE_VALUE", key: "results", value: _get(response, 'data.movies', []) })
        dispatch({ type: "UPDATE_VALUE", key: "totalPages", value: Math.abs(_get(response, 'data.movies', []).length / perPage) })
      } else {
        dispatch({ type: "UPDATE_VALUE", key: "errorMessage", value: _get(response, 'data.Error.Error') })
        dispatch({ type: "UPDATE_VALUE", key: "results", value: [] })
      }

      dispatch({ type: "UPDATE_VALUE", key: "loading", value: false })
    } catch (e) {
      console.error(e);
      resetResults()
      dispatch({ type: "UPDATE_VALUE", key: "loading", value: false })
    }
  }

  const getRecommended = async () => {
    try {
      const response = await fetchResults('christmas')

      if (_get(response, 'data.movies', []).length) {
        dispatch({ type: "UPDATE_VALUE", key: "recommendedListing", value: _get(response, 'data.movies', []) })
      } else {
        dispatch({ type: "UPDATE_VALUE", key: "recommendedListing", value: [] })
      }
    } catch (e) {
      dispatch({ type: "UPDATE_VALUE", key: "recommendedListing", value: [] })
    }
  }


  const getFullDetails = async (id: string) => {
    if (!id) return

    try {
      const response = await fetchFullProgrammeDetails(id)

      return response
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Updates the store with the pased in query params 
   * @param searchTerms 
  */
  const setSearchTerms = async (searchTerms: { [key: string]: any }) => {
    _forEach(searchTerms, (key, value) => {
      if (value === 'keyword') {
        dispatch({ type: "UPDATE_VALUE", key: "keyword", value: key })
      }
    })
  }

  return (
    <Provider
      value={{
        results,
        paginatedResults,
        recommendedListing,
        keyword,
        loading,
        errorMessage,
        selectedItem,
        perPage,
        currentPageIndex,
        totalPages,
        queryParams,
        isResultModalOpen,
        getCurrentPage: () => Math.abs(currentPageIndex as any + 1),
        getQueryParamsString: () => {
          let params: any = queryParams
          let queryString = null
          let queryParamsArr = Object.keys(params).map((key) => {
            return (params[key] ? `${key}=${params[key]}` : null)
          })

          queryString = `${queryParamsArr.filter(filter => filter !== null).join('&')}`

          return queryString
        },
        incrementPage: () => {
          if (Math.abs(currentPageIndex as any + 1) > totalPages) return

          dispatch({ type: "UPDATE_VALUE", key: "currentPageIndex", value: Math.abs(currentPageIndex as any + 1) })
          updatePaginatedResults()
        },
        decrementPage: () => {
          if (currentPageIndex <= 0) return

          dispatch({ type: "UPDATE_VALUE", key: "currentPageIndex", value: Math.abs(currentPageIndex as any - 1) })
          updatePaginatedResults()
        },
        updateSelectedItem: async (item: IMovie) => {
          console.log('updateSelectedItem: item:', item);
          if (!item.imdbID) return dispatch({ type: "UPDATE_VALUE", key: "selectedItem", value: null })

          const selectedItemDetails = await getFullDetails(item.imdbID)

          dispatch({ type: "UPDATE_VALUE", key: "selectedItem", value: selectedItemDetails })
        },
        // Gets search terms from url query. Runs on component mount and update
        getSearchTerms: () => {
          const searchTerms = queryString.parse(window.location.search)
          console.log('[getSearchTerms] --> searchTerms', searchTerms);

          setSearchTerms(searchTerms);
        },
        setParams: async (search: boolean = false) => {
          console.log('[setParams] --> search:', search);

          let params: any = {}

          if (keyword) {
            params.keyword = keyword
          }

          dispatch({ type: "UPDATE_VALUE", key: "queryParams", value: params })

          if (search && !_isEmpty(params)) await doSearch()
        },
        setKeyword: (keyword: string) => dispatch({ type: "UPDATE_VALUE", key: "keyword", value: keyword }),
        getTotalPages: () => Math.ceil(Math.abs(totalPages as any)),
        setModalOpenState: (state: boolean) =>
          dispatch({
            type: "UPDATE_VALUE",
            key: "isResultModalOpen",
            value: state,
          })
      } as IResultsProvider}
    >
      {children}
    </Provider>
  )
}

export default ResultsProvider

