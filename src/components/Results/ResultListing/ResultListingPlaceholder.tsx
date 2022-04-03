import React from 'react';

import ResultItemPlaceholder from '../ResultItem/ResultItemPlaceholder';

const ResultListingPlaceholder: React.FC = () => { 
  const dummyResultItems = [
    {
      imdbID: '1'
    },
    {
      imdbID: '2'
    },
    {
      imdbID: '3'
    },
    {
      imdbID: '4'
    },
    {
      imdbID: '5'
    }
  ]
  return (
    dummyResultItems && 
      <div className="results-listing py-8 grid gap-5 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" id="resultsListing" aria-live="polite">
        { dummyResultItems.map((item: any) => <ResultItemPlaceholder key={`placehlder_result_item_${item.imdbID}`} />) }
      </div>
  )
}

export default ResultListingPlaceholder;
