import React, { useEffect, useReducer } from "react"
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import queryString from 'query-string'

// Types
import { IResultsProvider, IResultsState, IMovie } from '../../../types/types'

// Helpers
import reducer from "./results.reducer"
import { fetchFullProgrammeDetails, fetchResults } from '../../../services/ResultsService'

// Components
import { Provider } from "./results.context"

const ResultsProvider = ({ children }: any) => {
  const searchTerms = queryString.parse(window.location.search)

  // State
  const [
    { results, paginatedResults, recommendedListing, keyword, loading, errorMessage, selectedItem, perPage, currentPageIndex, totalPages, isResultModalOpen },
    dispatch
  ]: any = useReducer(reducer, {
    results: [],
    paginatedResults: [],
    recommendedListing: [],
    keyword: searchTerms?.keyword,
    loading: false,
    errorMessage: null,
    selectedItem: null,
    perPage: 6,
    currentPageIndex: 0,
    totalPages: 0,
    isResultModalOpen: false,
  } as IResultsState)

  useEffect(() => {
    _isEmpty(keyword) && !loading && !recommendedListing.length ? getRecommended() : doSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  useEffect(() => {
    console.log('%c useEffect [updatePaginatedResults] -->', 'color: yellow;');
    updatePaginatedResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, currentPageIndex])

  const updatePaginatedResults = () => {
    console.log("updatePaginatedResults results", results);

    const paginationOffset = Math.abs(currentPageIndex as any * perPage)
    const to = Math.abs(paginationOffset as any + perPage)
    const paginated = results.slice(paginationOffset, to)

    dispatch({ type: "UPDATE_VALUE", key: "paginatedResults", value: paginated })
  }

  const resetResults = () => {
    console.log("resetResults");

    dispatch({ type: "UPDATE_VALUE", key: "results", value: [] })
    dispatch({ type: "UPDATE_VALUE", key: "currentPageIndex", value: 0 })
    dispatch({ type: "UPDATE_VALUE", key: "totalPages", value: 0 })
  }

  const doSearch = async () => {
    console.log('[doSearch] -->');

    if (results.length) resetResults()

    dispatch({ type: "UPDATE_VALUE", key: "loading", value: true })

    try {
      const response = await fetchResults(keyword)

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
    console.log("[getRecommended] -->")
    dispatch({ type: "UPDATE_VALUE", key: "loading", value: true })

    try {
      const response = await fetchResults('christmas')

      if (_get(response, 'data.movies', null)) {
        dispatch({ type: "UPDATE_VALUE", key: "recommendedListing", value: _get(response, 'data.movies', []) })
      } else {
        dispatch({ type: "UPDATE_VALUE", key: "recommendedListing", value: [] })
      }

      dispatch({ type: "UPDATE_VALUE", key: "loading", value: false })
    } catch (e) {
      dispatch({ type: "UPDATE_VALUE", key: "recommendedListing", value: [] })
      dispatch({ type: "UPDATE_VALUE", key: "loading", value: false })
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
        isResultModalOpen,
        getCurrentPage: () => Math.abs(currentPageIndex as any + 1),
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

