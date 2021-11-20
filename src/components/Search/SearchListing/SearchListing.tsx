import React from 'react';

import { IMovie } from '../../../types/types';

import SearchResultCard from './../SearchResultCard';

interface IProps {
  resultItems: IMovie[];
  clickHandler: () => void;
}

const SearchListing: React.FC<IProps> = ({ resultItems, clickHandler }) => { 
  const handeClick = () => clickHandler()

  return (
    resultItems && 
      <div className="results-listing py-8 grid gap-5 grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" id="resultsListing" aria-live="polite">
        { resultItems.map((item: any) => <SearchResultCard clickHandler={() => handeClick()} item={item} key={`${item.imdbID}_${item.Year}`} />) }
      </div>
  )
}

export default SearchListing;
