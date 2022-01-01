import React from 'react';
import { observer } from 'mobx-react';

import { useStores } from '../../../hooks/useStores'

interface IProps {
}

const ResultListingHeader: React.FC<IProps> = () => {
  const { resultsStore } = useStores()

  const results = resultsStore?.results

  const showNextPage = () => {
    if (resultsStore) resultsStore.incrementPage()
  }

  const showPreviousPage = () => {
    if (resultsStore) resultsStore.decrementPage()
  }
  
  return (
    <>
    <h2 className="text-3xl text-white">Search results</h2>
    <div className="results-listing__header flex flex-wrap justify-between items-center text-white font-bold">
      <div className="w-full sm:w-auto mb-6 sm:mb-0" >{results?.length} Results found for "{resultsStore?.keyword}"</div>

      <div className="flex items-center">
        <span className="text-lg">Page {resultsStore?.getCurrentPage} of {resultsStore?.getTotalPages}</span>

        { resultsStore && <div className="flex -mx-3 pl-6">
          <button onClick={() => showPreviousPage()} disabled={resultsStore.getCurrentPage === 1} className="py-2 p-3 border-2 border-white mx-3"><svg width="15" height="22" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M-1.31174e-07 11L11.25 20.5263L11.25 1.47372L-1.31174e-07 11Z" fill="#fff"/> </svg> </button>
          <button onClick={() => showNextPage()} disabled={resultsStore.getCurrentPage + 1 > resultsStore.getTotalPages} className="py-2 p-3 border-2 border-white mx-3"><svg width="15" height="22" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M15 11L3.75 20.5263L3.75 1.47372L15 11Z" fill="#fff"/> </svg> </button>
        </div> }
      </div>
    </div>
    </>
  )
}

export default observer(ResultListingHeader);
